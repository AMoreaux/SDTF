import { describe, it, expect } from 'vitest';

import { Expect, Equal } from '../../_utils.js';
import {
  getSDTFMutationDefinition,
  SDTFMutationName,
} from '../../../src/engine/mutations/index.js';

describe.concurrent('getSDTFMutationDefinition', () => {
  it('should get the definition of all mutations', ({ expect }) => {
    const allMutations = [
      'resetTokenTree',
      'loadTokenTree',
      'registerView',
      'updateView',
      'setActiveView',
      'deleteView',
      'deleteAllViews',
      'addCollection',
      'renameCollection',
      'updateCollectionDescription',
      'updateCollectionExtensions',
      'renameCollectionMode',
      'truncateCollection',
      'deleteCollection',
      'deleteCollectionMode',
      'addGroup',
      'renameGroup',
      'updateGroupDescription',
      'updateGroupExtensions',
      'truncateGroup',
      'deleteGroup',
      'addToken',
      'renameToken',
      'updateTokenDescription',
      'updateTokenExtensions',
      'updateTokenValue',
      'resolveTokenValueAliases',
      'updateTokenModeValue',
      'renameTokenMode',
      'createTokenModeValue',
      'deleteTokenModeValue',
      'deleteToken',
    ] as const;

    type LocalMutationName = typeof allMutations[number];
    type isEqual = Expect<Equal<LocalMutationName, SDTFMutationName>>;

    let count = 0;
    allMutations.forEach(mutationName => {
      const mutationDefinition = getSDTFMutationDefinition(mutationName);
      expect(mutationDefinition.name).toEqual(mutationName);
      ++count;
    });
    expect(count).toBe(allMutations.length);
  });
  it('should throw an error if the mutation name is not valid', () => {
    expect(() => getSDTFMutationDefinition('invalid' as any)).toThrow(
      'No mutation definition found with name: "invalid"',
    );
  });
});
