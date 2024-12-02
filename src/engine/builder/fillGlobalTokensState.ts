import { TreeNodeSet } from '../state/TreeNodeSet.js';
import { AnalyzedToken } from '../parser/internals/parseRawToken.js';
import { TokenState } from '../state/TokenState.js';
import { AliasReferenceSet } from '../state/AliasReferenceSet.js';
import { TreeState } from '../state/TreeState.js';
import { createTokenState } from './createTokenState.js';
import { SDTFError } from '../../errors/index.js';
import { findOrRegisterTokenState } from './findOrRegisterTokenState.js';
import { fillAliasReferences } from './fillAliasReferences.js';

export function fillGlobalTokensState(
  analyzedTokens: TreeNodeSet<AnalyzedToken>,
  globalTokensState: TreeNodeSet<TokenState>,
  aliasReferences: AliasReferenceSet,
  treeState: TreeState,
) {
  analyzedTokens.all.forEach(analyzedToken => {
    let tokenState: TokenState;

    // Token is not already registered because of another token aliasing it
    if (globalTokensState.has(analyzedToken.path.toString()) === false) {
      tokenState = createTokenState(treeState, analyzedToken);
      globalTokensState.add(tokenState);
    } else {
      const maybeTokenState = globalTokensState.getOne(analyzedToken.path.toString());

      /* v8 ignore next 6 */
      if (!maybeTokenState) {
        throw new SDTFError(
          'SDTF_INTERNAL_DESIGN_ERROR',
          `Token not found for path: ${analyzedToken.path}`,
        );
      }

      tokenState = maybeTokenState;
    }

    // We populate the alias references
    fillAliasReferences(analyzedToken, tokenState, aliasReferences, stringPath =>
      findOrRegisterTokenState(stringPath, globalTokensState, analyzedTokens, treeState),
    );
  });
}
