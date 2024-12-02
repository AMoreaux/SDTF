import { describe, it, expect } from 'vitest';

import { SpecifyVectorValue } from '../../../src/definitions/tokenTypes/vector.js';

import { getMockedVectorValue } from '../../../src/mocks/tokenTypes/vector.js';

describe('getMockedVectorValue', () => {
  it('Should return a mocked vector value with nulls', () => {
    const value = getMockedVectorValue();

    expect(value).toHaveProperty('url');
    expect(value).toHaveProperty('format');
    expect(value).toHaveProperty('variationLabel');
    expect(value).toHaveProperty('provider');

    expect(typeof value.url).toBe('string');
    expect(typeof value.format).toBe('string');
    expect(value.variationLabel).toBeNull();
    expect(typeof value.provider).toBe('string');
  });
  it('Should return a mocked vector value without nulls', () => {
    const value = getMockedVectorValue({}, false);

    expect(value.variationLabel).not.toBeNull();
  });
  it('Should return a mocked vector value with override', () => {
    const override: SpecifyVectorValue = {
      url: 'https://sdtf.specifyapp.com/icon.svg',
      format: 'svg',
      variationLabel: 'dark',
      provider: 'Specify',
    };
    const value = getMockedVectorValue(override);

    expect(value).toEqual(override);
  });
});
