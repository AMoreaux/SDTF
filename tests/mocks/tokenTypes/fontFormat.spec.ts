import { describe, it, expect } from 'vitest';

import { makeSpecifyFontFormatValueSchema } from '../../../src/definitions/tokenTypes/fontFormat.js';

import { getMockedFontFormatValue } from '../../../src/mocks/tokenTypes/fontFormat.js';

describe('getMockedFontFormatValue', () => {
  it('Should return a mocked font format value', () => {
    const value = getMockedFontFormatValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyFontFormatValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked font format value with override', () => {
    const override = 'woff';

    const value = getMockedFontFormatValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyFontFormatValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
