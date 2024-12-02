import { describe, it, expect } from 'vitest';

import {
  makeSpecifyShadowValueSchema,
  SpecifyShadowValue,
} from '../../../src/definitions/tokenTypes/shadow.js';

import { getMockedShadowValue } from '../../../src/mocks/tokenTypes/shadow.js';

describe('getMockedShadowValue', () => {
  it('Should return a mocked shadow value', () => {
    const value = getMockedShadowValue();

    expect(typeof value).toBe('object');

    const result = makeSpecifyShadowValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked shadow value with partial', () => {
    const partial: SpecifyShadowValue = {
      offsetX: {
        unit: 'px',
        value: 32,
      },
      offsetY: {
        unit: 'px',
        value: 32,
      },
      blurRadius: {
        unit: 'px',
        value: 32,
      },
      spreadRadius: {
        unit: 'px',
        value: 32,
      },
      color: {
        model: 'rgb',
        alpha: 1,
        blue: 0,
        green: 0,
        red: 0,
      },
      type: 'inner',
    };

    const value = getMockedShadowValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifyShadowValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
