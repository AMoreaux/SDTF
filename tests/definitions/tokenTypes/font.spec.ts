import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import { SpecifyFontFamilyValue } from '../../../src/definitions/tokenTypes/fontFamily.js';
import { SpecifyJSONStringValue } from '../../../src/definitions/tokenTypes/_JSON.js';
import { SpecifyFontWeightValue } from '../../../src/definitions/tokenTypes/fontWeight.js';
import { SpecifyFontStyleValue } from '../../../src/definitions/tokenTypes/fontStyle.js';
import { SpecifyFontFormatValue } from '../../../src/definitions/tokenTypes/fontFormat.js';
import {
  specifyFontFamilyTypeName,
  specifyFontFormatTypeName,
  specifyFontStyleTypeName,
  specifyFontTypeName,
  specifyFontWeightTypeName,
  specifyJSONStringTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyFontValueSchema,
  specifyFontDefinition,
  SpecifyFontProvider,
  specifyFontProviderValues,
  SpecifyFontValue,
  SpecifyFontValueWithAlias,
} from '../../../src/definitions/tokenTypes/font.js';

describe.concurrent('font', () => {
  describe.concurrent('makeSpecifyFontValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a font value', () => {
      const input: SpecifyFontValue = {
        family: 'Inter',
        postScriptName: 'Inter-Regular',
        weight: 'regular',
        style: 'normal',
        files: [
          {
            url: 'https://specifyapp.com/inter.woff',
            format: 'woff',
            provider: 'Specify',
          },
          {
            url: 'https://specifyapp.com/inter.ttf',
            format: 'ttf',
            provider: 'Specify',
          },
        ],
      };
      const result = makeSpecifyFontValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          {
            family: SpecifyFontFamilyValue;
            postScriptName: SpecifyJSONStringValue;
            weight: SpecifyFontWeightValue;
            style: SpecifyFontStyleValue;
            files: Array<{
              url: SpecifyJSONStringValue;
              format: SpecifyFontFormatValue;
              provider: 'external' | 'Specify' | 'Google Fonts' | 'Adobe Fonts';
            }>;
          }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyFontValue>>;
    });
    it('Should validate all font providers', () => {
      const base: Partial<SpecifyFontValue> = {
        family: 'Inter',
        postScriptName: 'Inter-Regular',
        weight: 'regular',
        style: 'normal',
        files: [
          {
            url: 'https://specifyapp.com/inter.otf',
            format: 'otf',
            provider: 'Specify',
          },
        ],
      };

      function makeBase(provider: SpecifyFontProvider) {
        return {
          family: 'Inter',
          postScriptName: 'Inter-Regular',
          weight: 'regular',
          style: 'normal',
          files: [
            {
              url: 'https://specifyapp.com/inter.otf',
              format: 'otf',
              provider,
            },
          ],
        };
      }

      specifyFontProviderValues.forEach(provider => {
        expect(
          makeSpecifyFontValueSchema(isNotSupportingAliasing).parse(makeBase(provider)),
        ).toStrictEqual(makeBase(provider));
      });
    });
    it('Should validate a font with empty files', () => {
      const input = {
        family: 'Inter',
        postScriptName: 'Inter-Regular',
        weight: 'regular',
        style: 'normal',
        files: [],
      };
      const result = makeSpecifyFontValueSchema(isNotSupportingAliasing).parse(input);

      expect(result).toStrictEqual(input);
    });
    it('Should fail validating a font with extra properties', () => {
      expect(() =>
        makeSpecifyFontValueSchema(isNotSupportingAliasing).parse({
          family: 'Inter',
          postScriptName: 'Inter-Regular',
          weight: 'regular',
          style: 'normal',
          files: [
            {
              url: 'https://specifyapp.com/inter.otf',
              format: 'otf',
              provider: 'Specify',
            },
          ],

          extra: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a font files with extra properties', () => {
      expect(() =>
        makeSpecifyFontValueSchema(isNotSupportingAliasing).parse({
          family: 'Inter',
          postScriptName: 'Inter-Regular',
          weight: 'regular',
          style: 'normal',
          files: [
            {
              url: 'https://specifyapp.com/inter.otf',
              format: 'otf',
              extra: 'extra',
            },
          ],
          provider: 'Specify',
        }),
      ).toThrow();
    });
    it('Should fail validating a font with missing properties', () => {
      expect(() => makeSpecifyFontValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a font value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.font',
        $mode: 'default',
      };
      const result = makeSpecifyFontValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyFontValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyFontValueWithAlias>>;
    });
    it('Should validate an alias for a font value sub keys', () => {
      const input: SpecifyFontValueWithAlias = {
        family: { $alias: 'font.alias.family', $mode: 'default' },
        postScriptName: { $alias: 'font.alias.postScriptName', $mode: 'default' },
        weight: { $alias: 'font.alias.weight', $mode: 'default' },
        style: { $alias: 'font.alias.style', $mode: 'default' },
        files: [
          {
            url: { $alias: 'font.alias.url-for-otf', $mode: 'default' },
            format: { $alias: 'font.alias.files.format.otf', $mode: 'default' },
            provider: 'Specify',
          },
        ],
      };
      expect(makeSpecifyFontValueSchema(isSupportingAliasing).parse(input)).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyFontDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyFontDefinition.matchTokenTypeAgainstMapping(specifyFontTypeName, new ValuePath([])),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyFontDefinition.matchTokenTypeAgainstMapping(
          specifyFontFamilyTypeName,
          new ValuePath(['family']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyFontDefinition.matchTokenTypeAgainstMapping(
          specifyJSONStringTypeName,
          new ValuePath(['postScriptName']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyFontDefinition.matchTokenTypeAgainstMapping(
          specifyFontWeightTypeName,
          new ValuePath(['weight']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyFontDefinition.matchTokenTypeAgainstMapping(
          specifyFontStyleTypeName,
          new ValuePath(['style']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyFontDefinition.matchTokenTypeAgainstMapping(
          specifyJSONStringTypeName,
          new ValuePath(['files', '0', 'url']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyFontDefinition.matchTokenTypeAgainstMapping(
          specifyFontFormatTypeName,
          new ValuePath(['files', '0', 'format']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyFontDefinition.matchTokenTypeAgainstMapping(
          specifyFontProviderValues[0],
          new ValuePath(['files', '0', 'provider']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
