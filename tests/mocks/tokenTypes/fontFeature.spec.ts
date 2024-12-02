import { describe, it, expect } from 'vitest';

import { makeSpecifyFontFeatureValueSchema } from '../../../src/definitions/tokenTypes/fontFeature.js';

import { getMockedFontFeatureValue } from '../../../src/mocks/tokenTypes/fontFeature.js';

describe('getMockedFontFeatureValue', () => {
  it('Should return a mocked font feature value', () => {
    const value = getMockedFontFeatureValue();

    expect(typeof value).toBe('string');

    const result = makeSpecifyFontFeatureValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked font feature value with override', () => {
    const override = 'small-caps';

    const value = getMockedFontFeatureValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyFontFeatureValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
