import { ValuePath } from './state/path/ValuePath.js';
import { SDTFNodeState, TreeState, ViewSelectorOptions } from './state/TreeState.js';
import { makeRunQuery, QueryResult, SDTFQuery } from './query/index.js';
import {
  addCollectionMutationDefinition,
  addGroupMutationDefinition,
  addTokenMutationDefinition,
  createTokenModeValueMutationDefinition,
  deleteAllViewsMutationDefinition,
  deleteCollectionModeMutationDefinition,
  deleteCollectionMutationDefinition,
  deleteGroupMutationDefinition,
  deleteTokenModeValueMutationDefinition,
  deleteTokenMutationDefinition,
  deleteViewMutationDefinition,
  loadTokenTreeMutationDefinition,
  moveCollectionMutationDefinition,
  moveGroupMutationDefinition,
  moveTokenMutationDefinition,
  registerViewMutationDefinition,
  renameCollectionModeMutationDefinition,
  renameCollectionMutationDefinition,
  renameGroupMutationDefinition,
  renameNodeMutationDefinition,
  renameTokenModeMutationDefinition,
  renameTokenMutationDefinition,
  resetTokenTreeMutationDefinition,
  resolveTokenValueAliasesMutationDefinition,
  setActiveViewMutationDefinition,
  truncateCollectionMutationDefinition,
  truncateGroupMutationDefinition,
  updateCollectionDescriptionMutationDefinition,
  updateCollectionExtensionsMutationDefinition,
  updateGroupDescriptionMutationDefinition,
  updateGroupExtensionsMutationDefinition,
  updateTokenDescriptionMutationDefinition,
  updateTokenExtensionsMutationDefinition,
  updateTokenModeValueMutationDefinition,
  updateTokenValueMutationDefinition,
  updateViewMutationDefinition,
} from './mutations/definitions.js';
import {
  SDTFEngineSerializedMetadata,
  sdtfEngineSerializedMetadataSchema,
  SDTFEngineSerializedState,
} from './SDTFEngineSerializedState.js';
import { SpecifyDesignTokenFormat } from '../definitions/SpecifyDesignTokenFormat.js';
import { GetJSONTokenValueOptions, TokenState } from './state/TokenState.js';
import {
  PickSpecifyDesignToken,
  SpecifyDesignToken,
  SpecifyDesignTokenCollectionProperties,
  SpecifyDesignTokenGroupProperties,
  SpecifyDesignTokenTypeName,
} from '../definitions/index.js';
import { GroupState } from './state/GroupState.js';
import { CollectionState } from './state/CollectionState.js';
import {
  AliasReference,
  AliasReferenceSet,
  ResolvableAliasReference,
  ResolvedStatefulAliasReference,
  StatefulAliasReference,
  UnresolvableAliasReference,
  UnresolvableStatefulAliasReference,
} from './state/AliasReferenceSet.js';
import { SerializedView } from './state/ViewState.js';
import { fillTreeNodesStateAndAliasReferences } from './builder/createTreeState.js';
import { AnalyzedTokenTree, analyzeTokenTree } from './parser/analyzeTokenTree.js';
import { ViewsState } from './state/ViewsState.js';
import { TreeNodesState } from './state/TreeNodesState.js';
import { TreePath } from './state/path/TreePath.js';

