import { TreeState } from '../state/TreeState.js';
import { AnalyzedToken } from '../parser/internals/parseRawToken.js';
import { SDTFError } from '../../errors/index.js';
import { TokenState } from '../state/TokenState.js';
import { SpecifyDesignTokenTypeName } from '../../definitions/index.js';
import { TreeNodeExtensions } from '../../definitions/internals/designTokenTree.js';

export function createTokenState(treeState: TreeState, analyzedToken: AnalyzedToken) {
  if (analyzedToken.isFullyResolvable === undefined) {
    throw new SDTFError('SDTF_INTERNAL_DESIGN_ERROR', 'isFullyResolvable is undefined');
  }
  if (analyzedToken.modesResolvability === undefined) {
    throw new SDTFError('SDTF_INTERNAL_DESIGN_ERROR', 'modesResolvability is undefined');
  }

  return new TokenState(treeState, {
    path: analyzedToken.path,
    name: analyzedToken.name,
    $type: analyzedToken.$type as SpecifyDesignTokenTypeName,
    $description: analyzedToken.$description,
    $extensions: analyzedToken.$extensions as TreeNodeExtensions,
    definition: analyzedToken.definition,
    isTopLevelAlias: analyzedToken.isTopLevelAlias,
    analyzedValuePrimitiveParts: analyzedToken.analyzedValuePrimitiveParts,
    isFullyResolvable: analyzedToken.isFullyResolvable,
    modesResolvabilityMap: new Map(Object.entries(analyzedToken.modesResolvability)),
  });
}
