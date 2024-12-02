import { describe, it, expect } from 'vitest';

import { makeSpecifyRadiusValueSchema } from '../../../src/definitions/tokenTypes/radius.js';

import { getMockedRadiusValue } from '../../../src/mocks/tokenTypes/radius.js';

describe('getMockedRadiusValue', () => {
  it('Should return a mocked radius value', () => {
    const value = getMockedRadiusValue();

    expect(value).toHaveProperty('value');
    expect(value).toHaveProperty('unit', 'px');

    const result = makeSpecifyRadiusValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked radius value with partial', () => {
    const partial = {
      value: 1,
      unit: 'vh' as const,
    };

    const value = getMockedRadiusValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifyRadiusValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
