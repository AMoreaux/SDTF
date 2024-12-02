import { SpecifyDesignTokenGroupProperties } from '../../definitions/internals/designTokenGroup.js';
import { TreeNodeInterface, TreeNodeState } from './TreeNodeState.js';
import { TreeState } from './TreeState.js';
import { SDTFError } from '../../errors/index.js';
import { TokenState } from './TokenState.js';
import { CollectionState } from './CollectionState.js';
import { AnalyzedSDTFNode } from '../parser/internals/AnalyzedSDTFNode.js';
import { deepClone } from '../utils/deepClone.js';
import { AnalyzedGroup } from '../parser/internals/parseRawGroup.js';
import { TreePath } from './path/TreePath.js';

export type GroupStateParams = AnalyzedSDTFNode & SpecifyDesignTokenGroupProperties;

export class GroupState extends TreeNodeState implements TreeNodeInterface {
  readonly isToken = false;
  readonly isGroup = true;
  readonly isCollection = false;
  constructor(
    treeState: TreeState,
    { path, name, $description, $extensions }: GroupStateParams, // path: Array<string>, // groupProperties: SpecifyDesignTokenGroupProperties,
  ) {
    super(treeState, {
      path,
      name,
      $description,
      $extensions,
    });
  }

  /**
   * Returns all direct group children of the Group
   */
  public getGroupChildren() {
    return this.treeState.getGroupChildrenOf(this.path, 1);
  }
  /**
   * Returns all direct token children of the Group
   */
  public getTokenChildren() {
    return this.treeState.getTokenChildrenOf(this.path, 1);
  }
  /**
   * Returns all direct collection children of the Group
   */
  public getCollectionChildren() {
    return this.treeState.getCollectionChildrenOf(this.path, 1);
  }

  /**
   * Returns all token children of the Group
   */
  public getAllTokenChildren() {
    return this.treeState.getTokenChildrenOf(this.path);
  }

  /**
   * Returns all group children of the Group
   */
  public getAllGroupChildren() {
    return this.treeState.getGroupChildrenOf(this.path);
  }

  /**
   * Returns all collection children of the Group
   */
  public getAllCollectionChildren() {
    return this.treeState.getCollectionChildrenOf(this.path);
  }

  /**
   * Rename the Group
   * @param newName
   */
  public rename(newName: string) {
    const previousPath = this.path.clone();
    const hasBeenRenamed = super.rename(newName);

    if (!hasBeenRenamed) {
      return false;
    }

    // Rename all children
    this.treeState.updateChildrenPaths(previousPath, newName);

    // Rename all aliasReferences
    // Done by reference since from.treePath and to.treePath are bound to TreeNodeState.path

    return true;
  }
  /**
   * Get serializable JSON representation of the Group
   * @internal
   */
  public getJSONProperties() {
    return super.getCommonJSON();
  }
  /**
   * Get serializable JSON representation of the Group with its children
   * @internal
   */
  public toJSON() {
    const tree = {};
    this.treeState.populateJSONChildrenOf(this.path, tree);
    return Object.assign(tree, this.getJSONProperties());
  }

  public move(toPath: TreePath): void {
    const isMovingToRootLevel = toPath.length === 0;

    let toPathMaybeGroupState = undefined;
    let toPathMaybeCollectionState = undefined;
    let toPathParentCollectionState = undefined;

    if (!isMovingToRootLevel) {
      // We check if the target path is a collection
      const maybeCollectionState = this.treeState.getCollectionState(toPath);
      if (maybeCollectionState) {
        toPathMaybeCollectionState = maybeCollectionState;
      } else {
        // If `toPath` is not a collection, we can check if `toPath` is a group...
        toPathMaybeGroupState = this.treeState.getGroupState(toPath);

        // and holds a parent collection
        toPathParentCollectionState = this.treeState.getNearestCollectionState(toPath);
      }
    }

    if (!isMovingToRootLevel && !toPathMaybeGroupState && !toPathMaybeCollectionState) {
      const maybeTokenState = this.treeState.getTokenState(toPath);
      if (maybeTokenState) {
        throw new SDTFError(
          'SDTF_MOVE_FAILED',
          `Node "${toPath}" is a token. Target a group, a collection or the root node "[]".`,
        );
      }
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Node "${toPath}" does not exist.`);
    }

    if (this.path.isRootOf(toPath)) {
      throw new SDTFError(
        'SDTF_MOVE_FAILED',
        `Node "${toPath}" is a child of the current group "${this.path}".`,
      );
    }

    const collectionsOfGroup = this.getAllCollectionChildren();

    if ((toPathParentCollectionState || toPathMaybeCollectionState) && collectionsOfGroup.length) {
      throw new SDTFError(
        'SDTF_MOVE_FAILED',
        `Node "${this.path}" include a collection "${
          collectionsOfGroup[0].path
        }" that cannot be moved to another collection "${
          toPathParentCollectionState
            ? toPathParentCollectionState?.path.toString()
            : toPathMaybeCollectionState
              ? toPathMaybeCollectionState.path.toString()
              : ''
        }".`,
      );
    }

    const toPathWithName = toPath.clone().append(this.name);
    if (this.path.isNotEqual(toPath)) {
      const children = this.treeState.getChildrenOf(this.path, 1);
      this.setPath(toPathWithName.clone());
      children.forEach(child => {
        if (child instanceof TokenState) {
          child.move(toPathWithName);
        }
        if (child instanceof GroupState) {
          child.move(toPathWithName);
        }
        if (child instanceof CollectionState) {
          child.move(toPathWithName);
        }
      });
    }

    this.treeState.refreshViews();
  }

  public toGroupStateParams(): GroupStateParams {
    return {
      path: this.path.clone(),
      name: this.name,
      $description: this.description,
      $extensions: deepClone(this.extensions) as any,
    };
  }

  public toAnalyzedGroup(): AnalyzedGroup {
    return {
      path: this.path.clone(),
      name: this.name,
      $description: this.description,
      $extensions: deepClone(this.extensions) as any,
    };
  }
}
