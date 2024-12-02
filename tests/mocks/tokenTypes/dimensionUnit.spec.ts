import { describe, it, expect } from 'vitest';

import { makeSpecifyDimensionUnitValueSchema } from '../../../src/definitions/tokenTypes/dimensionUnit.js';

import { getMockedDimensionUnitValue } from '../../../src/mocks/tokenTypes/dimensionUnit.js';

describe.concurrent('getMockedDimensionUnitValue', () => {
  it('Should return a default mocked dimension unit value', () => {
    const value = getMockedDimensionUnitValue();
    expect(typeof value).toBe('string');

    const result = makeSpecifyDimensionUnitValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked dimension unit value with selector', () => {
    const selector = 'px';

    const value = getMockedDimensionUnitValue(selector);
    expect(value).toStrictEqual(selector);

    const result = makeSpecifyDimensionUnitValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
