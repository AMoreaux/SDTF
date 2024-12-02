import { SpecifyDesignTokenFormat } from '../../../definitions/index.js';
import { setInSDTFTree } from '../../utils/setInSDTFTree.js';
import { SDTFNodeState, TreeState } from '../../state/TreeState.js';
import { makeGetChildrenOfFilter } from '../../utils/makeGetChildrenOfFilter.js';
import { QueryContext } from './QueryContext.js';
import { CollectionState } from '../../state/CollectionState.js';
import { GroupState } from '../../state/GroupState.js';
import { computeIsContinuousNodesGraph } from './computeIsContinuousNodesGraph.js';
import { AliasReferenceSet } from '../../state/AliasReferenceSet.js';
import { TreeNodesState } from '../../state/TreeNodesState.js';
import { ViewsState } from '../../state/ViewsState.js';
import { TreePath } from '../../state/path/TreePath.js';

export type QueryResultDetail = {
  isRoot: boolean;
  parentPath: TreePath;
  isComplete: boolean;
  nodes: Array<SDTFNodeState>;
  sdtf: SpecifyDesignTokenFormat;
};

export type MergeDedupeFn = ((treeState: TreeState, node: SDTFNodeState) => void) | true;

/**
 * The QueryResult class provides an abstraction to work with the tree node returned by a SDTF query.
 */
export class QueryResult<NodeState extends SDTFNodeState = SDTFNodeState> extends Array<NodeState> {
  #nodeTypesSet: Set<'collection' | 'group' | 'token'>;
  #treeState: TreeState;

  constructor(queryContext: QueryContext, treeState: TreeState) {
    super(...(queryContext.nodeStates as Array<NodeState>));
    this.#nodeTypesSet = queryContext.nodeTypesSet;
    this.#treeState = treeState;
  }

  // This allows native Array methods to work
  // Basically when using `map`, `filter`, etc... It'll build a new instance,
  // the problem is that by default it'll use the constructor and it expects `queryContext` and `treeState`
  // By defining this, we say that natives functions have to use `Array` for the constructor
  static get [Symbol.species]() {
    return Array;
  }

  /**
   * Indicates whether the selected nodes are part of the same resulting JSON tree.
   */
  get isContinuous() {
    return computeIsContinuousNodesGraph(this.toArray());
  }

  protected dedupeFn(treeState: TreeState, node: SDTFNodeState, inc: number = 1) {
    const newName = `${node.name}-${inc}`;
    if (treeState.isAvailablePath(new TreePath([newName], newName))) {
      if (node instanceof CollectionState) {
        treeState.renameCollection(node.path, newName);
      } else if (node instanceof GroupState) {
        treeState.renameGroup(node.path, newName);
      } else {
        treeState.renameToken(node.path, newName);
      }
    } else {
      this.dedupeFn(treeState, node, inc + 1);
    }
  }

  /**
   * Check if the result contains some nodes of the specified type.
   * @param nodeType
   */
  public hasNodeType(nodeType: 'collection' | 'group' | 'token') {
    return this.#nodeTypesSet.has(nodeType);
  }

  /**
   * Check if the result contains only nodes of the specified type.
   * @param nodeType
   */
  public hasOnlyNodeType(nodeType: 'collection' | 'group' | 'token') {
    return this.#nodeTypesSet.size === 1 && this.#nodeTypesSet.has(nodeType);
  }

  /**
   * Produces an analysis of the resulting nodes.
   */
  public render(): Array<QueryResultDetail> {
    const sortedNodesInResults = this.toArray().sort((a, b) => a.path.length - b.path.length);

    const allStringPathsInResults = sortedNodesInResults.map(node => node.path.toString());

    const parentPathByChildString = new Map<string, TreePath>();

    const groupedByRootNode = sortedNodesInResults.reduce((acc, node) => {
      const parentPathString = node.path.slice(0, -1).toString();

      let parentPath = parentPathByChildString.get(parentPathString);

      if (!parentPath) {
        parentPath = node.path.slice(0, -1);
        parentPathByChildString.set(parentPath.toString(), parentPath);
      }

      const hasParentInResults = allStringPathsInResults.includes(parentPath.toString());

      if (!hasParentInResults) {
        const childrenInResults = sortedNodesInResults.filter(makeGetChildrenOfFilter(node.path));

        if (acc.has(parentPath)) {
          const nodes = acc.get(parentPath)!;

          nodes.push(node);

          for (const node of childrenInResults) {
            nodes.push(node);
          }
        } else {
          acc.set(parentPath, [node, ...childrenInResults]);
        }
      }

      return acc;
    }, new Map<TreePath, Array<NodeState>>());

    const result = [];

    for (const [parentPath, nodes] of groupedByRootNode.entries()) {
      let allChildren;
      if (parentPath.length === 0) {
        // @ts-expect-error - protected property
        allChildren = nodes[0].treeState.getAllNodeStates();
      } else {
        allChildren = nodes[0].getParent()?.getAllChildren();
      }

      const isComplete = allChildren.length === nodes.length;

      const sdtf = {} as SpecifyDesignTokenFormat;
      nodes.forEach(child => {
        setInSDTFTree(
          sdtf,
          // We shorten the path by removing the root node path
          parentPath.length > 0 ? child.path.slice(parentPath.length) : child.path,
          child.getJSONProperties(),
        );
      });

      result.push({
        isRoot: parentPath.length === 0,
        parentPath,
        isComplete,
        nodes,
        sdtf,
      });
    }

    return result;
  }

