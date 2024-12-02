import { describe, it, expect } from 'vitest';

import { makeSpecifyTextAlignVerticalValueSchema } from '../../../src/definitions/tokenTypes/textAlignVertical.js';

import { getMockedTextAlignVerticalValue } from '../../../src/mocks/tokenTypes/textAlignVertical.js';

describe('getMockedTextAlignVerticalValue', () => {
  it('Should return a mocked text-align-vertical value', () => {
    const value = getMockedTextAlignVerticalValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyTextAlignVerticalValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
  it('Should return a mocked text-align-vertical value with override', () => {
    const override = 'baseline';
    const value = getMockedTextAlignVerticalValue(override);

    expect(value).toBe(override);
  });
});
