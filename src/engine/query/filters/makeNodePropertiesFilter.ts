import { TreeNodeState } from '../../state/TreeNodeState.js';

export function makeNodePropertiesFilter(regexes: {
  maybeNameRegex: RegExp | undefined;
  maybeDescriptionRegex: RegExp | undefined;
}) {
  return function filter(node: TreeNodeState) {
    const matchedOnName = regexes.maybeNameRegex ? regexes.maybeNameRegex.test(node.name) : true;
    const matchedOnDescription = regexes.maybeDescriptionRegex
      ? typeof node.description === 'string'
        ? regexes.maybeDescriptionRegex.test(node.description)
        : false
      : true;
    return matchedOnName && matchedOnDescription;
  };
}
