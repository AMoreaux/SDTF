import { describe, it, expect } from 'vitest';

import { makeSpecifyBorderValueSchema } from '../../../src/definitions/tokenTypes/border.js';

import { getMockedBorderValue } from '../../../src/mocks/tokenTypes/border.js';

describe.concurrent('getMockedBorderValue', () => {
  it('Should return a mocked border value with nulls', () => {
    const value = getMockedBorderValue();

    expect(value).toHaveProperty('color');
    expect(value).toHaveProperty('style');
    expect(value).toHaveProperty('width');
    expect(value).toHaveProperty('rectangleCornerRadii');

    expect(value.rectangleCornerRadii).toBeNull();

    const result = makeSpecifyBorderValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked border value without nulls', () => {
    const value = getMockedBorderValue({}, false);

    expect(value.rectangleCornerRadii).not.toBeNull();

    const result = makeSpecifyBorderValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked border value with partial', () => {
    const partial = {
      color: {
        model: 'rgb' as const,
        red: 0,
        green: 0,
        blue: 0,
        alpha: 1,
      },
      style: 'solid' as const,
      width: {
        unit: 'px' as const,
        value: 1,
      },
      rectangleCornerRadii: [
        { unit: 'px' as const, value: 2 },
        { unit: 'px' as const, value: 0 },
        { unit: 'px' as const, value: 2 },
        { unit: 'px' as const, value: 0 },
      ] as any, // encountered since rectangleCornerRadii requires a tuple and not an array which is not definable within a literal object
    };

    const value = getMockedBorderValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifyBorderValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
