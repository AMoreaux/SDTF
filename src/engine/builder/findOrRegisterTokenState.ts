import { TreeNodeSet } from '../state/TreeNodeSet.js';
import { TokenState } from '../state/TokenState.js';
import { AnalyzedToken } from '../parser/internals/parseRawToken.js';
import { TreeState } from '../state/TreeState.js';
import { SDTFError } from '../../errors/index.js';
import { createTokenState } from './createTokenState.js';

export function findOrRegisterTokenState(
  stringPath: string,
  tokensState: TreeNodeSet<TokenState>,
  analyzedTokens: TreeNodeSet<AnalyzedToken>,
  treeState: TreeState,
) {
  const maybeTokenState = tokensState.getOne(stringPath);

  if (maybeTokenState) {
    return maybeTokenState;
  }

  const maybeAnalyzedToken = analyzedTokens.getOne(stringPath);

  /* v8 ignore next 6 */
  if (!maybeAnalyzedToken) {
    throw new SDTFError(
      'SDTF_INTERNAL_DESIGN_ERROR',
      `AnalyzedToken not found for token with path: ${stringPath}`,
    );
  }

  const newTokenState = createTokenState(treeState, maybeAnalyzedToken);

  tokensState.add(newTokenState);

  return newTokenState;
}
