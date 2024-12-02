import { specifySourceIdTokenExtension } from '../../../definitions/index.js';
import { TokenState } from '../../state/TokenState.js';
import { TokenSourceIds } from '../definitions/tokenWhere.js';
import { returnTrue } from '../internals/returnTrue.js';

export function makeTokenWithSourceIdsFilter(
  withSources: TokenSourceIds,
): (tokenState: TokenState) => boolean {
  if (withSources === undefined) return returnTrue;

  return function filter(tokenState: TokenState) {
    const tokenSourceId =
      tokenState.extensions && tokenState.extensions[specifySourceIdTokenExtension]
        ? tokenState.extensions[specifySourceIdTokenExtension]
        : undefined;
    if ('include' in withSources) {
      if (tokenSourceId === undefined || typeof tokenSourceId !== 'string') return false;
      return withSources.include.includes(tokenSourceId);
    }
    if ('exclude' in withSources) {
      if (tokenSourceId === undefined || typeof tokenSourceId !== 'string') return true;
      return !withSources.exclude.includes(tokenSourceId);
    }
    return false;
  };
}
