import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { ArrayWithAtLeastOneElement } from '../../../src/utils/typeUtils.js';
import {
  SpecifyFontFeatureValue,
  SpecifyFontFeatureValueWithAlias,
} from '../../../src/definitions/tokenTypes/fontFeature.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyFontFeaturesTypeName,
  specifyFontFeatureTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyFontFeaturesValueSchema,
  specifyFontFeaturesDefinition,
  SpecifyFontFeaturesValue,
  SpecifyFontFeaturesValueWithAlias,
} from '../../../src/definitions/tokenTypes/fontFeatures.js';

describe.concurrent('fontFeatures', () => {
  describe.concurrent('makeSpecifyFontFeaturesValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a font features array', () => {
      const input = ['normal'];
      const result = makeSpecifyFontFeaturesValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, ArrayWithAtLeastOneElement<SpecifyFontFeatureValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyFontFeaturesValue>>;

      expect(
        makeSpecifyFontFeaturesValueSchema(isNotSupportingAliasing).parse(['normal', 'small-caps']),
      ).toStrictEqual(['normal', 'small-caps']);
      expect(
        makeSpecifyFontFeaturesValueSchema(isNotSupportingAliasing).parse([
          'normal',
          'small-caps',
          'common-ligatures',
        ]),
      ).toStrictEqual(['normal', 'small-caps', 'common-ligatures']);
    });
    it('Should fail validating a string array for a font features', () => {
      expect(() =>
        makeSpecifyFontFeaturesValueSchema(isNotSupportingAliasing).parse(['a-string']),
      ).toThrow();
    });
    it('Should validate an alias for a font features', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.fontFeatures',
        $mode: 'default',
      };
      const result = makeSpecifyFontFeaturesValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          WithModeAndValueLevelAlias<ArrayWithAtLeastOneElement<SpecifyFontFeatureValueWithAlias>>
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyFontFeaturesValueWithAlias>>;
    });
    it('Should validate an alias for an item of the font features array', () => {
      const input: SpecifyFontFeaturesValueWithAlias = [
        'normal',
        {
          $alias: 'some.fontFeature',
          $mode: 'default',
        },
      ];
      const result = makeSpecifyFontFeaturesValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyFontFeaturesDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyFontFeaturesDefinition.matchTokenTypeAgainstMapping(
          specifyFontFeaturesTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyFontFeaturesDefinition.matchTokenTypeAgainstMapping(
          specifyFontFeatureTypeName,
          new ValuePath(['0']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
