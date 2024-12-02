import { describe, it, expect } from 'vitest';
import { makeSpecifyFontWeightValueSchema } from '../../../src/definitions/tokenTypes/fontWeight.js';
import { getMockedFontWeightValue } from '../../../src/mocks/tokenTypes/fontWeight.js';

describe('getMockedFontWeightValue', () => {
  it('Should return a mocked font weight value', () => {
    const value = getMockedFontWeightValue();

    const result = makeSpecifyFontWeightValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked font weight value with override', () => {
    const override = 400;

    const value = getMockedFontWeightValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyFontWeightValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
