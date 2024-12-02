import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyFontValue } from '../../../src/definitions/tokenTypes/font.js';
import { SpecifyDimensionValue } from '../../../src/definitions/tokenTypes/dimension.js';
import { SpecifyFontFeaturesValue } from '../../../src/definitions/tokenTypes/fontFeatures.js';
import { SpecifyColorValue } from '../../../src/definitions/tokenTypes/color.js';
import { SpecifyTextAlignHorizontalValue } from '../../../src/definitions/tokenTypes/textAlignHorizontal.js';
import { SpecifyTextAlignVerticalValue } from '../../../src/definitions/tokenTypes/textAlignVertical.js';
import { SpecifyTextDecorationValue } from '../../../src/definitions/tokenTypes/textDecoration.js';
import { SpecifyTextTransformValue } from '../../../src/definitions/tokenTypes/textTransform.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyColorTypeName,
  specifyDimensionTypeName,
  specifyFontFamilyTypeName,
  specifyFontFeaturesTypeName,
  specifyFontFeatureTypeName,
  specifyFontTypeName,
  specifyRGBColorNumberTypeName,
  specifySpacingTypeName,
  specifyTextAlignHorizontalTypeName,
  specifyTextAlignVerticalTypeName,
  specifyTextDecorationTypeName,
  specifyTextStyleTypeName,
  specifyTextTransformTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyTextStyleValueSchema,
  specifyTextStyleDefinition,
  SpecifyTextStyleValue,
  SpecifyTextStyleValueWithAlias,
} from '../../../src/definitions/tokenTypes/textStyle.js';

