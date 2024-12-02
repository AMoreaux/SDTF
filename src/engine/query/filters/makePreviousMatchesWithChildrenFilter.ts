import { GroupState } from '../../state/GroupState.js';
import { CollectionState } from '../../state/CollectionState.js';
import { TreeNodeState } from '../../state/TreeNodeState.js';
import { makeGetChildrenOfFilter } from '../../utils/makeGetChildrenOfFilter.js';
import { returnTrue } from '../internals/returnTrue.js';

export function makePreviousMatchesWithChildrenFilter(
  previousMatches: Array<GroupState | CollectionState> | undefined,
): (node: TreeNodeState) => boolean {
  const filters = previousMatches?.map(node => makeGetChildrenOfFilter(node.path));
  const matchedStringPaths = previousMatches?.map(node => node.path.toString());

  if (filters === undefined || matchedStringPaths === undefined) return returnTrue;

  return function filter(node: TreeNodeState) {
    // Take the previous matches...
    if (matchedStringPaths.includes(node.path.toString())) {
      return true;
    }
    // ...and filter out the nodes that are not children of the previous matches
    return filters.some(filter => filter(node));
  };
}
