import { TokenState } from '../../state/TokenState.js';
import { TokenContainsAliases } from '../definitions/tokenWhere.js';
import { returnTrue } from '../internals/returnTrue.js';

export function makeTokenWithContainsAliasesFilter(
  withContainsAliases: TokenContainsAliases,
): (tokenState: TokenState) => boolean {
  if (withContainsAliases === undefined) return returnTrue;

  return function filter(tokenState: TokenState) {
    if (typeof withContainsAliases === 'boolean') {
      const hasAliases = tokenState.aliases.length > 0;
      return withContainsAliases ? hasAliases : !hasAliases;
    }
    const aliases = tokenState.aliases;

    let shouldReturnOnLevel = true;
    const level = withContainsAliases.level ?? 'all';
    switch (level) {
      case 'mode': {
        shouldReturnOnLevel = aliases.some(
          alias => alias.from.mode !== null && alias.from.valuePath.length === 0,
        );
        break;
      }
      case 'value': {
        shouldReturnOnLevel = aliases.some(
          alias => alias.from.mode !== null && alias.from.valuePath.length !== 0,
        );
        break;
      }
    }

    let shouldReturnOnResolvability = true;
    const resolvability = withContainsAliases.resolvability ?? 'all';
    switch (resolvability) {
      case 'resolvable': {
        shouldReturnOnResolvability = aliases.length > 0 && tokenState.isFullyResolvable;
        break;
      }
      case 'unresolvable': {
        shouldReturnOnResolvability = aliases.length > 0 && !tokenState.isFullyResolvable;
        break;
      }
    }

    return shouldReturnOnLevel && shouldReturnOnResolvability;
  };
}
