import { returnTrue } from '../internals/returnTrue.js';
import { ModesSelector } from '../internals/withModes.js';
import { TokenState } from '../../state/TokenState.js';

export function makeTokenWithModesFilter(
  withModes: ModesSelector | undefined,
): (tokenState: TokenState) => boolean {
  if (withModes === undefined) return returnTrue;

  return function filter(tokenState: TokenState) {
    const tokenModes = tokenState.modes;
    const matchOnInclude = withModes.include
      ? withModes.include.some(m => tokenModes.includes(m))
      : true;
    const matchOnExclude = withModes.exclude
      ? !withModes.exclude.some(m => tokenModes.includes(m))
      : true;
    return matchOnInclude && matchOnExclude;
  };
}
