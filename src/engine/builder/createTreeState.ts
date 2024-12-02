import { TreeState, TreeStateParams } from '../state/TreeState.js';
import { AnalyzedTokenTree } from '../parser/analyzeTokenTree.js';
import { AliasReferenceSet } from '../state/AliasReferenceSet.js';
import { TreeNodesState } from '../state/TreeNodesState.js';
import { createGroupState } from './createGroupState.js';
import { createCollectionState } from './createCollectionState.js';
import { ViewsState } from '../state/ViewsState.js';
import { fillGlobalTokensState } from './fillGlobalTokensState.js';

export function fillTreeNodesStateAndAliasReferences(
  globalState: TreeNodesState,
  aliasReferences: AliasReferenceSet,
  { analyzedGroups, analyzedCollections, analyzedTokens }: AnalyzedTokenTree,
  treeState: TreeState,
) {
  analyzedGroups.all.forEach(analyzedGroup => {
    globalState.groups.add(createGroupState(treeState, analyzedGroup));
  });

  analyzedCollections.all.forEach(analyzedCollection => {
    globalState.collections.add(createCollectionState(treeState, analyzedCollection));
  });

  fillGlobalTokensState(analyzedTokens, globalState.tokens, aliasReferences, treeState);
}

export function createTreeState(
  analyzedTokenTree: AnalyzedTokenTree,
  internalState?: Partial<TreeStateParams>,
) {
  const globalState = internalState?.globalState ?? new TreeNodesState();
  const aliasReferences = internalState?.aliasReferences ?? new AliasReferenceSet();

  const treeState = new TreeState({
    globalState,
    aliasReferences,
    viewsState: internalState?.viewsState ?? new ViewsState(),
    activeViewName: internalState?.activeViewName ?? null,
  });

  fillTreeNodesStateAndAliasReferences(globalState, aliasReferences, analyzedTokenTree, treeState);

  return treeState;
}
