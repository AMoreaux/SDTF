import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyFontFeatureValueSchema,
  SpecifyFontFeatureValue,
  specifyFontFeatureValues,
  SpecifyFontFeatureValueWithAlias,
} from '../../../src/definitions/tokenTypes/fontFeature.js';

describe.concurrent('fontFeature', () => {
  describe.concurrent('makeSpecifyFontFeatureValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a font feature', () => {
      const input = 'normal';
      const result = makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<
        Equal<
          typeof result,
          | 'normal'
          | 'none'
          | 'small-caps'
          | 'all-small-caps'
          | 'petite-caps'
          | 'all-petite-caps'
          | 'unicase'
          | 'titling-caps'
          | 'common-ligatures'
          | 'no-common-ligatures'
          | 'discretionary-ligatures'
          | 'no-discretionary-ligatures'
          | 'historical-ligatures'
          | 'no-historical-ligatures'
          | 'contextual'
          | 'no-contextual'
          | 'ordinal'
          | 'slashed-zero'
          | 'lining-nums'
          | 'proportional-nums'
          | 'tabular-nums'
          | 'diagonal-fractions'
          | 'stacked-fractions'
          | 'oldstyle-nums'
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyFontFeatureValue>>;

      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('none')).toBe('none');
      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('small-caps')).toBe(
        'small-caps',
      );
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('all-small-caps'),
      ).toBe('all-small-caps');
      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('petite-caps')).toBe(
        'petite-caps',
      );
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('all-petite-caps'),
      ).toBe('all-petite-caps');
      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('unicase')).toBe(
        'unicase',
      );
      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('titling-caps')).toBe(
        'titling-caps',
      );
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('common-ligatures'),
      ).toBe('common-ligatures');
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('no-common-ligatures'),
      ).toBe('no-common-ligatures');
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('discretionary-ligatures'),
      ).toBe('discretionary-ligatures');
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse(
          'no-discretionary-ligatures',
        ),
      ).toBe('no-discretionary-ligatures');
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('historical-ligatures'),
      ).toBe('historical-ligatures');
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('no-historical-ligatures'),
      ).toBe('no-historical-ligatures');
      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('contextual')).toBe(
        'contextual',
      );
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('no-contextual'),
      ).toBe('no-contextual');
      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('ordinal')).toBe(
        'ordinal',
      );
      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('slashed-zero')).toBe(
        'slashed-zero',
      );
      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('lining-nums')).toBe(
        'lining-nums',
      );
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('proportional-nums'),
      ).toBe('proportional-nums');
      expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('tabular-nums')).toBe(
        'tabular-nums',
      );
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('diagonal-fractions'),
      ).toBe('diagonal-fractions');
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('stacked-fractions'),
      ).toBe('stacked-fractions');
      expect(
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('oldstyle-nums'),
      ).toBe('oldstyle-nums');
    });
    it('Should validate all runtime values available in `specifyFontFeatureValues`', ({
      expect,
    }) => {
      specifyFontFeatureValues.forEach(value => {
        expect(makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse(value)).toBe(value);
      });
      expect.assertions(specifyFontFeatureValues.length);
    });
    it('Should fail validating a string for a font feature', () => {
      expect(() =>
        makeSpecifyFontFeatureValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a font feature', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.fontFeature',
        $mode: 'default',
      };
      const result = makeSpecifyFontFeatureValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyFontFeatureValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyFontFeatureValueWithAlias>>;
    });
  });
});
