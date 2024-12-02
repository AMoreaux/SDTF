import type {
  SDTFEngineSerializedMetadata,
  SDTFEngineSerializedState,
} from '../SDTFEngineSerializedState.js';
import { SDTFError } from '../../errors/index.js';
import {
  TreeNodeDescription,
  TreeNodeExtensions,
} from '../../definitions/internals/designTokenTree.js';
import {
  PickSpecifyDesignToken,
  SpecifyDesignToken,
  SpecifyDesignTokenFormat,
  SpecifyDesignTokenGroupProperties,
  SpecifyDesignTokenTypeName,
} from '../../definitions/index.js';
import { GetJSONTokenValueOptions, TokenState } from './TokenState.js';
import { GroupState } from './GroupState.js';
import { CollectionState } from './CollectionState.js';
import { SDTFQuery } from '../query/index.js';
import { SpecifyDesignTokenCollectionProperties } from '../../definitions/internals/designTokenCollection.js';
import {
  AliasReference,
  AliasReferenceSet,
  ResolvableAliasReference,
  ResolvedStatefulAliasReference,
  StatefulAliasReference,
  UnresolvableAliasReference,
  UnresolvableStatefulAliasReference,
} from './AliasReferenceSet.js';
import { setInSDTFTree } from '../utils/setInSDTFTree.js';
import { UnresolvableTokenState } from './UnresolvableTokenState.js';
import { SpecifyDesignTokenValueWithMode } from '../../definitions/internals/designTokenSignature.js';
import { JSONObject } from '../../utils/JSONDefinitions.js';
import { TreeNodesState } from './TreeNodesState.js';
import { ViewState } from './ViewState.js';
import { ViewsState } from './ViewsState.js';
import { parseRawCollection } from '../parser/internals/parseRawCollection.js';
import { parseRawGroup } from '../parser/internals/parseRawGroup.js';
import { createTreeState } from '../builder/createTreeState.js';
import { parseRawToken } from '../parser/internals/parseRawToken.js';
import { computeDeepModesResolvability } from '../parser/internals/computeDeepModesResolvability.js';
import { analyzeValueAliasPart } from '../parser/internals/analyzeValueAliasPart.js';
import { TreeNodeSet } from './TreeNodeSet.js';

import { checkForTokenModesInCollection } from '../parser/internals/checkForTokenModesInCollection.js';
import { fillAliasReferences } from '../builder/fillAliasReferences.js';
import { TreePath } from './path/TreePath.js';

export type SDTFNodeState = TokenState | GroupState | CollectionState;

export type ViewSelectorOptions = {
  withView?: string | null;
};

export type TreeStateParams = {
  globalState: TreeNodesState;
  aliasReferences: AliasReferenceSet;
  viewsState: ViewsState;
  activeViewName: string | null;
};

export class TreeState {
  private readonly global: TreeNodesState;
  private readonly aliasReferences: AliasReferenceSet;
  private current: TreeNodesState;

  readonly #viewsState: ViewsState;
  #activeViewName: string | null = null;

  constructor(
    { globalState, aliasReferences, viewsState, activeViewName }: TreeStateParams, // metadata?: SDTFEngineSerializedMetadata, // tokenTree: unknown = {},
  ) {
    this.global = globalState;
    this.aliasReferences = aliasReferences;
    this.#viewsState = viewsState;
    this.#activeViewName = activeViewName;

    if (this.#activeViewName) {
      const maybeView = this.#viewsState.get(this.#activeViewName);
      if (!maybeView) {
        throw new SDTFError(
          'SDTF_VIEW_NOT_FOUND',
          `View "${this.#activeViewName}" does not exist.`,
        );
      }
      this.current = maybeView.nodes;
    } else {
      this.current = this.global;
    }
  }

  public reset() {
    this.disableViews();
    this.global.clear();
    this.aliasReferences.clear();
    this.#viewsState.clear();
  }

  /* ------------------------------------------
     Views management
  --------------------------------------------- */
  public refreshViews() {
    this.#viewsState.forEach(view => view.refresh(this));
  }

