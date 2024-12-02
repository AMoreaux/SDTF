import { describe, it, expect } from 'vitest';

import { makeSpecifyOpacityValueSchema } from '../../../src/definitions/tokenTypes/opacity.js';

import { getMockedOpacityValue } from '../../../src/mocks/tokenTypes/opacity.js';

describe('getMockedOpacityValue', () => {
  it('Should return a mocked opacity value', () => {
    const value = getMockedOpacityValue();

    expect(typeof value).toBe('number');

    const result = makeSpecifyOpacityValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked opacity value with override', () => {
    const override = 0.5;

    const value = getMockedOpacityValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyOpacityValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
