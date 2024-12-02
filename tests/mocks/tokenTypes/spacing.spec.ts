import { describe, it, expect } from 'vitest';

import {
  makeSpecifySpacingValueSchema,
  SpecifySpacingValue,
} from '../../../src/definitions/tokenTypes/spacing.js';

import { getMockedSpacingValue } from '../../../src/mocks/tokenTypes/spacing.js';

describe('getMockedSpacingValue', () => {
  it('Should return a mocked spacing value', () => {
    const value = getMockedSpacingValue();

    expect(typeof value).toBe('object');

    const result = makeSpecifySpacingValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked spacing value with partial', () => {
    const partial: SpecifySpacingValue = {
      unit: 'px',
      value: 32,
    };

    const value = getMockedSpacingValue(partial);
    expect(value).toStrictEqual(partial);

    const result = makeSpecifySpacingValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
