import { describe, it, expect } from 'vitest';

import {
  SpecifyBitmapValue,
  makeSpecifyBitmapValueSchema,
} from '../../../src/definitions/tokenTypes/bitmap.js';

import { getMockedBitmapValue } from '../../../src/mocks/tokenTypes/bitmap.js';

describe.concurrent('getMockedBitmapValue', () => {
  it('Should return a mocked bitmap value with nulls', () => {
    const value = getMockedBitmapValue();
    expect(value).toHaveProperty('url');
    expect(value).toHaveProperty('format');
    expect(value).toHaveProperty('width');
    expect(value).toHaveProperty('height');
    expect(value).toHaveProperty('variationLabel');
    expect(value).toHaveProperty('provider');

    expect(value.width).toBeNull();
    expect(value.height).toBeNull();
    expect(value.variationLabel).toBeNull();

    const result = makeSpecifyBitmapValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });

  it('Should return a mocked bitmap value without nulls', () => {
    const value = getMockedBitmapValue({}, false);

    expect(value.width).not.toBeNull();
    expect(value.height).not.toBeNull();
    expect(value.variationLabel).not.toBeNull();

    const result = makeSpecifyBitmapValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked bitmap value with partial', () => {
    const partial: SpecifyBitmapValue = {
      url: 'https://specifyapp.com',
      format: 'png',
      width: 0,
      height: 0,
      variationLabel: 'default',
      provider: 'Specify',
    };

    const value = getMockedBitmapValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifyBitmapValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
