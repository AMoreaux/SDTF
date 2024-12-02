import { describe, expect, it } from 'vitest';

import { specifyDesignTokenTypeNames } from '../../src/index.js';

import { getRandomDesignTokenTypeName } from '../../src/mocks/getRandomDesignTokenTypeName.js';

describe('getRandomDesignTokenTypeName', () => {
  it('Should return a random token type name', () => {
    const tokenTypeName = getRandomDesignTokenTypeName();
    expect(specifyDesignTokenTypeNames).toContain(tokenTypeName);
  });
});
