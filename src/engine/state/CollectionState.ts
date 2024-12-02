import {
  SpecifyCollectionSettings,
  specifyDesignTokenValueModeSchema,
} from '../../definitions/index.js';
import { SpecifyDesignTokenCollectionProperties } from '../../definitions/internals/designTokenCollection.js';
import { SDTFError } from '../../errors/index.js';
import { TreeNodeInterface, TreeNodeState } from './TreeNodeState.js';
import { TreeState } from './TreeState.js';
import { TreeNodeExtensions } from '../../definitions/internals/designTokenTree.js';
import { TokenState } from './TokenState.js';
import { GroupState } from './GroupState.js';
import { AnalyzedSDTFNode } from '../parser/internals/AnalyzedSDTFNode.js';
import { deepClone } from '../utils/deepClone.js';
import { AnalyzedCollection } from '../parser/internals/parseRawCollection.js';
import { TreePath } from './path/TreePath.js';

export type CollectionAllowedModes = [string, ...Array<string>];

export type CollectionStateParams = AnalyzedSDTFNode & {
  $description?: string | undefined;
  $extensions?: TreeNodeExtensions | undefined;
  allowedModes: Array<string>;
};

export class CollectionState extends TreeNodeState implements TreeNodeInterface {
  readonly isToken = false;
  readonly isGroup = false;
  readonly isCollection = true;
  readonly #parentCollection: CollectionState | undefined;
  readonly #allowedModes: [string, ...Array<string>] = [] as any;

  constructor(
    treeState: TreeState,
    { path, name, $description, $extensions, allowedModes }: CollectionStateParams,
  ) {
    super(treeState, {
      path,
      name,
      $description,
      $extensions,
    });

    this.#allowedModes = allowedModes as CollectionAllowedModes;
  }

  /**
   * Get the allowed modes of the Collection or its parent collection (recursively).
   */
  public get allowedModes() {
    return this.#allowedModes;
  }

  /**
   * Get the allowed modes of the Collection exclusively.
   */
  public get innerAllowedModes() {
    return this.#allowedModes;
  }

  /**
   * Use `innerAllowedModes` instead.
   * @deprecated
   */
  public getAllowedModes() {
    return this.#allowedModes;
  }

  /**
   * Use `allowedModes` instead.
   * @deprecated
   */
  public resolveAllowedModes() {
    return this.allowedModes;
  }

  /**
   * Get the JSON object corresponding to `$collection`.
   */
  public getCollectionSettings(): SpecifyCollectionSettings {
    return {
      $modes: this.#allowedModes,
    };
  }

  /**
   * Returns all direct group children of the Collection
   */
  public getGroupChildren() {
    return this.treeState.getGroupChildrenOf(this.path, 1);
  }

  /**
   * Returns all direct tokens children of the Collection
   */
  public getTokenChildren() {
    return this.treeState.getTokenChildrenOf(this.path, 1);
  }

  /**
   * Returns all group children of the Collection
   */
  public getAllGroupChildren() {
    return this.treeState.getGroupChildrenOf(this.path);
  }

  /**
   * Returns all token children of the Collection
   */
  public getAllTokenChildren() {
    return this.treeState.getTokenChildrenOf(this.path);
  }

  /**
   * Rename the Collection
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
   * Rename a mode of the Collection - recursively renaming all token children modes
   * @param fromMode
   * @param toMode
   */
  public renameMode(fromMode: string, toMode: string) {
    const parsedToMode = specifyDesignTokenValueModeSchema.parse(toMode, {
      path: this.path.toArray(),
    });

    if (this.#allowedModes.includes(parsedToMode)) {
      throw new SDTFError(
        'SDTF_MODE_RENAME_FAILED',
        `Collection "${this.path.toString()}" tried to rename mode "${fromMode}" to "${parsedToMode}", but "${parsedToMode}" is already in the allowed modes: ${this.#allowedModes
          .map(c => `"${c}"`)
          .join(',')}.`,
      );
    }

    const index = this.#allowedModes.indexOf(fromMode);
    if (index === -1) {
      throw new SDTFError(
        'SDTF_MODE_RENAME_FAILED',
        `Collection "${this.path.toString()}" tried to rename mode "${fromMode}" to "${parsedToMode}", but "${fromMode}" is not in the allowed modes: ${this.#allowedModes
          .map(c => `"${c}"`)
          .join(',')}.`,
      );
    }

    this.#allowedModes[index] = parsedToMode;

    // Rename all children modes
    this.treeState.getTokenChildrenOf(this.path).forEach(token => {
      token.renameMode(fromMode, parsedToMode);
    });
  }

