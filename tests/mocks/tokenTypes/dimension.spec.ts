import { describe, it, expect } from 'vitest';

import { makeSpecifyDimensionValueSchema } from '../../../src/definitions/tokenTypes/dimension.js';

import { getMockedDimensionValue } from '../../../src/mocks/tokenTypes/dimension.js';

describe.concurrent('getMockedDimensionValue', () => {
  it('Should return a default mocked dimension value', () => {
    const value = getMockedDimensionValue();
    expect(value).toHaveProperty('value');
    expect(value).toHaveProperty('unit');

    expect(typeof value.value).toBe('number');
    expect(typeof value.unit).toBe('string');

    const result = makeSpecifyDimensionValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked dimension value with partial', () => {
    const partial = {
      value: 0,
      unit: 'px',
    } as const;

    const value = getMockedDimensionValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifyDimensionValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
