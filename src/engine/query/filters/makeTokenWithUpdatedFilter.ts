import { specifyUpdatedAtTokenExtension } from '../../../definitions/index.js';
import { TokenState } from '../../state/TokenState.js';
import { TokenUpdated } from '../definitions/tokenWhere.js';
import { returnTrue } from '../internals/returnTrue.js';

export function makeTokenWithUpdatedFilter(
  updated: TokenUpdated,
): (tokenState: TokenState) => boolean {
  if (updated === undefined) return returnTrue;

  const from = updated.from ? new Date(updated.from) : undefined;
  const to = updated.to ? new Date(updated.to) : undefined;

  return function filter(tokenState: TokenState) {
    const tokenUpdatedAt =
      tokenState.extensions &&
      tokenState.extensions[specifyUpdatedAtTokenExtension] &&
      typeof tokenState.extensions[specifyUpdatedAtTokenExtension] === 'string'
        ? new Date(tokenState.extensions[specifyUpdatedAtTokenExtension])
        : undefined;
    if (tokenUpdatedAt === undefined) return false;

    if (from && to) {
      return from <= tokenUpdatedAt && to >= tokenUpdatedAt;
    }
    if (from) {
      return from <= tokenUpdatedAt;
    }
    if (to) {
      return to >= tokenUpdatedAt;
    }

    return false;
  };
}