  /**
   * Produces a new tree state with the resulting nodes.
   * @param dedupeFn
   */
  public merge(dedupeFn?: MergeDedupeFn): {
    treeState: TreeState;
  } {
    const sortedNodesInResults = this.toArray().sort((a, b) => a.path.length - b.path.length);
    const allStringPathsInResults = sortedNodesInResults.map(node => node.path.toString());

    const treeStateCopy = this.#treeState.clone();

    const newTreeState = sortedNodesInResults
      .reduce((acc, node) => {
        // We find the references into the cloned tree state
        const maybeNode =
          node instanceof CollectionState
            ? treeStateCopy.getCollectionState(node.path.toString())
            : node instanceof GroupState
              ? treeStateCopy.getGroupState(node.path.toString())
              : treeStateCopy.getTokenState(node.path.toString());

        if (maybeNode) {
          acc.push(maybeNode);
        }
        return acc;
      }, [] as Array<SDTFNodeState>)
      .map(node => {
        const parentPath = node.path.slice(0, -1);

        const isARootNode =
          parentPath.length > 0 && !allStringPathsInResults.includes(parentPath.toString());

        if (isARootNode) {
          const nodeIndex = allStringPathsInResults.indexOf(node.path.toString());
          if (!treeStateCopy.isAvailablePath(new TreePath([node.name], node.name)) && dedupeFn) {
            if (typeof dedupeFn === 'function') {
              dedupeFn(treeStateCopy, node);
            } else {
              this.dedupeFn(treeStateCopy, node);
            }
          }
          if (node instanceof CollectionState) {
            treeStateCopy.moveCollection(node.path, TreePath.empty());
          } else if (node instanceof GroupState) {
            treeStateCopy.moveGroup(node.path, TreePath.empty());
          } else {
            treeStateCopy.moveToken(node.path, TreePath.empty());
          }
          allStringPathsInResults[nodeIndex] = node.path.toString();
        }
        return node;
      })
      .reduce(
        (treeState, node) => {
          if (node instanceof CollectionState) {
            treeState.addCollection(node.path, node.getJSONProperties());
          } else if (node instanceof GroupState) {
            treeState.addGroup(node.path, node.getJSONProperties());
          } else {
            treeState.addToken(node.path, node.getJSONProperties());
          }
          return treeState;
        },
        new TreeState({
          globalState: new TreeNodesState(),
          aliasReferences: new AliasReferenceSet(),
          viewsState: new ViewsState(),
          activeViewName: null,
        }),
      );

    return {
      treeState: newTreeState,
    };
  }

  public getPaths(type: 'string'): Array<string>;
  public getPaths(type: 'array'): Array<Array<string>>;
  public getPaths(type?: undefined): Array<string>;
  public getPaths(type?: 'string' | 'array') {
    return this.toArray().map(node =>
      type === 'array' ? node.path.toArray() : node.path.toString(),
    );
  }

  /**
   * Renders the resulting nodes as a JSON object using the QueryResultDetail structure.
   */
  public toJSON() {
    return {
      isContinuous: this.isContinuous,
      graphs: this.render().map(detail => ({
        isRoot: detail.isRoot,
        parentPath: detail.parentPath,
        isComplete: detail.isComplete,
        sdtf: detail.sdtf,
      })),
    };
  }

  /**
   * @internal
   */
  public toArray() {
    return Array.from(this);
  }
}
