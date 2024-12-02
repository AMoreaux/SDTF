import { describe, it, expect } from 'vitest';

import { makeSpecifyBlurValueSchema } from '../../../src/definitions/tokenTypes/blur.js';

import { getMockedBlurValue } from '../../../src/mocks/tokenTypes/blur.js';

describe.concurrent('getMockedBlurValue', () => {
  it('Should return a default mocked blur value', () => {
    const value = getMockedBlurValue();

    expect(value).toHaveProperty('value');
    expect(value).toHaveProperty('unit', 'px');

    expect(typeof value.value).toBe('number');
    expect(typeof value.unit).toBe('string');

    const result = makeSpecifyBlurValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked blur value with partial', () => {
    const partial = {
      value: 88,
      unit: '%' as const,
    };

    const value = getMockedBlurValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifyBlurValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