describe.concurrent('textStyle', () => {
  describe.concurrent('makeSpecifyTextStyleValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a text style value', () => {
      const input: SpecifyTextStyleValue = {
        font: {
          family: 'Inter',
          postScriptName: 'Inter-Regular',
          style: 'normal',
          weight: 'normal',
          files: [
            {
              format: 'woff2',
              url: 'https://specifyapp.com/fonts/Inter-Regular.woff2',
              provider: 'Specify',
            },
          ],
        },
        fontSize: {
          value: 1,
          unit: 'rem',
        },
        color: {
          model: 'hex',
          hex: '#000000',
          alpha: 1,
        },
        fontFeatures: ['small-caps'],
        lineHeight: {
          value: 1.5,
          unit: null,
        },
        letterSpacing: {
          value: 0,
          unit: null,
        },
        paragraphSpacing: {
          value: 0,
          unit: null,
        },
        textAlignHorizontal: 'left',
        textAlignVertical: 'top',
        textIndent: {
          value: 0,
          unit: null,
        },
        textTransform: 'none',
        textDecoration: 'none',
      };
      const result = makeSpecifyTextStyleValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          {
            font: SpecifyFontValue;
            fontSize: SpecifyDimensionValue;
            fontFeatures: SpecifyFontFeaturesValue | null;
            color: SpecifyColorValue | null;
            lineHeight: SpecifyDimensionValue | null;
            letterSpacing: SpecifyDimensionValue | null;
            paragraphSpacing: SpecifyDimensionValue | null;
            textAlignHorizontal: SpecifyTextAlignHorizontalValue | null;
            textAlignVertical: SpecifyTextAlignVerticalValue | null;
            textDecoration: SpecifyTextDecorationValue | null;
            textIndent: SpecifyDimensionValue | null;
            textTransform: SpecifyTextTransformValue | null;
          }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyTextStyleValue>>;
    });
    it('Should validate a text style value with nullable properties', () => {
      const input: SpecifyTextStyleValue = {
        font: {
          family: 'Inter',
          postScriptName: 'Inter-Regular',
          style: 'normal',
          weight: 'normal',
          files: [
            {
              format: 'woff2',
              url: 'https://specifyapp.com/fonts/Inter-Regular.woff2',
              provider: 'Specify',
            },
          ],
        },
        fontSize: {
          value: 1,
          unit: 'rem',
        },
        color: null,
        fontFeatures: null,
        lineHeight: null,
        letterSpacing: null,
        paragraphSpacing: null,
        textAlignHorizontal: null,
        textAlignVertical: null,
        textIndent: null,
        textTransform: null,
        textDecoration: null,
      };
      const result = makeSpecifyTextStyleValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should fail validating a text style value with extra properties', () => {
      expect(() =>
        makeSpecifyTextStyleValueSchema(isNotSupportingAliasing).parse({
          font: {
            family: 'Inter',
            postScriptName: 'Inter-Regular',
            style: 'normal',
            weight: 'normal',
            files: [
              {
                format: 'woff2',
                url: 'https://specifyapp.com/fonts/Inter-Regular.woff2',
              },
            ],
            provider: 'Specify',
          },
          fontSize: {
            value: 1,
            unit: 'rem',
          },
          color: null,
          fontFeatures: null,
          lineHeight: null,
          letterSpacing: null,
          paragraphSpacing: null,
          textAlignHorizontal: null,
          textAlignVertical: null,
          textIndent: null,
          textTransform: null,
          textDecoration: null,
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a text style value with missing properties', () => {
      expect(() => makeSpecifyTextStyleValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a text style value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.textStyle',
        $mode: 'default',
      };
      const result = makeSpecifyTextStyleValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyTextStyleValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyTextStyleValueWithAlias>>;
    });
    it('Should validate an alias for a text style value sub keys', () => {
      const input: SpecifyTextStyleValueWithAlias = {
        font: { $alias: 'some.textStyle.font', $mode: 'default' },
        fontSize: { $alias: 'some.textStyle.fontSize', $mode: 'default' },
        color: { $alias: 'some.textStyle.color', $mode: 'default' },
        fontFeatures: { $alias: 'some.textStyle.fontFeatures', $mode: 'default' },
        lineHeight: { $alias: 'some.textStyle.lineHeight', $mode: 'default' },
        letterSpacing: { $alias: 'some.textStyle.letterSpacing', $mode: 'default' },
        paragraphSpacing: { $alias: 'some.textStyle.paragraphSpacing', $mode: 'default' },
        textAlignHorizontal: { $alias: 'some.textStyle.textAlignHorizontal', $mode: 'default' },
        textAlignVertical: { $alias: 'some.textStyle.textAlignVertical', $mode: 'default' },
        textIndent: { $alias: 'some.textStyle.textIndent', $mode: 'default' },
        textTransform: { $alias: 'some.textStyle.textTransform', $mode: 'default' },
        textDecoration: { $alias: 'some.textStyle.textDecoration', $mode: 'default' },
      };
      const result = makeSpecifyTextStyleValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyTextStyleDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyTextStyleTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyFontTypeName,
          new ValuePath(['font']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['fontSize']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyColorTypeName,
          new ValuePath(['color']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyFontFeaturesTypeName,
          new ValuePath(['fontFeatures']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyFontFeatureTypeName,
          new ValuePath(['fontFeatures', '0']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['lineHeight']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['letterSpacing']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifySpacingTypeName,
          new ValuePath(['letterSpacing']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['paragraphSpacing']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifySpacingTypeName,
          new ValuePath(['paragraphSpacing']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyTextAlignHorizontalTypeName,
          new ValuePath(['textAlignHorizontal']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyTextAlignVerticalTypeName,
          new ValuePath(['textAlignVertical']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyTextDecorationTypeName,
          new ValuePath(['textDecoration']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['textIndent']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifySpacingTypeName,
          new ValuePath(['textIndent']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyTextTransformTypeName,
          new ValuePath(['textTransform']),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match a color sub-key token type within a text style token type', () => {
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyRGBColorNumberTypeName,
          new ValuePath(['color', 'red']),
          () => 'rgb',
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match a font sub-key token type within a text style token type', () => {
      expect(
        specifyTextStyleDefinition.matchTokenTypeAgainstMapping(
          specifyFontFamilyTypeName,
          new ValuePath(['font', 'family']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
