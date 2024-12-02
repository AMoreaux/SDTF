import { describe, it, expect } from 'vitest';

import { makeSpecifyTextTransformValueSchema } from '../../../src/definitions/tokenTypes/textTransform.js';

import { getMockedTextTransformValue } from '../../../src/mocks/tokenTypes/textTransform.js';

describe('getMockedTextTransformValue', () => {
  it('Should return a mocked text-transform value', () => {
    const value = getMockedTextTransformValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyTextTransformValueSchema(false).parse(value);
    expect(result).toBe(value);
  });
  it('Should return a mocked text-transform value with override', () => {
    const override = 'uppercase';
    const value = getMockedTextTransformValue(override);

    expect(value).toBe(override);
  });
});
