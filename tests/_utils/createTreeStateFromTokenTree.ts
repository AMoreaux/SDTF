import {
  AliasReferenceSet,
  SDTFEngineSerializedMetadata,
  SpecifyDesignTokenFormat,
  TreeNodesState,
  TreeState,
} from '../../src/index.js';
import { analyzeTokenTree } from '../../src/engine/parser/analyzeTokenTree.js';
import { fillTreeNodesStateAndAliasReferences } from '../../src/engine/builder/createTreeState.js';
import { ViewsState } from '../../src/engine/state/ViewsState.js';

export function createTreeStateFromTokenTree(
  tokenTree: SpecifyDesignTokenFormat,
  metadata?: SDTFEngineSerializedMetadata,
) {
  const analyzedTokenTree = analyzeTokenTree(tokenTree);

  const globalState = new TreeNodesState();
  const aliasReferences = new AliasReferenceSet();

  const viewsState = new ViewsState();

  const treeState = new TreeState({
    globalState,
    aliasReferences,
    viewsState,
    activeViewName: null,
  });

  metadata?.views.forEach(view => {
    viewsState.register(view.name, view.query, treeState);
  });
  if (metadata && metadata.activeViewName !== null) {
    treeState.setActiveView(metadata.activeViewName);
  }

  fillTreeNodesStateAndAliasReferences(globalState, aliasReferences, analyzedTokenTree, treeState);

  return treeState;
}
