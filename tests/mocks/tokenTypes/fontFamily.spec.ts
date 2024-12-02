import { describe, it, expect } from 'vitest';

import { makeSpecifyFontFamilyValueSchema } from '../../../src/definitions/tokenTypes/fontFamily.js';

import { getMockedFontFamilyValue } from '../../../src/mocks/tokenTypes/fontFamily.js';

describe('getMockedFontFamilyValue', () => {
  it('Should return a mocked font family value', () => {
    const value = getMockedFontFamilyValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyFontFamilyValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked font family value with override', () => {
    const override = 'My super font';

    const value = getMockedFontFamilyValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyFontFamilyValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
