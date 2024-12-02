import { describe, it, expect } from 'vitest';

import { makeSpecifyBitmapFormatValueSchema } from '../../../src/definitions/tokenTypes/bitmapFormat.js';

import { getMockedBitmapFormatValue } from '../../../src/mocks/tokenTypes/bitmapFormat.js';

describe.concurrent('getMockedBitmapFormatValue', () => {
  it('Should return a mocked bitmap value with nulls', () => {
    const value = getMockedBitmapFormatValue();
    expect(typeof value).toBe('string');

    const result = makeSpecifyBitmapFormatValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked bitmap value with selector', () => {
    const selector = 'png';

    const value = getMockedBitmapFormatValue(selector);
    expect(value).toStrictEqual(selector);

    const result = makeSpecifyBitmapFormatValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
