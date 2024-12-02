import { describe, it, expect } from 'vitest';
import { getMockedGradientsValue } from '../../../src/mocks/tokenTypes/gradients.js';
import {
  makeSpecifyGradientsValueSchema,
  SpecifyGradientsValue,
} from '../../../src/definitions/tokenTypes/gradients.js';

describe('getMockedGradientsValue', () => {
  it('Should return a mocked gradients value', () => {
    const value = getMockedGradientsValue();

    expect(value.length).toBeGreaterThanOrEqual(1);
    expect(value.length).toBeLessThanOrEqual(3);

    const result = makeSpecifyGradientsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked gradients value with override', () => {
    const override: SpecifyGradientsValue = [
      {
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
      },
    ];

    const value = getMockedGradientsValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyGradientsValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
