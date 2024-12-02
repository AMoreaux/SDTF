import { describe, it, expect } from 'vitest';

import { makeSpecifyTextAlignHorizontalValueSchema } from '../../../src/definitions/tokenTypes/textAlignHorizontal.js';

import { getMockedTextAlignHorizontalValue } from '../../../src/mocks/tokenTypes/textAlignHorizontal.js';

describe('getMockedTextAlignHorizontalValue', () => {
  it('Should return a mocked text-align-horizontal value', () => {
    const value = getMockedTextAlignHorizontalValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyTextAlignHorizontalValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
  it('Should return a mocked text-align-horizontal value with override', () => {
    const override = 'center';
    const value = getMockedTextAlignHorizontalValue(override);

    expect(value).toBe(override);
  });
});