function makeEngine(
  analyzedTokenTree: AnalyzedTokenTree,
  parsedMetadata: SDTFEngineSerializedMetadata,
): SDTFEngine {
  const globalState = new TreeNodesState();
  const aliasReferences = new AliasReferenceSet();
  const viewsState = new ViewsState();

  const treeState = new TreeState({
    globalState,
    aliasReferences,
    viewsState,
    activeViewName: null, // set to null before registering views
  });

  fillTreeNodesStateAndAliasReferences(globalState, aliasReferences, analyzedTokenTree, treeState);

  // Register views
  parsedMetadata.views.forEach(view => {
    viewsState.register(view.name, view.query, treeState);
  });
  // Register active view once all views are registered
  if (parsedMetadata.activeViewName !== null) {
    treeState.setActiveView(parsedMetadata?.activeViewName);
  }

  const runQuery = makeRunQuery(treeState);

  function loadTokenTree(tokenTree?: unknown) {
    const newAnalyzedTokenTree = analyzeTokenTree(tokenTree);

    globalState.clear();
    aliasReferences.clear();

    fillTreeNodesStateAndAliasReferences(
      globalState,
      aliasReferences,
      newAnalyzedTokenTree,
      treeState,
    );

    viewsState.updateAll(treeState);
  }

  function clone() {
    return makeEngine(globalState.toAnalyzedTokenTree(), treeState.exportMetadata());
  }

  /* v8 ignore start */
  return {
    renderJSONTree: (...args: any[]) => treeState.renderJSONTree(...args),
    mutation: {
      resetTokenTree: resetTokenTreeMutationDefinition.remapAndPipeWith(
        // @ts-expect-error - resetTokenTreeMutationDefinition has no arguments
        () => [],
        () => treeState.reset(),
      ),
      loadTokenTree: loadTokenTreeMutationDefinition.remapAndPipeWith(
        ({ tokens }) => [tokens],
        loadTokenTree,
      ),
      // Tree views
      registerView: registerViewMutationDefinition.remapAndPipeWith(
        ({ name, query, shouldSetActive }) => [
          name,
          query,
          shouldSetActive === null ? false : shouldSetActive,
        ],
        // @ts-expect-error
        (...args) => treeState.registerView(...args),
      ),
      updateView: updateViewMutationDefinition.remapAndPipeWith(
        ({ name, query, shouldSetActive }) => [
          name,
          query,
          shouldSetActive === null ? false : shouldSetActive,
        ],
        // @ts-expect-error
        (...args) => treeState.updateView(...args),
      ),
      setActiveView: setActiveViewMutationDefinition.remapAndPipeWith(
        ({ name }) => [name],
        // @ts-expect-error
        (...args) => treeState.setActiveView(...args),
      ),
      deleteView: deleteViewMutationDefinition.remapAndPipeWith(
        ({ name }) => [name],
        (...args: Array<any>) => {
          // @ts-expect-error
          return treeState.deleteView(...args);
        },
      ),
      deleteAllViews: deleteAllViewsMutationDefinition.remapAndPipeWith(
        // @ts-expect-error - deleteAllViewsMutationDefinition has no arguments
        () => [],
        () => treeState.deleteAllViews(),
      ),
      // Collection
      addCollection: addCollectionMutationDefinition.remapAndPipeWith(
        ({ parentPath, name, collectionProperties }) => [
          parentPath.append(name),
          collectionProperties,
        ],
        // @ts-expect-error
        (...args: Array<any>) => treeState.addCollection(...args),
      ),
      renameCollection: renameCollectionMutationDefinition.remapAndPipeWith(
        ({ atPath, name }) => [atPath, name],
        // @ts-expect-error
        (...args: Array<any>) => treeState.renameCollection(...args),
      ),
      updateCollectionDescription: updateCollectionDescriptionMutationDefinition.remapAndPipeWith(
        ({ atPath, description }) => [atPath, description],
        // @ts-expect-error
        (...args: Array<any>) => treeState.updateCollectionDescription(...args),
      ),
      updateCollectionExtensions: updateCollectionExtensionsMutationDefinition.remapAndPipeWith(
        ({ atPath, extensions }) => [atPath, extensions],
        // @ts-expect-error
        (...args: Array<any>) => treeState.updateCollectionExtensions(...args),
      ),
      renameCollectionMode: renameCollectionModeMutationDefinition.remapAndPipeWith(
        ({ atPath, fromMode, toMode }) => [atPath, fromMode, toMode],
        // @ts-expect-error
        (...args: Array<any>) => treeState.renameCollectionMode(...args),
      ),
      deleteCollectionMode: deleteCollectionModeMutationDefinition.remapAndPipeWith(
        ({ atPath, mode }) => [atPath, mode],
        // @ts-expect-error
        (...args: Array<any>) => treeState.deleteCollectionMode(...args),
      ),
      truncateCollection: truncateCollectionMutationDefinition.remapAndPipeWith(
        ({ atPath }) => [atPath],
        // @ts-expect-error
        (...args: Array<any>) => treeState.truncateCollection(...args),
      ),
      deleteCollection: deleteCollectionMutationDefinition.remapAndPipeWith(
        ({ atPath }) => [atPath],
        // @ts-expect-error
        (...args: Array<any>) => treeState.deleteCollection(...args),
      ),
      moveCollection: moveCollectionMutationDefinition.remapAndPipeWith(
        ({ atPath, toPath }) => [atPath, toPath],
        // @ts-expect-error
        (...args: Array<any>) => treeState.moveCollection(...args),
      ),
      // Group
      addGroup: addGroupMutationDefinition.remapAndPipeWith(
        ({ parentPath, name, groupProperties }) => [parentPath.append(name), groupProperties],
        // @ts-expect-error
        (...args: Array<any>) => treeState.addGroup(...args),
      ),
      renameGroup: renameGroupMutationDefinition.remapAndPipeWith(
        ({ atPath, name }) => [atPath, name],
        // @ts-expect-error
        (...args: Array<any>) => treeState.renameGroup(...args),
      ),
      updateGroupDescription: updateGroupDescriptionMutationDefinition.remapAndPipeWith(
        ({ atPath, description }) => [atPath, description],
        // @ts-expect-error
        (...args: Array<any>) => treeState.updateGroupDescription(...args),
      ),
      updateGroupExtensions: updateGroupExtensionsMutationDefinition.remapAndPipeWith(
        ({ atPath, extensions }) => [atPath, extensions],
        // @ts-expect-error
        (...args: Array<any>) => treeState.updateGroupExtensions(...args),
      ),
      truncateGroup: truncateGroupMutationDefinition.remapAndPipeWith(
        ({ atPath }) => [atPath],
        // @ts-expect-error
        (...args: Array<any>) => treeState.truncateGroup(...args),
      ),
      deleteGroup: deleteGroupMutationDefinition.remapAndPipeWith(
        ({ atPath }) => [atPath],
        // @ts-expect-error
        (...args: Array<any>) => treeState.deleteGroup(...args),
      ),
      moveGroup: moveGroupMutationDefinition.remapAndPipeWith(
        ({ atPath, toPath }) => [atPath, toPath],
        // @ts-expect-error
        (...args: Array<any>) => treeState.moveGroup(...args),
      ),
      // Token
      addToken: addTokenMutationDefinition.remapAndPipeWith(
        ({ parentPath, name, tokenProperties }) => [parentPath.append(name), tokenProperties],
        // @ts-expect-error
        (...args: Array<any>) => treeState.addToken(...args),
      ),
      renameToken: renameTokenMutationDefinition.remapAndPipeWith(
        ({ atPath, name }) => [atPath, name],
        // @ts-expect-error
        (...args: Array<any>) => treeState.renameToken(...args),
      ),
      updateTokenDescription: updateTokenDescriptionMutationDefinition.remapAndPipeWith(
        ({ atPath, description }) => [atPath, description],
        // @ts-expect-error
        (...args: Array<any>) => treeState.updateTokenDescription(...args),
      ),
      updateTokenExtensions: updateTokenExtensionsMutationDefinition.remapAndPipeWith(
        ({ atPath, extensions }) => [atPath, extensions],
        // @ts-expect-error
        (...args: Array<any>) => treeState.updateTokenExtensions(...args),
      ),
      updateTokenValue: updateTokenValueMutationDefinition.remapAndPipeWith(
        ({ atPath, value }) => [atPath, value],
        // @ts-expect-error
        (...args: Array<any>) => treeState.updateTokenValue(...args),
      ),
      resolveTokenValueAliases: resolveTokenValueAliasesMutationDefinition.remapAndPipeWith(
        ({ atPath }) => [atPath],
        // @ts-expect-error
        (...args: Array<any>) => treeState.resolveTokenValueAliases(...args),
      ),
      updateTokenModeValue: updateTokenModeValueMutationDefinition.remapAndPipeWith(
        ({ atPath, mode, value }) => [atPath, mode, value],
        // @ts-expect-error
        (...args: Array<any>) => treeState.updateTokenModeValue(...args),
      ),
      renameTokenMode: renameTokenModeMutationDefinition.remapAndPipeWith(
        ({ atPath, fromMode, toMode }) => [atPath, fromMode, toMode],
        // @ts-expect-error
        (...args: Array<any>) => treeState.renameTokenMode(...args),
      ),
      createTokenModeValue: createTokenModeValueMutationDefinition.remapAndPipeWith(
        ({ atPath, mode, value }) => [atPath, mode, value],
        // @ts-expect-error
        (...args: Array<any>) => treeState.createTokenModeValue(...args),
      ),
      deleteTokenModeValue: deleteTokenModeValueMutationDefinition.remapAndPipeWith(
        ({ atPath, mode }) => [atPath, mode],
        // @ts-expect-error
        (...args: Array<any>) => treeState.deleteTokenModeValue(...args),
      ),
      deleteToken: deleteTokenMutationDefinition.remapAndPipeWith(
        ({ atPath }) => [atPath],
        // @ts-expect-error
        (...args: Array<any>) => treeState.deleteToken(...args),
      ),
      moveToken: moveTokenMutationDefinition.remapAndPipeWith(
        ({ atPath, toPath }) => [atPath, toPath],
        // @ts-expect-error
        (...args: Array<any>) => treeState.moveToken(...args),
      ),
      renameNode: renameNodeMutationDefinition.remapAndPipeWith(
        ({ atPath, name }) => [atPath, name],
        // @ts-expect-error
        (...args: Array<any>) => treeState.renameNode(...args),
      ),
    },
    query: {
      run: runQuery,
      // @ts-expect-error
      getTokenState: (...args: Array<any>) => treeState.getTokenState(...args),
      // @ts-expect-error
      getGroupState: (...args: Array<any>) => treeState.getGroupState(...args),
      // @ts-expect-error
      getCollectionState: (...args: Array<any>) => treeState.getCollectionState(...args),
      getNearestCollectionState: (...args: Array<any>) =>
        // @ts-expect-error
        treeState.getNearestCollectionState(...args),
      getAllTokenStates: (...args: Array<any>) => treeState.getAllTokenStates(...args),
      getAllGroupStates: (...args: Array<any>) => treeState.getAllGroupStates(...args),
      getAllCollectionStates: (...args: Array<any>) => treeState.getAllCollectionStates(...args),
      getAllNodeStates: (...args: Array<any>) => treeState.getAllNodeStates(...args),
      // @ts-expect-error
      getTokenChildrenOf: (...args: Array<any>) => treeState.getTokenChildrenOf(...args),
      // @ts-expect-error
      getGroupChildrenOf: (...args: Array<any>) => treeState.getGroupChildrenOf(...args),
      // @ts-expect-error
      getCollectionChildrenOf: (...args: Array<any>) => treeState.getCollectionChildrenOf(...args),
      // @ts-expect-error
      getChildrenOf: (...args: Array<any>) => treeState.getChildrenOf(...args),
      // @ts-expect-error
      getParentsOf: (...args: Array<any>) => treeState.getParentsOf(...args),
      getGroupChildren: (...args: Array<any>) => treeState.getGroupChildren(...args),
      getTokenChildren: (...args: Array<any>) => treeState.getTokenChildren(...args),
      getCollectionChildren: (...args: Array<any>) => treeState.getCollectionChildren(...args),
      renderJSONTree: (...args: Array<any>) => treeState.renderJSONTree(...args),
      // @ts-expect-error
      getAliasReference: (...args: Array<any>) => treeState.getAliasReference(...args),
      // @ts-expect-error
      getAllAliasReferences: (...args: Array<any>) => treeState.getAllAliasReferences(...args),
      // @ts-expect-error
      getAliasReferencesTo: (...args: Array<any>) => treeState.getAliasReferencesTo(...args),
      // @ts-expect-error
      getAliasReferencesFrom: (...args: Array<any>) => treeState.getAliasReferencesFrom(...args),
      getStatefulAliasReference: (...args: Array<any>) =>
        // @ts-expect-error
        treeState.getStatefulAliasReference(...args),
      getStatefulAliasReferencesTo: (...args: Array<any>) =>
        // @ts-expect-error
        treeState.getStatefulAliasReferencesTo(...args),
      getStatefulAliasReferencesFrom: (...args: Array<any>) =>
        // @ts-expect-error
        treeState.getStatefulAliasReferencesFrom(...args),
      // @ts-expect-error
      listViews: (...args: Array<any>) => treeState.listViews(...args),
      // @ts-expect-error
      getActiveView: (...args: Array<any>) => treeState.getActiveView(...args),
    },
    exportEngineState: () => treeState.exportAll(),
    clone,
  };
  /* v8 ignore stop */
}