  /**
   * Delete a mode of the Collection - recursively delete all token children mode value
   * @param mode
   */
  public deleteMode(mode: string) {
    const parsedToMode = specifyDesignTokenValueModeSchema.parse(mode, {
      path: this.path.toArray(),
    });

    const index = this.#allowedModes.indexOf(mode);
    if (index === -1) {
      throw new SDTFError(
        'SDTF_MODE_DELETE_FAILED',
        `Collection "${this.path.toString()}" tried to delete mode "${mode}", but "${mode}" is not in the allowed modes: ${this.#allowedModes
          .map(c => `"${c}"`)
          .join(',')}.`,
      );
    }

    if (this.#allowedModes.length - 1 === 0) {
      throw new SDTFError(
        'SDTF_MODE_DELETE_FAILED',
        `Collection "${this.path.toString()}" tried to delete mode "${mode}", but it is the last mode of the collection.`,
      );
    }

    this.#allowedModes.splice(index, 1);

    // Rename all children modes
    this.treeState.getTokenChildrenOf(this.path, undefined, { withView: null }).forEach(token => {
      token.deleteModeValue(parsedToMode);
    });
  }
  /**
   * Get serializable JSON representation of the Collection
   * @internal
   */
  public getJSONProperties(): SpecifyDesignTokenCollectionProperties {
    return {
      $collection: { $modes: this.#allowedModes },
      ...super.getCommonJSON(),
    };
  }

  /**
   * Get serializable JSON representation of the Collection with its children
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

    if (toPathMaybeCollectionState) {
      throw new SDTFError(
        'SDTF_MOVE_FAILED',
        `Node "${toPath}" is a collection. Target a group or the root node "[]".`,
      );
    }

    if (!isMovingToRootLevel && !toPathMaybeGroupState) {
      const maybeTokenState = this.treeState.getTokenState(toPath);
      if (maybeTokenState) {
        throw new SDTFError(
          'SDTF_MOVE_FAILED',
          `Node "${toPath}" is a token. Target a group or the root node "[]".`,
        );
      }
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Node "${toPath}" does not exist.`);
    }

    if (this.path.isRootOf(toPath)) {
      throw new SDTFError(
        'SDTF_MOVE_FAILED',
        `Node "${toPath}" is a child of the current node "${this.path}".`,
      );
    }

    if (toPathParentCollectionState) {
      throw new SDTFError(
        'SDTF_MOVE_FAILED',
        `Nesting collection is not allowed. Node "${toPath}" include a collection as parents at path "${toPathParentCollectionState.path}".`,
      );
    }
    const toPathWithName = toPath.clone().append(this.name);
    if (this.path.isNotEqual(toPathWithName)) {
      const children = this.treeState.getChildrenOf(this.path, 1);
      this.setPath(toPathWithName);
      children.forEach(child => {
        if (child instanceof TokenState) {
          child.move(toPathWithName.clone());
        }
        if (child instanceof GroupState) {
          child.move(toPathWithName.clone());
        }
      });
    }

    this.treeState.refreshViews();
  }

  public toCollectionStateParams(): CollectionStateParams {
    return {
      path: this.path.clone(),
      name: this.name,
      $description: this.description,
      $extensions: deepClone(this.extensions),
      allowedModes: deepClone(this.#allowedModes),
    };
  }

  public toAnalyzedCollection(): AnalyzedCollection {
    const allowedModes = deepClone(this.#allowedModes);
    return {
      path: this.path.clone(),
      name: this.name,
      $description: this.description,
      $extensions: deepClone(this.extensions),
      $collection: { $modes: allowedModes },
      allowedModes,
    };
  }
}
