import { describe, it, expect } from 'vitest';

import { makeSpecifyFontStyleValueSchema } from '../../../src/definitions/tokenTypes/fontStyle.js';

import { getMockedFontStyleValue } from '../../../src/mocks/tokenTypes/fontStyle.js';

describe('getMockedFontStyleValue', () => {
  it('Should return a mocked font style value', () => {
    const value = getMockedFontStyleValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyFontStyleValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked font style value with override', () => {
    const override = 'italic';

    const value = getMockedFontStyleValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyFontStyleValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
