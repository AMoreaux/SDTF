import { describe, it, expect } from 'vitest';

import { makePreviousMatchesWithChildrenFilter } from '../../../../src/engine/query/filters/makePreviousMatchesWithChildrenFilter.js';
import { createSDTFEngine } from '../../../../src/index.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('makePreviousMatchesWithChildrenFilter', () => {
  const tokens = {
    aGroup: {
      aNestedGroupInGroup: {
        aStringInGroupInGroup: {
          $type: 'string',
          $value: { default: 'aStringInGroupInGroup' },
        },
      },
      aStringInGroup: {
        $type: 'string',
        $value: { default: 'aStringInGroup' },
      },
    },
    aGroupSibling: {
      $description: 'aGroupSibling starting with the same name as aGroup',
    },
    aCollection: {
      $collection: { $modes: ['default'] },
      aNestedGroupInCollection: {
        aStringInCollectionInGroup: {
          $type: 'string',
          $value: { default: 'aStringInCollectionInGroup' },
        },
      },
    },
  };

  it('should not filter when previousMatches is undefined', () => {
    const previousMatches = undefined;

    const filterFn = makePreviousMatchesWithChildrenFilter(previousMatches);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllNodeStates();

    const results = allNodes.filter(filterFn);
    expect(results).toEqual(allNodes);
  });
  it('should filter the nodes that are children of the previous matches', () => {
    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllNodeStates();

    const MaybeAGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));
    if (!MaybeAGroupState) throw new Error('unresolvable');

    const maybeACollectionState = sdtfEngine.query.getCollectionState(
      new TreePath(['aCollection']),
    );
    if (!maybeACollectionState) throw new Error('unresolvable');

    const previousMatches = [MaybeAGroupState, maybeACollectionState];

    const filterFn = makePreviousMatchesWithChildrenFilter(previousMatches);

    const results = allNodes.filter(filterFn);

    const stringPaths = results.map(node => node.path.toString());

    expect(stringPaths).toStrictEqual([
      'aCollection',
      'aCollection.aNestedGroupInCollection',
      'aCollection.aNestedGroupInCollection.aStringInCollectionInGroup',
      'aGroup',
      'aGroup.aNestedGroupInGroup',
      'aGroup.aNestedGroupInGroup.aStringInGroupInGroup',
      'aGroup.aStringInGroup',
    ]);
  });
});
