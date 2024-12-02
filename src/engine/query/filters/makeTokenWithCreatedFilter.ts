import { specifyCreatedAtTokenExtension } from '../../../definitions/index.js';
import { TokenState } from '../../state/TokenState.js';
import { TokenCreated } from '../definitions/tokenWhere.js';
import { returnTrue } from '../internals/returnTrue.js';

export function makeTokenWithCreatedFilter(
  created: TokenCreated,
): (tokenState: TokenState) => boolean {
  if (created === undefined) return returnTrue;

  const from = created.from ? new Date(created.from) : undefined;
  const to = created.to ? new Date(created.to) : undefined;

  return function filter(tokenState: TokenState) {
    const tokenCreatedAt =
      tokenState.extensions &&
      tokenState.extensions[specifyCreatedAtTokenExtension] &&
      typeof tokenState.extensions[specifyCreatedAtTokenExtension] === 'string'
        ? new Date(tokenState.extensions[specifyCreatedAtTokenExtension])
        : undefined;
    if (tokenCreatedAt === undefined) return false;

    if (from && to) {
      return from <= tokenCreatedAt && to >= tokenCreatedAt;
    }
    if (from) {
      return from <= tokenCreatedAt;
    }
    if (to) {
      return to >= tokenCreatedAt;
    }

    return false;
  };
}
