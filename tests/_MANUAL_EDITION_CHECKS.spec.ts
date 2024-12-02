import { describe, expect, it } from 'vitest';
import * as typeNamesMap from '../src/definitions/designTokenTypeNames.js';
import {
  specifyDesignTokenDefinitions,
  specifyDesignTokenTypeNames,
} from '../src/definitions/designTokenDefinitions.js';
import { designTokenFixtures } from './definitions/designTokenType.fixtures.js';
import { getMockedDesignTokenValue } from '../src/index.js';

/* ------------------------------------------
   This test suite is meant to ensure the
   SDTF APIs (definitions, type with metadata,
   mocks) are kept in sync.
   Doing so, it certifies the public API is
   stable over its features.
--------------------------------------------- */
describe('MANUAL DEFINITIONS', () => {
  it('Should have the right declaration length based on the number of type names', () => {
    const typeNames = Object.values(typeNamesMap).sort();
    const definitionNames = specifyDesignTokenDefinitions.map(d => d.type).sort();

    const biggestCollection =
      typeNames.length > definitionNames.length ? typeNames : definitionNames;
    const smallestCollectionName =
      typeNames.length < definitionNames.length ? 'Export declaration' : 'Definitions';

    const notMatching = biggestCollection.filter(name => {
      return !typeNames.includes(name as any) || !definitionNames.includes(name);
    });

    if (notMatching.length > 0)
      throw new Error(
        `Missing declaration in "${smallestCollectionName}" for "${notMatching.join('", "')}".`,
      );

    expect(definitionNames.length).toBe(typeNames.length);
  });
  it('Fixtures count should match the number of token types', () => {
    expect(designTokenFixtures.length).toBe(specifyDesignTokenTypeNames.length);
  });
  it('Should have the right number of mocks for each type', ({ expect }) => {
    for (const typeName of specifyDesignTokenTypeNames) {
      const value = getMockedDesignTokenValue(
        // @ts-expect-error
        typeName,
      );
      expect(value).toBeDefined();
    }
    expect.assertions(specifyDesignTokenTypeNames.length);
  });
});