export function createSDTFEngine(
  tokenTree?: unknown,
  metadata?: SDTFEngineSerializedMetadata,
): SDTFEngine {
  const analyzedTokenTree = analyzeTokenTree(tokenTree);
  const parsedMetadata = sdtfEngineSerializedMetadataSchema.optional().parse(metadata);

  return makeEngine(
    analyzedTokenTree,
    parsedMetadata ?? {
      activeViewName: null,
      views: [],
    },
  );
}

export function isSDTFEngine(data: any): data is SDTFEngine {
  if (typeof data !== 'object' || data === null) return false;

  const hasRenderFn = 'renderJSONTree' in data && typeof data.renderJSONTree === 'function';
  const hasMutationResetFn =
    'mutation' in data &&
    'resetTokenTree' in data.mutation &&
    typeof data.mutation.resetTokenTree === 'function';
  const hasQueryRunFn =
    'query' in data && 'run' in data.query && typeof data.query.run === 'function';

  return hasRenderFn && hasMutationResetFn && hasQueryRunFn;
}

export type SDTFEngine = {
  /**
   * Get the JSON representation of the tokenTree
   * @param renderOptions - The options to indicate alias resolution and integrity checks
   */
  renderJSONTree: (renderOptions?: GetJSONTokenValueOptions) => SpecifyDesignTokenFormat;
  mutation: {
    /**
     * Empty the current tokenTree
     */
    resetTokenTree: () => void;
    /**
     * Create a new engine with the given tokenTree
     * @param tokenTree - The new tokenTree
     */
    loadTokenTree: (payload: { tokens?: unknown }) => void;
    /**
     * Register and activate a new view based on the query
     * @param name - The name of the view
     * @param query - The SDTF Query to evaluate
     * @param shouldSetActive - Whether to set the view as active
     */
    registerView: (payload: { name: string; query: SDTFQuery; shouldSetActive: boolean }) => void;
    /**
     * Update a view based on its name
     * @param name - The name of the view to update
     * @param query - The SDTF Query to evaluate
     * @param shouldSetActive - Whether to set the view as active
     */
    updateView: (payload: { name: string; query: SDTFQuery; shouldSetActive: boolean }) => void;
    /**
     * Set the active view among the registered views. Set to null to deactivate the view.
     * @param name - The name of the view to activate.
     */
    setActiveView: (payload: { name: string | null }) => void;
    /**
     * Delete a view based on its name.
     * Returns true if the view existed, false otherwise.
     * @param name - The name of the view to delete
     */
    deleteView: (payload: { name: string }) => boolean;
    /**
     * Delete all registered views
     */
    deleteAllViews: () => void;
    /**
     * Add a new collection to the tokenTree
     * @param parentPath - The path of the parent group
     * @param name - The name of the new collection
     * @param collectionProperties - The properties of the new collection
     */
    addCollection: (payload: {
      name: string;
      parentPath: TreePath;
      collectionProperties: SpecifyDesignTokenCollectionProperties;
    }) => void;
    /**
     * Rename a collection
     * @param atPath - The path of the collection to rename
     * @param name - The new name of the collection
     */
    renameCollection: (payload: { name: string; atPath: TreePath }) => void;
    /**
     * Update the description of a collection
     * @param atPath - The path of the collection to update
     * @param description - The new description of the collection
     */
    updateCollectionDescription: (payload: { description: string; atPath: TreePath }) => void;
    /**
     * Update the extensions of a collection
     * @param atPath - The path of the collection to update
     * @param extensions - The new extensions of the collection
     */
    updateCollectionExtensions: (payload: {
      atPath: TreePath;
      extensions: Record<string, any> | undefined;
    }) => void;
    /**
     * Rename a collection mode
     * @param atPath - The path of the collection to update
     * @param fromMode - The mode to rename
     * @param toMode - The new name of the mode
     */
    renameCollectionMode: (payload: { atPath: TreePath; fromMode: string; toMode: string }) => void;
    /**
     * Delete a collection mode and applies the mode deletion to all enclosed tokenTree
     * @param atPath - The path of the collection to update
     * @param mode - The mode to delete
     */
    deleteCollectionMode: (payload: { mode: string; atPath: TreePath }) => void;
    /**
     * Truncate a collection
     * @param atPath - The path of the collection to truncate
     */
    truncateCollection: (payload: { atPath: TreePath }) => void;
    /**
     * Delete a collection
     * @param atPath - The path of the collection to delete
     */
    deleteCollection: (payload: { atPath: TreePath }) => void;
    /**
     * Move a collection
     * @param atPath - The path of the collection to move
     */
    moveCollection: (payload: { atPath: TreePath; toPath: TreePath }) => void;
    /**
     * Add a new group to the tokenTree
     * @param parentPath - The path of the parent group or collection
     * @param name - The name of the new group
     * @param groupProperties - The properties of the new group
     */
    addGroup: (payload: {
      name: string;
      parentPath: TreePath;
      groupProperties: SpecifyDesignTokenGroupProperties;
    }) => void;
    /**
     * Rename a group
     * @param atPath - The path of the group to rename
     * @param name - The new name of the group
     */
    renameGroup: (payload: { name: string; atPath: TreePath }) => void;
    /**
     * Update the description of a group
     * @param atPath - The path of the group to update
     * @param description - The new description of the group
     */
    updateGroupDescription: (payload: { description: string; atPath: TreePath }) => void;
    /**
     * Update the extensions of a group
     * @param atPath - The path of the group to update
     * @param extensions - The new extensions of the group
     */
    updateGroupExtensions: (payload: {
      atPath: TreePath;
      extensions: Record<string, any> | undefined;
    }) => void;
    /**
     * Truncate a group
     * @param atPath - The path of the group to truncate
     */
    truncateGroup: (payload: { atPath: TreePath }) => void;
    /**
     * Delete a group
     * @param atPath - The path of the group to delete
     */
    deleteGroup: (payload: { atPath: TreePath }) => void;
    /**
     * Move a group
     * @param atPath - The path of the group to move
     */
    moveGroup: (payload: { atPath: TreePath; toPath: TreePath }) => void;
    /**
     * Add a new token to the tokenTree
     * @param parentPath - The path of the parent group or collection
     * @param name - The name of the new token
     * @param tokenProperties - The properties of the new token
     */
    addToken: (payload: {
      name: string;
      parentPath: TreePath;
      tokenProperties: SpecifyDesignToken;
    }) => void;
    /**
     * Rename a token
     * @param atPath - The path of the token to rename
     * @param name - The new name of the token
     */
    renameToken: (payload: { name: string; atPath: TreePath }) => void;
    /**
     * Update the description of a token
     * @param atPath - The path of the token to update
     * @param description - The new description of the token
     */
    updateTokenDescription: (payload: { description: string; atPath: TreePath }) => void;
    /**
     * Update the extensions of a token
     * @param atPath - The path of the token to update
     * @param extensions - The new extensions of the token
     */
    updateTokenExtensions: (payload: {
      atPath: TreePath;
      extensions: Record<string, any> | undefined;
    }) => void;
    /**
     * Update the value of a token
     * @param atPath - The path of the token to update
     * @param value - The new value of the token (with all modes)
     */
    updateTokenValue: <
      Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
    >(payload: {
      atPath: TreePath;
      value?: PickSpecifyDesignToken<Type, string, true, false>['$value'];
    }) => void;
    /**
     * Turn all token value (resolvable) aliases into their raw values
     * @param payload
     */
    resolveTokenValueAliases: (payload: { atPath: TreePath }) => void;
    /**
     * Update the value of a token for a given mode
     * @param atPath - The path of the token to update
     * @param mode - The mode to update
     * @param value - The new value for the mode
     */
    updateTokenModeValue: <
      Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
    >(payload: {
      mode: string;
      atPath: TreePath;
      value?: PickSpecifyDesignToken<Type, string, true, false>['$value'];
    }) => void;
    /**
     * Rename a token mode
     * @param atPath - The path of the token to update
     * @param fromMode - The mode to rename
     */
    renameTokenMode: (payload: { atPath: TreePath; fromMode: string; toMode: string }) => void;
    /**
     * Create a new token mode value
     * @param atPath - The path of the token to update
     * @param mode - The mode to create
     * @param value - The new value for the mode
     */
    createTokenModeValue: <
      Type extends SpecifyDesignTokenTypeName = SpecifyDesignTokenTypeName,
    >(payload: {
      mode: string;
      atPath: TreePath;
      value?: PickSpecifyDesignToken<Type, string, true, false>['$value'];
    }) => void;
    /**
     * Delete a token mode value
     * @param atPath - The path of the token to update
     * @param mode - The mode to delete
     */
    deleteTokenModeValue: (payload: { mode: string; atPath: TreePath }) => void;
    /**
     * Delete a token
     * @param atPath - The path of the token to delete
     */
    deleteToken: (payload: { atPath: TreePath }) => void;
    /**
     * Move a token
     * @param atPath - The path of the token to move
     * @param toPath - The path to move the token to
     */
    moveToken: (payload: { atPath: TreePath; toPath: TreePath }) => void;
    /**
     * Rename a node
     * @param atPath - The path of the token to rename
     * @param name - The new name of the node
     */
    renameNode: (payload: { name: string; atPath: TreePath }) => void;
  };
  query: {
    /**
     * Run a query against the tokenTree
     * @param query - The SDTF Query to evaluate
     */
    run: (query: SDTFQuery) => QueryResult;
    /**
     * Get a tokenState instance from the tokenTree
     * @param path - The path of the token
     * @returns The tokenState instance wrapped in a Result type
     */
    getTokenState: <Type extends SpecifyDesignTokenTypeName>(
      path: TreePath | string,
      options?: ViewSelectorOptions,
    ) => TokenState<Type> | undefined;
    /**
     * Get a groupState instance from the tokenTree
     * @param path - The path of the group
     * @returns The groupState instance wrapped in a Result type
     */
    getGroupState: (
      path: TreePath | string,
      options?: ViewSelectorOptions,
    ) => GroupState | undefined;
    /**
     * Get a collectionState instance from the tokenTree
     * @param path - The path of the collection
     * @returns The collectionState instance wrapped in a Result type
     */
    getCollectionState: (
      path: TreePath | string,
      options?: ViewSelectorOptions,
    ) => CollectionState | undefined;
    /**
     * Get the collectionState instance enclosing the given path
     * @param path - The path of the token or group
     * @returns The collectionState instance wrapped in a Result type
     */
    getNearestCollectionState: (
      path: TreePath | string,
      options?: ViewSelectorOptions,
    ) => CollectionState | undefined;
    /**
     * Get all tokenState instances from the tokenTree
     */
    getAllTokenStates: (options?: ViewSelectorOptions) => TokenState[];
    /**
     * Get all groupState instances from the tokenTree
     */
    getAllGroupStates: (options?: ViewSelectorOptions) => GroupState[];
    /**
     * Get all collectionState instances from the tokenTree
     */
    getAllCollectionStates: (options?: ViewSelectorOptions) => CollectionState[];
    /**
     * Get all tokenState, groupState and collectionState instances from the tokenTree
     */
    getAllNodeStates: (options?: ViewSelectorOptions) => SDTFNodeState[];
    /**
     * Get the tokenState instances that are children of the given path
     */
    getTokenChildrenOf: (
      path: TreePath,
      depth?: number,
      options?: ViewSelectorOptions,
    ) => TokenState[];
    /**
     * Get the groupState instances that are children of the given path
     * @param path - The path of the group or collection
     */
    getGroupChildrenOf: (
      path: TreePath,
      depth?: number,
      options?: ViewSelectorOptions,
    ) => GroupState[];
    /**
     * Get the collectionState instances that are children of the given path
     * @param path - The path of the group or collection
     */
    getCollectionChildrenOf: (
      path: TreePath,
      depth?: number,
      options?: ViewSelectorOptions,
    ) => CollectionState[];
    /**
     * Get the tokenState, groupState and collectionState instances that are children of the given path
     * @param path - The path of the group
     * @param depth - The depth of the children to get
     */
    getChildrenOf: (
      path: TreePath,
      depth?: number,
      options?: ViewSelectorOptions,
    ) => SDTFNodeState[];
    /**
     * Get the groupState and collectionState instances that are parents of the given path
     * @param path - The path of the token, group or collection
     * @param depth - The depth of the parents to get
     */
    getParentsOf: (
      path: TreePath,
      depth?: number,
      options?: ViewSelectorOptions,
    ) => SDTFNodeState[];
    /**
     * Get groupState instances that are direct children of the root path
     * @param path - The path of the group or collection
     */
    getGroupChildren: (options?: ViewSelectorOptions) => GroupState[];
    /**
     * Get tokenState instances that are direct children of the root path
     * @param path - The path of the group or collection
     */
    getTokenChildren: (options?: ViewSelectorOptions) => TokenState[];
    /**
     * Get collectionState instances that are direct children of the root path
     * @param path - The path of the group
     */
    getCollectionChildren: (options?: ViewSelectorOptions) => CollectionState[];

    /**
     * Get the JSON representation of the tokenTree
     * @param renderOptions - The options to indicate alias resolution and integrity checks
     */
    renderJSONTree: (renderOptions?: GetJSONTokenValueOptions) => SpecifyDesignTokenFormat;
    /**
     * Get the aliasReference instance from given coordinates
     * @param from - The coordinates of the aliasReference
     */
    getAliasReference: (from: {
      treePath: TreePath;
      valuePath: ValuePath;
      mode: string | null;
    }) => AliasReference | undefined;
    /**
     * Get all aliasReference instances from the tokenTree
     */
    getAllAliasReferences: () => AliasReference[];
    /**
     * Get all aliasReference instances that reference the given "to" coordinates
     * @param to - The (partial) coordinates of the aliasReference
     * @param options - The options to filter on resolvability
     */
    getAliasReferencesTo: <
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
    ) => R;
    /**
     * Get all aliasReference instances that reference the given "from" coordinates
     * @param from - The (partial) coordinates of the aliasReference
     * @param options - The options to filter on resolvability
     */
    getAliasReferencesFrom: <
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
    ) => R;
    /**
     * Get the statefulAliasReference instance of the given "from" coordinates
     * @param from - The coordinates of the aliasReference
     */
    getStatefulAliasReference: (from: {
      treePath: TreePath;
      valuePath: ValuePath;
      mode: string | null;
    }) => StatefulAliasReference;
    /**
     * Get the statefulAliasReference instances that reference the given "to" coordinates
     * @param to - The (partial) coordinates of the aliasReference
     * @param options - The options to filter on resolvability
     */
    getStatefulAliasReferencesTo: <
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
    ) => R;
    /**
     * Get the statefulAliasReference instances that reference the given "from" coordinates
     * @param from - The (partial) coordinates of the aliasReference
     * @param options - The options to filter on resolvability
     */
    getStatefulAliasReferencesFrom: <
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
    ) => R;
    /**
     * Get the list of registered views
     */
    listViews: () => {
      name: string;
      query: SDTFQuery;
      isActive: boolean;
    }[];
    /**
     * Get the active view details (or null)
     */
    getActiveView: () => SerializedView | null;
  };
  /**
   * Export the serialized current engine state
   */
  exportEngineState: () => SDTFEngineSerializedState;
  /**
   * Create a new engine with the same state and views
   */
  clone: () => SDTFEngine;
};
