import { describe, it, expect } from 'vitest';

import {
  makeSpecifyFontFeaturesValueSchema,
  SpecifyFontFeaturesValue,
} from '../../../src/definitions/tokenTypes/fontFeatures.js';

import { getMockedFontFeaturesValue } from '../../../src/mocks/tokenTypes/fontFeatures.js';

describe('getMockedFontFeaturesValue', () => {
  it('Should return a mocked font features value', () => {
    const value = getMockedFontFeaturesValue();

    expect(value).toBeInstanceOf(Array);

    const result = makeSpecifyFontFeaturesValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
  it('Should return a mocked font features value with override', () => {
    const override: SpecifyFontFeaturesValue = ['small-caps'];

    const value = getMockedFontFeaturesValue(override);
    expect(value).toStrictEqual(override);

    const result = makeSpecifyFontFeaturesValueSchema(false).parse(value);
    expect(result).toStrictEqual(value);
  });
});
