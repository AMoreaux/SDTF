import { describe, it, expect } from 'vitest';

import {
  SpecifyVectorsValue,
  makeSpecifyVectorsValueSchema,
} from '../../../src/definitions/tokenTypes/vectors.js';

import { getMockedVectorsValue } from '../../../src/mocks/tokenTypes/vectors.js';

describe.concurrent('getMockedVectorsValue', () => {
  it('Should return a mocked vectors value with nulls', ({ expect }) => {
    const value = getMockedVectorsValue();
    expect(Array.isArray(value.files)).toBeTruthy();

    let count = 0;
    for (const vector of value.files) {
      expect(vector).toHaveProperty('url');
      expect(vector).toHaveProperty('format');
      expect(vector).toHaveProperty('variationLabel');
      expect(vector).toHaveProperty('provider');
      expect(typeof vector.url).toBe('string');
      expect(typeof vector.format).toBe('string');
      expect(vector.variationLabel).toBeNull();
      expect(typeof vector.provider).toBe('string');
      ++count;
    }

    expect(count).toBe(value.files.length);

    const result = makeSpecifyVectorsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });

  it('Should return a mocked vectors value without nulls', ({ expect }) => {
    const value = getMockedVectorsValue(undefined, false);
    expect(Array.isArray(value.files)).toBeTruthy();

    let count = 0;
    for (const vector of value.files) {
      expect(vector).toHaveProperty('url');
      expect(vector).toHaveProperty('format');
      expect(vector).toHaveProperty('variationLabel');
      expect(vector).toHaveProperty('provider');
      expect(typeof vector.url).toBe('string');
      expect(typeof vector.format).toBe('string');
      expect(vector.variationLabel).not.toBeNull();
      expect(typeof vector.provider).toBe('string');
      ++count;
    }

    expect(count).toBe(value.files.length);

    const result = makeSpecifyVectorsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked vectors value with partial', () => {
    const override: SpecifyVectorsValue = {
      files: [
        {
          url: 'https://specifyapp.com',
          format: 'svg',
          variationLabel: 'default',
          provider: 'Specify',
        },
        {
          url: 'https://specifyapp.com',
          format: 'pdf',
          variationLabel: 'default',
          provider: 'Specify',
        },
      ],
    };

    const value = getMockedVectorsValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyVectorsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
