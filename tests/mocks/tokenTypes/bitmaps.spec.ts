import { describe, it, expect } from 'vitest';

import {
  SpecifyBitmapsValue,
  makeSpecifyBitmapsValueSchema,
} from '../../../src/definitions/tokenTypes/bitmaps.js';

import { getMockedBitmapsValue } from '../../../src/mocks/tokenTypes/bitmaps.js';

describe.concurrent('getMockedBitmapsValue', () => {
  it('Should return a mocked bitmaps value with nulls', ({ expect }) => {
    const value = getMockedBitmapsValue();
    expect(Array.isArray(value.files)).toBeTruthy();

    let count = 0;

    for (const bitmap of value.files) {
      expect(bitmap).toHaveProperty('url');
      expect(bitmap).toHaveProperty('format');
      expect(bitmap).toHaveProperty('width');
      expect(bitmap).toHaveProperty('height');
      expect(bitmap).toHaveProperty('variationLabel');
      expect(bitmap).toHaveProperty('provider');
      expect(bitmap.width).toBeNull();
      expect(bitmap.height).toBeNull();
      expect(bitmap.variationLabel).toBeNull();
      ++count;
    }

    expect(count).toBe(value.files.length);

    const result = makeSpecifyBitmapsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });

  it('Should return a mocked bitmaps value without nulls', () => {
    const value = getMockedBitmapsValue(undefined, false);
    expect(Array.isArray(value.files)).toBeTruthy();

    let count = 0;
    for (const bitmap of value.files) {
      expect(bitmap).toHaveProperty('url');
      expect(bitmap).toHaveProperty('format');
      expect(bitmap).toHaveProperty('width');
      expect(bitmap).toHaveProperty('height');
      expect(bitmap).toHaveProperty('variationLabel');
      expect(bitmap).toHaveProperty('provider');
      expect(bitmap.width).not.toBeNull();
      expect(bitmap.height).not.toBeNull();
      expect(bitmap.variationLabel).not.toBeNull();
      ++count;
    }

    expect(count).toBe(value.files.length);

    const result = makeSpecifyBitmapsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked bitmaps value with partial', () => {
    const override: SpecifyBitmapsValue = {
      files: [
        {
          url: 'https://specifyapp.com',
          format: 'png',
          width: 0,
          height: 0,
          variationLabel: 'default',
          provider: 'Specify',
        },
      ],
    };

    const value = getMockedBitmapsValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyBitmapsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
