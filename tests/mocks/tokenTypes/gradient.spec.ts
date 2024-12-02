import { describe, it, expect } from 'vitest';

import {
  makeSpecifyGradientValueSchema,
  SpecifyGradientValue,
} from '../../../src/definitions/tokenTypes/gradient.js';

import { getMockedGradientValue } from '../../../src/mocks/tokenTypes/gradient.js';

describe('getMockedGradientValue', () => {
  it('Should return a mocked gradient value', () => {
    const value = getMockedGradientValue();

    expect(value).toHaveProperty('type');
    expect(value).toHaveProperty('colorStops');

    const result = makeSpecifyGradientValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked gradient value with override', () => {
    const override: SpecifyGradientValue = {
      type: 'linear',
      angle: 0,
      colorStops: [
        {
          color: {
            model: 'rgb',
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1,
          },
          position: 0,
        },
        {
          color: {
            model: 'rgb',
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1,
          },
          position: 1,
        },
      ],
    };

    const value = getMockedGradientValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyGradientValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked gradient value of a given type', () => {
    const gradientType = 'linear';

    const value = getMockedGradientValue(undefined, gradientType);
    expect(value.type).toBe(gradientType);
  });
  it('Should fail returning a mocked gradient value with invalid gradientType', () => {
    const invalidGradientType = 'invalidGradientType';
    expect(() =>
      getMockedGradientValue(
        undefined,
        // @ts-expect-error
        invalidGradientType,
      ),
    ).toThrow(`Unexpected gradient type: "${invalidGradientType}"`);
  });
});