  public listViews() {
    return this.#viewsState.values().map(view => ({
      name: view.name,
      query: view.query,
      isActive: view.name === this.#activeViewName,
    }));
  }

  public getActiveView() {
    if (this.#activeViewName === null) {
      return null;
    }
    const maybeView = this.#viewsState.get(this.#activeViewName);
    /* v8 ignore next line */
    if (!maybeView) throw new SDTFError('SDTF_INTERNAL_DESIGN_ERROR', `View must exist.`);
    return maybeView.serialize();
  }

  public registerView(name: string, query: SDTFQuery, shouldSetActive?: boolean) {
    this.#viewsState.register(name, query, this);

    if (shouldSetActive === true) {
      const view = this.#viewsState.get(name);
      if (!view) {
        throw new SDTFError('SDTF_VIEW_NOT_FOUND', `View "${name}" does not exist.`);
      }
      this.#activeViewName = name;
      this.current = view.nodes;
    }
  }

  public updateView(name: string, query: SDTFQuery, shouldSetActive?: boolean) {
    this.#viewsState.updateQuery(name, query, this);

    if (shouldSetActive === true) {
      const view = this.#viewsState.get(name);
      if (!view) {
        throw new SDTFError('SDTF_VIEW_NOT_FOUND', `View "${name}" does not exist.`);
      }
      this.#activeViewName = name;
      this.current = view.nodes;
    }
  }

  public setActiveView(name: string | null) {
    if (name === null) {
      this.disableViews();
    } else {
      if (!this.#viewsState.has(name)) {
        throw new SDTFError('SDTF_VIEW_NOT_FOUND', `View "${name}" does not exist.`);
      }
      this.#activeViewName = name;
      const viewState = this.#viewsState.get(name) as ViewState;
      this.current = viewState.nodes;
    }
  }

  public deleteView(name: string) {
    if (this.#activeViewName === name) {
      this.#activeViewName = null;
      this.current = this.global;
    }
    return this.#viewsState.delete(name);
  }

  public deleteAllViews() {
    this.#activeViewName = null;
    this.current = this.global;
    this.#viewsState.clear();
  }

  public disableViews() {
    this.current = this.global;
    this.#activeViewName = null;
  }

  public withViewNodesState<T>(
    viewName: string | null | undefined,
    fn: (nodes: TreeNodesState) => T,
  ) {
    if (viewName === undefined) {
      return fn(this.current);
    }
    if (viewName === null) {
      return fn(this.global);
    }
    const maybeView = this.#viewsState.get(viewName);
    if (!maybeView) {
      throw new SDTFError('SDTF_VIEW_NOT_FOUND', `View "${viewName}" does not exist.`);
    }
    return fn(maybeView.nodes);
  }

  /* ------------------------------------------
     Aliases management
  --------------------------------------------- */
  public addAliasReference(candidate: AliasReference) {
    const hasReference = this.aliasReferences.hasFrom(candidate.from);
    if (!hasReference) {
      this.aliasReferences.add(candidate);
    } else {
      throw new SDTFError(
        'SDTF_CIRCULAR_ALIAS_REFERENCE_FOUND',
        `Reference to "${candidate.from.valuePath}" is circular.`,
      );
    }
  }

  public updateAliasReference(at: AliasReference['from'], candidate: AliasReference) {
    this.aliasReferences.updateAtFrom(at, candidate);
  }

  public upsertAliasReference(candidate: AliasReference) {
    this.aliasReferences.upsertAtFrom(candidate);
  }

  public getAliasReference(from: AliasReference['from']) {
    return this.aliasReferences.getOne(from);
  }

  public getAllAliasReferences() {
    return Array.from(this.aliasReferences);
  }

  public getAliasReferencesTo<
    O extends { isResolvable?: boolean },
    R extends O extends { isResolvable: true }
      ? Array<ResolvableAliasReference>
      : O extends { isResolvable: false }
        ? Array<UnresolvableAliasReference>
        : Array<AliasReference>,
  >(
    to: {
      treePath: AliasReference['to']['treePath'];
      mode?: AliasReference['to']['mode'];
    },
    options?: O,
  ): R {
    return this.aliasReferences.getManyTo(to, options) as R;
  }

  public getAliasReferencesFrom<
    O extends { isResolvable?: boolean },
    R extends O extends { isResolvable: true }
      ? Array<ResolvableAliasReference>
      : O extends { isResolvable: false }
        ? Array<UnresolvableAliasReference>
        : Array<AliasReference>,
  >(
    from: {
      treePath: AliasReference['from']['treePath'];
      valuePath?: AliasReference['from']['valuePath'];
      mode?: AliasReference['from']['mode'];
    },
    options?: O,
  ): R {
    return this.aliasReferences.getManyFrom(from, options) as R;
  }

  public getDeepAliasReferencesFrom(from: {
    treePath: AliasReference['from']['treePath'];
    valuePath: AliasReference['from']['valuePath'];
    mode: AliasReference['from']['mode'];
  }) {
    return this.aliasReferences.getOneDeepFrom(from);
  }

  public getAliasReferenceOrParentFrom(from: {
    treePath: AliasReference['from']['treePath'];
    valuePath: AliasReference['from']['valuePath'];
    mode: AliasReference['from']['mode'];
  }) {
    return this.aliasReferences.getOneOrParentFrom(from);
  }

  /**
   * Retrieve the target coordinates from a starting point.
   * E.g, if you want the value of a dimension, it'll tell you where is the JSON value.
   * It'll be either on a number token, or the value of a dimension token.
   */
  public getDeepAliasReferenceAndPathInfoFrom(from: {
    treePath: AliasReference['from']['treePath'];
    valuePath: AliasReference['from']['valuePath'];
    mode: AliasReference['from']['mode'];
  }) {
    return this.aliasReferences.getOneDeepAndPathInfosFrom(from);
  }

  public deleteAliasReferencesFrom(from: {
    treePath: AliasReference['from']['treePath'];
    valuePath?: AliasReference['from']['valuePath'];
    mode: AliasReference['from']['mode'];
  }) {
    return this.aliasReferences.deleteManyFrom(from);
  }

  public getStatefulAliasReference(from: AliasReference['from']): StatefulAliasReference {
    const maybeAlias = this.aliasReferences.getOne(from);
    if (!maybeAlias) {
      return {
        status: 'unresolvable',
        from,
        to: {
          treePath: TreePath.empty(),
          mode: null,
        },
        unresolvableTokenState: new UnresolvableTokenState(
          this,
          TreePath.empty(),
          'Unknown alias reference',
        ),
      };
    }
    const maybeTokenState = this.getTokenState(maybeAlias.to.treePath, { withView: null });
    if (maybeTokenState) {
      return {
        status: 'resolved',
        from,
        to: maybeAlias.to,
        tokenState: maybeTokenState,
      };
    }
    return {
      status: 'unresolvable',
      from,
      to: maybeAlias.to,
      unresolvableTokenState: new UnresolvableTokenState(
        this,
        maybeAlias.to.treePath,
        `Could not find token "${maybeAlias.to.treePath}".`,
      ),
    };
  }

  public getStatefulAliasReferencesTo<
    O extends { isResolvable?: boolean },
    R extends O extends { isResolvable: true }
      ? Array<ResolvedStatefulAliasReference>
      : O extends { isResolvable: false }
        ? Array<UnresolvableStatefulAliasReference>
        : Array<StatefulAliasReference>,
  >(
    to: {
      treePath: AliasReference['to']['treePath'];
      mode?: AliasReference['to']['mode'];
    },
    options?: O,
  ): R {
    return this.aliasReferences.getManyTo(to, options).map(reference => {
      const { isResolvable, from, to } = reference;
      if (isResolvable) {
        const maybeTokenState = this.getTokenState(from.treePath, { withView: null });
        if (maybeTokenState) {
          return {
            status: 'resolved',
            from,
            to,
            tokenState: maybeTokenState,
          };
        } else {
          throw new SDTFError(
            'SDTF_INTERNAL_DESIGN_ERROR',
            `Could not find token "${from.treePath}".`,
          );
        }
      } else {
        return {
          status: 'unresolvable',
          from,
          to,
          unresolvableTokenState: new UnresolvableTokenState(this, from.treePath, reference.reason),
        };
      }
    }) as R;
  }

  public getStatefulAliasReferencesFrom<
    O extends { isResolvable?: boolean },
    R extends O extends { isResolvable: true }
      ? Array<ResolvedStatefulAliasReference>
      : O extends { isResolvable: false }
        ? Array<UnresolvableStatefulAliasReference>
        : Array<StatefulAliasReference>,
  >(
    from: {
      treePath: AliasReference['from']['treePath'];
      valuePath?: AliasReference['from']['valuePath'];
      mode?: AliasReference['from']['mode'];
    },
    options?: O,
  ): R {
    return this.aliasReferences.getManyFrom(from, options).map(reference => {
      const { isResolvable, from, to } = reference;
      if (isResolvable) {
        const maybeTokenState = this.getTokenState(to.treePath, { withView: null });
        if (maybeTokenState) {
          return {
            status: 'resolved',
            from,
            to,
            tokenState: maybeTokenState,
          };
        } else {
          throw new SDTFError(
            'SDTF_INTERNAL_DESIGN_ERROR',
            `Could not find token "${to.treePath}".`,
          );
        }
      } else {
        return {
          status: 'unresolvable',
          from,
          to,
          unresolvableTokenState: new UnresolvableTokenState(this, to.treePath, reference.reason),
        };
      }
    }) as R;
  }

  public deleteOneAliasReference(from: AliasReference['from']) {
    this.aliasReferences.deleteOne(from);
  }

  /* ------------------------------------------
     Nodes management
  --------------------------------------------- */
  public isAvailablePath(path: TreePath) {
    return (
      !this.global.tokens.has(path.toString()) &&
      !this.global.groups.has(path.toString()) &&
      !this.global.collections.has(path.toString())
    );
  }

  public isExistingParentPath(path: TreePath) {
    const parentPath = path.makeParentPath();

    return parentPath.isRoot ? true : !this.isAvailablePath(parentPath);
  }

  public updateChildrenPaths(parentPath: TreePath, replacer: string) {
    const atIndex = parentPath.length - 1;
    this.getChildrenOf(parentPath, undefined, { withView: null }).forEach(child => {
      child.updatePathItem(atIndex, replacer);
    });
  }

  public addCollection(
    path: TreePath,
    collectionProperties: SpecifyDesignTokenCollectionProperties,
  ) {
    if (!this.isAvailablePath(path)) {
      throw new SDTFError('SDTF_PATH_ALREADY_TAKEN', `Path "${path}" is already used.`);
    }
    if (!this.isExistingParentPath(path)) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Parent path for "${path}" does not exist.`);
    }
    const maybeCollectionState = this.getNearestCollectionState(path, { withView: null });
    if (maybeCollectionState) {
      throw new SDTFError(
        'SDTF_NESTED_COLLECTION',
        `Collection "${path}" is nested in collection "${maybeCollectionState.path.toString()}".`,
      );
    }

    const analyzedCollection = parseRawCollection(path, collectionProperties);

    const collectionState = new CollectionState(this, analyzedCollection);
    this.global.collections.add(collectionState);
    this.refreshViews();
  }

  public renameCollection(path: TreePath, newName: string) {
    const maybeCollectionState = this.global.collections.getOne(path.toString());
    if (!maybeCollectionState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Collection "${path}" does not exist.`);
    }
    maybeCollectionState.rename(newName);
    this.refreshViews();
  }

  public updateCollectionDescription(path: TreePath, newDescription: TreeNodeDescription) {
    const maybeCollectionState = this.global.collections.getOne(path.toString());
    if (!maybeCollectionState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Collection "${path}" does not exist.`);
    }
    maybeCollectionState.updateDescription(newDescription);
    this.refreshViews();
  }

  public updateCollectionExtensions(path: TreePath, newExtensions: TreeNodeExtensions) {
    const maybeCollectionState = this.global.collections.getOne(path.toString());
    if (!maybeCollectionState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Collection "${path}" does not exist.`);
    }
    maybeCollectionState.updateExtensions(newExtensions);
  }

  public renameCollectionMode(path: TreePath, fromMode: string, toMode: string) {
    const maybeCollectionState = this.global.collections.getOne(path.toString());
    if (!maybeCollectionState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Collection "${path}" does not exist.`);
    }

    maybeCollectionState.renameMode(fromMode, toMode);
    this.refreshViews();
  }

  public deleteCollectionMode(path: TreePath, mode: string) {
    const maybeCollectionState = this.global.collections.getOne(path.toString());
    if (!maybeCollectionState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Collection "${path}" does not exist.`);
    }
    maybeCollectionState.deleteMode(mode);
    this.refreshViews();
  }

  public deleteCollection(path: TreePath) {
    const maybeCollectionState = this.global.collections.getOne(path.toString());
    if (!maybeCollectionState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Collection "${path}" does not exist.`);
    }
    // Delete enclosed groups
    this.global.groups.getChildrenOf(path).forEach(group => {
      try {
        this.deleteGroup(group.path);
      } catch (error) {
        if (
          !(error instanceof SDTFError) ||
          (error instanceof SDTFError && error.errorKey !== 'SDTF_TREE_NODE_NOT_FOUND')
        ) {
          throw error;
        }
      }
    });
    // Delete enclosed tokens
    this.global.tokens.getChildrenOf(path).forEach(token => {
      try {
        this.deleteToken(token.path);
      } catch (error) {
        if (
          !(error instanceof SDTFError) ||
          (error instanceof SDTFError && error.errorKey !== 'SDTF_TREE_NODE_NOT_FOUND')
        ) {
          throw error;
        }
      }
    });
    // Delete collection
    this.global.collections.delete(path.toString());
    this.refreshViews();
  }

  public moveCollection(atPath: TreePath, toPath: TreePath) {
    const maybeCollectionState = this.global.collections.getOne(atPath.toString());
    if (!maybeCollectionState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Collection "${atPath}" does not exist.`);
    }
    maybeCollectionState.move(toPath);
    // views update is managed by the move method
  }

  public truncateCollection(path: TreePath) {
    const maybeCollectionState = this.global.collections.getOne(path.toString());
    if (!maybeCollectionState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Collection "${path}" does not exist.`);
    }

    // Delete enclosed groups
    this.global.groups.getChildrenOf(path).forEach(group => {
      this.deleteGroup(group.path);
    });
    // Delete enclosed tokens
    this.global.tokens.getChildrenOf(path).forEach(token => {
      this.deleteToken(token.path);
    });

    this.refreshViews();
  }

  public addGroup(path: TreePath, groupProperties: SpecifyDesignTokenGroupProperties) {
    if (!this.isAvailablePath(path)) {
      throw new SDTFError('SDTF_PATH_ALREADY_TAKEN', `Path "${path}" is already used.`);
    }
    if (!this.isExistingParentPath(path)) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Parent path for "${path}" does not exist.`);
    }
    const analyzedGroup = parseRawGroup(path, groupProperties);

    const groupState = new GroupState(this, analyzedGroup);
    this.global.groups.add(groupState);
    this.refreshViews();
  }

  public renameGroup(path: TreePath, newName: string) {
    const maybeGroupState = this.global.groups.getOne(path.toString());
    if (!maybeGroupState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Group "${path}" does not exist.`);
    }
    maybeGroupState.rename(newName);
    this.refreshViews();
  }

  public updateGroupDescription(path: TreePath, newDescription: TreeNodeDescription) {
    const maybeGroupState = this.global.groups.getOne(path.toString());
    if (!maybeGroupState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Group "${path}" does not exist.`);
    }
    maybeGroupState.updateDescription(newDescription);
    this.refreshViews();
  }

  public updateGroupExtensions(path: TreePath, newExtensions: TreeNodeExtensions) {
    const maybeGroupState = this.global.groups.getOne(path.toString());
    if (!maybeGroupState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Group "${path}" does not exist.`);
    }
    maybeGroupState.updateExtensions(newExtensions);
  }

  public deleteGroup(path: TreePath) {
    const maybeGroupState = this.global.groups.getOne(path.toString());
    if (!maybeGroupState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Group "${path}" does not exist.`);
    }

    // Delete enclosed collections
    this.global.collections.getChildrenOf(path).forEach(collection => {
      try {
        this.deleteCollection(collection.path);
      } catch (error) {
        if (
          !(error instanceof SDTFError) ||
          (error instanceof SDTFError && error.errorKey !== 'SDTF_TREE_NODE_NOT_FOUND')
        ) {
          throw error;
        }
      }
    });
    // Delete enclosed groups
    this.global.groups.getChildrenOf(path).forEach(group => {
      try {
        this.deleteGroup(group.path);
      } catch (error) {
        if (
          !(error instanceof SDTFError) ||
          (error instanceof SDTFError && error.errorKey !== 'SDTF_TREE_NODE_NOT_FOUND')
        ) {
          throw error;
        }
      }
    });
    // Delete enclosed tokens
    this.global.tokens.getChildrenOf(path).forEach(token => {
      try {
        this.deleteToken(token.path);
      } catch (error) {
        if (
          !(error instanceof SDTFError) ||
          (error instanceof SDTFError && error.errorKey !== 'SDTF_TREE_NODE_NOT_FOUND')
        ) {
          throw error;
        }
      }
    });
    // Delete group
    this.global.groups.delete(path.toString());
    this.refreshViews();
  }

  public moveGroup(atPath: TreePath, toPath: TreePath) {
    const maybeGroupState = this.global.groups.getOne(atPath.toString());
    if (!maybeGroupState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Group "${atPath}" does not exist.`);
    }
    maybeGroupState.move(toPath);
    // views update is managed by the move method
  }

  public truncateGroup(path: TreePath) {
    const maybeGroupState = this.global.groups.getOne(path.toString());
    if (!maybeGroupState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Group "${path}" does not exist.`);
    }

    // Delete enclosed collections
    this.global.collections.getChildrenOf(path).forEach(collection => {
      this.deleteCollection(collection.path);
    });
    // Delete enclosed groups
    this.global.groups.getChildrenOf(path).forEach(group => {
      this.deleteGroup(group.path);
    });
    // Delete enclosed tokens
    this.global.tokens.getChildrenOf(path).forEach(token => {
      this.deleteToken(token.path);
    });
  }

  public addToken(path: TreePath, rawToken: SpecifyDesignToken) {
    if (!this.isAvailablePath(path)) {
      throw new SDTFError('SDTF_PATH_ALREADY_TAKEN', `Path "${path}" is already used.`);
    }
    if (!this.isExistingParentPath(path)) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Parent path for "${path}" does not exist.`);
    }

    const analyzedToken = parseRawToken(path, rawToken);
    const analyzedTokens = new TreeNodeSet(this.global.tokens.all.map(n => n.toAnalyzedToken()));
    analyzedTokens.add(analyzedToken);

    analyzedToken.analyzedValueAliasParts.forEach(aliasPart => {
      aliasPart.isResolvable = analyzeValueAliasPart(analyzedToken, aliasPart, analyzedTokens);
    });

    computeDeepModesResolvability(analyzedToken.path.toString(), analyzedTokens);

    /* v8 ignore start */
    if (
      analyzedToken.modesResolvability === undefined ||
      analyzedToken.isFullyResolvable === undefined
    ) {
      throw new SDTFError(
        'SDTF_INTERNAL_DESIGN_ERROR',
        `Token ${analyzedToken.path} has no modesResolvability defined`,
      );
    }
    /* v8 ignore stop */

    const isFullyResolvable = analyzedToken.isFullyResolvable;
    const modesResolvabilityMap = new Map(Object.entries(analyzedToken.modesResolvability));

    const maybeCollectionState = this.getNearestCollectionState(path, { withView: null });
    if (maybeCollectionState) {
      const tokenModes = analyzedToken.computedModes ?? analyzedToken.modes;
      checkForTokenModesInCollection(
        analyzedToken.path.toString(),
        tokenModes,
        maybeCollectionState.path.toString(),
        maybeCollectionState.allowedModes,
      );
    }

    const tokenState = new TokenState(this, {
      path: analyzedToken.path,
      name: analyzedToken.name,
      $type: analyzedToken.$type as SpecifyDesignTokenTypeName,
      $description: analyzedToken.$description,
      $extensions: analyzedToken.$extensions,
      isTopLevelAlias: analyzedToken.isTopLevelAlias,
      definition: analyzedToken.definition,
      analyzedValuePrimitiveParts: analyzedToken.analyzedValuePrimitiveParts,
      isFullyResolvable,
      modesResolvabilityMap,
    });
    this.global.tokens.add(tokenState);

    fillAliasReferences(analyzedToken, tokenState, this.aliasReferences, (stringPath: string) => {
      /* v8 ignore next 12 */
      const maybeTokenState = this.getTokenState(TreePath.fromString(stringPath), {
        withView: null,
      });
      if (!maybeTokenState)
        throw new SDTFError(
          'SDTF_INTERNAL_DESIGN_ERROR',
          `Token reference "${path.toString()}" not found`,
        );
      return maybeTokenState;
    });

    this.refreshViews();
  }

  public renameToken(path: TreePath, newName: string) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    }
    maybeTokenState.rename(newName);
    this.refreshViews();
  }

  public updateTokenDescription(path: TreePath, newDescription: TreeNodeDescription) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    }
    maybeTokenState.updateDescription(newDescription);
    this.refreshViews();
  }

  public updateTokenExtensions(path: TreePath, newExtensions: TreeNodeExtensions) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    }
    maybeTokenState.updateExtensions(newExtensions);
  }

  public updateTokenValue<Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName>(
    path: TreePath,
    newValue: PickSpecifyDesignToken<Type, string, false, true>['$value'],
  ) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    }
    maybeTokenState.updateValue(newValue);
    this.refreshViews();
  }

  public resolveTokenValueAliases(path: TreePath) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    }
    maybeTokenState.resolveValueAliases();
  }

  public updateTokenModeValue<Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName>(
    path: TreePath,
    mode: string,
    newValue: SpecifyDesignTokenValueWithMode<
      PickSpecifyDesignToken<Type, string, true, false>['$value'],
      string,
      false
    >,
  ) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    }
    maybeTokenState.updateModeValue(mode, newValue);
  }

  public renameTokenMode(path: TreePath, fromMode: string, toMode: string) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    }
    maybeTokenState.renameMode(fromMode, toMode);
    this.refreshViews();
  }

  public createTokenModeValue<Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName>(
    path: TreePath,
    mode: string,
    value: PickSpecifyDesignToken<Type, string, true, false>['$value'],
  ) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState)
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    maybeTokenState.createModeValue(mode, value);
    this.refreshViews();
  }

  public deleteTokenModeValue(path: TreePath, mode: string) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState)
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    maybeTokenState.deleteModeValue(mode);
    this.refreshViews();
  }

  public deleteToken(path: TreePath) {
    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (!maybeTokenState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${path}" does not exist.`);
    }
    // Delete aliases references from the token
    this.aliasReferences.deleteManyFrom({ treePath: maybeTokenState.path });
    // Unlink aliases references to the token
    this.aliasReferences.unlinkManyTo({ treePath: maybeTokenState.path });
    // Delete token
    this.global.tokens.delete(path.toString());
    this.refreshViews();
  }

  public moveToken(fromPath: TreePath, toPath: TreePath) {
    const maybeTokenState = this.global.tokens.getOne(fromPath.toString());
    if (!maybeTokenState) {
      throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Token "${fromPath}" does not exist.`);
    }
    maybeTokenState.move(toPath);
    // views update is managed by the move method
  }

  public renameNode(path: TreePath, newName: string) {
    const maybeGroupState = this.global.groups.getOne(path.toString());
    if (maybeGroupState) {
      maybeGroupState.rename(newName);
      this.refreshViews();
      return;
    }

    const maybeTokenState = this.global.tokens.getOne(path.toString());
    if (maybeTokenState) {
      maybeTokenState.rename(newName);
      this.refreshViews();
      return;
    }

    const maybeCollectionState = this.global.collections.getOne(path.toString());
    if (maybeCollectionState) {
      maybeCollectionState.rename(newName);
      this.refreshViews();
      return;
    }

    throw new SDTFError('SDTF_TREE_NODE_NOT_FOUND', `Node "${path}" does not exist.`);
  }

  /* ------------------------------------------
     Getters
  --------------------------------------------- */
  public getTokenState<Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName>(
    path: TreePath | string,
    options?: ViewSelectorOptions,
  ): TokenState<Type> | undefined {
    return this.withViewNodesState(options?.withView, nodes => {
      return nodes.tokens.getOne(path.toString()) as TokenState<Type> | undefined;
    });
  }
  public getGroupState(
    path: TreePath | string,
    options?: ViewSelectorOptions,
  ): GroupState | undefined {
    return this.withViewNodesState(options?.withView, nodes => {
      return nodes.groups.getOne(path.toString());
    });
  }
  public getCollectionState(
    path: TreePath | string,
    options?: ViewSelectorOptions,
  ): CollectionState | undefined {
    return this.withViewNodesState(options?.withView, nodes => {
      return nodes.collections.getOne(path.toString());
    });
  }
  public getNearestCollectionState(
    path: TreePath | string,
    options?: ViewSelectorOptions,
  ): CollectionState | undefined {
    for (let i = path.length - 1; i >= 0; i--) {
      const computedPath = path.slice(0, i);
      const maybeCollectionState = this.getCollectionState(computedPath, options);
      if (maybeCollectionState) {
        return maybeCollectionState;
      }
    }
    return undefined;
  }

  public getAllTokenStates(options?: ViewSelectorOptions) {
    return this.withViewNodesState(options?.withView, nodes => Array.from(nodes.tokens));
  }
  public getAllGroupStates(options?: ViewSelectorOptions) {
    return this.withViewNodesState(options?.withView, nodes => Array.from(nodes.groups));
  }
  public getAllCollectionStates(options?: ViewSelectorOptions) {
    return this.withViewNodesState(options?.withView, nodes => Array.from(nodes.collections));
  }
  public getAllNodeStates(options?: ViewSelectorOptions): Array<SDTFNodeState> {
    return this.withViewNodesState(options?.withView, nodes =>
      [...nodes.groups, ...nodes.collections, ...nodes.tokens].sort((nodeA, nodeB) => {
        return nodeA.path.toString().localeCompare(nodeB.path.toString());
      }),
    );
  }

  public getTokenChildrenOf(path: TreePath, depth?: number, options?: ViewSelectorOptions) {
    return this.withViewNodesState(options?.withView, nodes =>
      nodes.tokens.getChildrenOf(path, depth),
    );
  }
  public getGroupChildrenOf(path: TreePath, depth?: number, options?: ViewSelectorOptions) {
    return this.withViewNodesState(options?.withView, nodes =>
      nodes.groups.getChildrenOf(path, depth),
    );
  }
  public getCollectionChildrenOf(path: TreePath, depth?: number, options?: ViewSelectorOptions) {
    return this.withViewNodesState(options?.withView, nodes =>
      nodes.collections.getChildrenOf(path, depth),
    );
  }
  public getChildrenOf(
    path: TreePath,
    depth?: number,
    options?: ViewSelectorOptions,
  ): Array<SDTFNodeState> {
    return this.withViewNodesState(options?.withView, nodes => {
      return [
        ...nodes.groups.getChildrenOf(path, depth),
        ...nodes.collections.getChildrenOf(path, depth),
        ...nodes.tokens.getChildrenOf(path, depth),
      ].sort((nodeA, nodeB) => {
        return nodeA.path.toString().localeCompare(nodeB.path.toString());
      });
    });
  }
  public getParentsOf(
    path: TreePath,
    depth?: number,
    options?: ViewSelectorOptions,
  ): Array<SDTFNodeState> {
    return this.withViewNodesState(options?.withView, nodes => {
      return [
        ...nodes.groups.getParentsOf(path, depth),
        ...nodes.collections.getParentsOf(path, depth),
        ...nodes.tokens.getParentsOf(path, depth),
      ].sort((nodeA, nodeB) => {
        return nodeB.path.toString().localeCompare(nodeA.path.toString());
      });
    });
  }

  public getGroupChildren(options?: ViewSelectorOptions) {
    return this.getGroupChildrenOf(TreePath.empty(), 1, options);
  }
  public getTokenChildren(options?: ViewSelectorOptions) {
    return this.getTokenChildrenOf(TreePath.empty(), 1, options);
  }
  public getCollectionChildren(options?: ViewSelectorOptions) {
    return this.getCollectionChildrenOf(TreePath.empty(), 1, options);
  }

  /* ------------------------------------------
     Exporters
  --------------------------------------------- */
  public clone() {
    const analyzedTokenTree = this.global.toAnalyzedTokenTree();
    const serializedViews = this.#viewsState.serialize();

    const viewsState = new ViewsState();
    const newTreeState = createTreeState(analyzedTokenTree, {
      viewsState,
    });

    serializedViews.forEach(view => {
      viewsState.register(view.name, view.query, newTreeState);
    });

    if (this.#activeViewName !== null) {
      newTreeState.setActiveView(this.#activeViewName);
    }

    return newTreeState;
  }

  public populateJSONChildrenOf<
    ResolveAliases extends boolean,
    AllowUnresolvable extends boolean,
    TargetMode extends string | null,
  >(
    path: TreePath,
    accumulator: JSONObject,
    renderOptions?: GetJSONTokenValueOptions<ResolveAliases, AllowUnresolvable, TargetMode>,
  ) {
    const nodes = this.getChildrenOf(path, undefined, { withView: null });
    nodes.forEach(node => {
      const computedPath = node.path.slice(path.length);

      if (node.isGroup) {
        setInSDTFTree(accumulator, computedPath, node.getJSONProperties());
      } else if (node.isCollection) {
        setInSDTFTree(accumulator, computedPath, node.getJSONProperties());
      } else if (node) {
        setInSDTFTree(
          accumulator,
          computedPath,
          node.getJSONToken(
            renderOptions ??
              ({ resolveAliases: false } as GetJSONTokenValueOptions<
                ResolveAliases,
                AllowUnresolvable,
                TargetMode
              >),
          ),
        );
      }
    });
  }

  public renderJSONTree(
    renderOptions?: GetJSONTokenValueOptions<boolean, boolean, null>,
  ): SpecifyDesignTokenFormat {
    if (renderOptions?.resolveAliases && renderOptions?.targetMode) {
      throw new SDTFError(
        'SDTF_INVALID_OPTION',
        'The "targetMode" option is not supported when using renderJSONTree.',
      );
    }
    const tree = {};
    this.populateJSONChildrenOf(TreePath.empty(), tree, renderOptions);
    return tree;
  }

  public exportMetadata(): SDTFEngineSerializedMetadata {
    return {
      activeViewName: this.#activeViewName,
      views: this.#viewsState.values().map(v => v.serialize()),
    };
  }

  public exportAll(): SDTFEngineSerializedState {
    return {
      tokenTree: this.renderJSONTree(),
      metadata: this.exportMetadata(),
    };
  }

  public toJSON() {
    return this.renderJSONTree();
  }
}
