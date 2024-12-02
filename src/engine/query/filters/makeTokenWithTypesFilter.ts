import { returnTrue } from '../internals/returnTrue.js';
import { TokenTypesSelector } from '../internals/withTypes.js';
import { TokenState } from '../../state/TokenState.js';

export function makeTokenWithTypesFilter(
  withTypes: TokenTypesSelector,
): (tokenState: TokenState) => boolean {
  if (withTypes === undefined) return returnTrue;

  return function filter(tokenState: TokenState) {
    const matchOnInclude = withTypes.include ? withTypes.include.includes(tokenState.type) : true;
    const matchOnExclude = withTypes.exclude ? !withTypes.exclude.includes(tokenState.type) : true;
    return matchOnInclude && matchOnExclude;
  };
}
