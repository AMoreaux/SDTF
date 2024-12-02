import { describe, it, expect } from 'vitest';

import {
  makeSpecifyShadowsValueSchema,
  SpecifyShadowsValue,
} from '../../../src/definitions/tokenTypes/shadows.js';

import { getMockedShadowsValue } from '../../../src/mocks/tokenTypes/shadows.js';

describe('getMockedShadowsValue', () => {
  it('Should return a mocked shadows value', () => {
    const value = getMockedShadowsValue();

    expect(Array.isArray(value)).toBe(true);
    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value.length).toBeLessThanOrEqual(3);

    const result = makeSpecifyShadowsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked shadows value with override', () => {
    const override: SpecifyShadowsValue = [
      {
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
      },
    ];

    const value = getMockedShadowsValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyShadowsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
