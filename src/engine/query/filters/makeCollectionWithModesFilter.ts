import { returnTrue } from '../internals/returnTrue.js';
import { ModesSelector } from '../internals/withModes.js';
import { CollectionState } from '../../state/CollectionState.js';

export function makeCollectionWithModesFilter(
  withModes: ModesSelector,
): (collectionState: CollectionState) => boolean {
  if (withModes === undefined) return returnTrue;

  return function filter(collectionState: CollectionState) {
    const collectionModes = collectionState.innerAllowedModes;
    const matchOnInclude = withModes.include
      ? withModes.include.some(m => collectionModes.includes(m))
      : true;
    const matchOnExclude = withModes.exclude
      ? !withModes.exclude.some(m => collectionModes.includes(m))
      : true;
    return matchOnInclude && matchOnExclude;
  };
}
