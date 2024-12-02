import { describe, it, expect } from 'vitest';

import { specifyDesignTokenTypeNames } from '../../src/definitions/index.js';

import { getAllMockedDesignTokens } from '../../src/mocks/getAllMockedDesignTokens.js';

describe('getAllMockedDesignTokens', () => {
  it('Should return all available mocked Design Tokens as a tree by default', () => {
    const tokenTree = getAllMockedDesignTokens();

    expect(Object.keys(tokenTree).length).toBe(specifyDesignTokenTypeNames.length);
  });
  it('Should return all available mocked Design Tokens as an array if specified in options', () => {
    const tokenArray = getAllMockedDesignTokens({ asArray: true });
    expect(tokenArray.length).toBe(specifyDesignTokenTypeNames.length);
  });
});
