import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyHexadecimalColorStringValue } from '../../../src/definitions/tokenTypes/_strings.js';
import {
  SpecifyArcDegreeNumberValue,
  SpecifyPercentageNumberValue,
  SpecifyPositiveNumberValue,
  SpecifyRGBColorNumberValue,
  SpecifyZeroToOneNumberValue,
} from '../../../src/definitions/tokenTypes/_numbers.js';
import { SpecifyJSONNumberValue } from '../../../src/definitions/tokenTypes/_JSON.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyArcDegreeNumberTypeName,
  specifyColorTypeName,
  specifyHexadecimalColorStringTypeName,
  specifyJSONNumberTypeName,
  specifyOpacityTypeName,
  specifyPercentageNumberTypeName,
  specifyPositiveNumberTypeName,
  specifyRGBColorNumberTypeName,
  specifyZeroToOneNumberTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyColorValueSchema,
  specifyColorDefinition,
  SpecifyColorValue,
  SpecifyColorValueWithAlias,
} from '../../../src/definitions/tokenTypes/color.js';

describe.concurrent('color', () => {
  describe.concurrent('makeSpecifyColorValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a color value', () => {
      const hexColorInput = {
        model: 'hex',
        hex: '#ff0000',
        alpha: 1,
      };
      const result = makeSpecifyColorValueSchema(isNotSupportingAliasing).parse(hexColorInput);
      expect(result).toStrictEqual(hexColorInput);
      type Result = Expect<
        Equal<
          typeof result,
          | {
              model: 'hex';
              hex: SpecifyHexadecimalColorStringValue;
              alpha: SpecifyZeroToOneNumberValue;
            }
          | {
              model: 'rgb';
              red: SpecifyRGBColorNumberValue;
              green: SpecifyRGBColorNumberValue;
              blue: SpecifyRGBColorNumberValue;
              alpha: SpecifyZeroToOneNumberValue;
            }
          | {
              model: 'hsl';
              hue: SpecifyArcDegreeNumberValue;
              saturation: SpecifyPercentageNumberValue;
              lightness: SpecifyPercentageNumberValue;
              alpha: SpecifyZeroToOneNumberValue;
            }
          | {
              model: 'hsb';
              hue: SpecifyArcDegreeNumberValue;
              saturation: SpecifyPercentageNumberValue;
              brightness: SpecifyPercentageNumberValue;
              alpha: SpecifyZeroToOneNumberValue;
            }
          | {
              model: 'lch';
              lightness: SpecifyPercentageNumberValue;
              chroma: SpecifyPositiveNumberValue;
              hue: SpecifyArcDegreeNumberValue;
              alpha: SpecifyZeroToOneNumberValue;
            }
          | {
              model: 'lab';
              lightness: SpecifyPercentageNumberValue;
              aAxis: SpecifyJSONNumberValue;
              bAxis: SpecifyJSONNumberValue;
              alpha: SpecifyZeroToOneNumberValue;
            }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyColorValue>>;

      const rgbColorInput = {
        model: 'rgb',
        red: 255,
        green: 0,
        blue: 0,
        alpha: 1,
      };
      const rgbResult = makeSpecifyColorValueSchema(isNotSupportingAliasing).parse(rgbColorInput);
      expect(rgbResult).toStrictEqual(rgbColorInput);

      const hslColorInput = {
        model: 'hsl',
        hue: 0,
        saturation: 100,
        lightness: 50,
        alpha: 1,
      };
      const hslResult = makeSpecifyColorValueSchema(isNotSupportingAliasing).parse(hslColorInput);
      expect(hslResult).toStrictEqual(hslColorInput);

      const hsbColorInput = {
        model: 'hsb',
        hue: 333,
        saturation: 100,
        brightness: 100,
        alpha: 1,
      };
      const hsbResult = makeSpecifyColorValueSchema(isNotSupportingAliasing).parse(hsbColorInput);
      expect(hsbResult).toStrictEqual(hsbColorInput);

      const lchColorInput = {
        model: 'lch',
        lightness: 50,
        chroma: 82,
        hue: 0,
        alpha: 1,
      };
      const lchResult = makeSpecifyColorValueSchema(isNotSupportingAliasing).parse(lchColorInput);
      expect(lchResult).toStrictEqual(lchColorInput);

      const labColorInput = {
        model: 'lab',
        lightness: 50,
        aAxis: 0,
        bAxis: 0,
        alpha: 1,
      };
      const labResult = makeSpecifyColorValueSchema(isNotSupportingAliasing).parse(labColorInput);
      expect(labResult).toStrictEqual(labColorInput);
    });
    it('Should fail validating a color with extra properties', () => {
      expect(() =>
        makeSpecifyColorValueSchema(isNotSupportingAliasing).parse({
          model: 'hex',
          hex: '#ff0000',
          alpha: 1,
          extraProperty: 'extra',
        }),
      ).toThrow();

      expect(() =>
        makeSpecifyColorValueSchema(isNotSupportingAliasing).parse({
          model: 'rgb',
          red: 255,
          green: 0,
          blue: 0,
          alpha: 1,
          extraProperty: 'extra',
        }),
      ).toThrow();

      expect(() =>
        makeSpecifyColorValueSchema(isNotSupportingAliasing).parse({
          model: 'hsl',
          hue: 0,
          saturation: 100,
          lightness: 50,
          alpha: 1,
          extraProperty: 'extra',
        }),
      ).toThrow();

      expect(() =>
        makeSpecifyColorValueSchema(isNotSupportingAliasing).parse({
          model: 'hsb',
          hue: 0,
          saturation: 100,
          brightness: 50,
          alpha: 1,
          extraProperty: 'extra',
        }),
      ).toThrow();

      expect(() =>
        makeSpecifyColorValueSchema(isNotSupportingAliasing).parse({
          model: 'lch',
          lightness: 50,
          chroma: 82,
          hue: 0,
          alpha: 1,
          extraProperty: 'extra',
        }),
      ).toThrow();

      expect(() =>
        makeSpecifyColorValueSchema(isNotSupportingAliasing).parse({
          model: 'lab',
          lightness: 50,
          aAxis: 0,
          bAxis: 0,
          alpha: 1,
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a color with missing properties', () => {
      expect(() => makeSpecifyColorValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a color value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.color',
        $mode: 'default',
      };
      const result = makeSpecifyColorValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);

      type Result = Expect<Equal<typeof result, SpecifyColorValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyColorValueWithAlias>>;
    });
    it('Should validate an alias for a color value sub keys', () => {
      const inputForHex: SpecifyColorValueWithAlias = {
        model: 'hex',
        hex: { $alias: 'color.alias.hex', $mode: 'default' },
        alpha: { $alias: 'color.alias.alpha', $mode: 'default' },
      };
      expect(makeSpecifyColorValueSchema(isSupportingAliasing).parse(inputForHex)).toStrictEqual(
        inputForHex,
      );

      const inputForRgb: SpecifyColorValueWithAlias = {
        model: 'rgb',
        red: { $alias: 'color.alias.red', $mode: 'default' },
        green: { $alias: 'color.alias.green', $mode: 'default' },
        blue: { $alias: 'color.alias.blue', $mode: 'default' },
        alpha: { $alias: 'color.alias.alpha', $mode: 'default' },
      };
      expect(makeSpecifyColorValueSchema(isSupportingAliasing).parse(inputForRgb)).toStrictEqual(
        inputForRgb,
      );

      const inputForHsl: SpecifyColorValueWithAlias = {
        model: 'hsl',
        hue: { $alias: 'color.alias.hue', $mode: 'default' },
        saturation: { $alias: 'color.alias.saturation', $mode: 'default' },
        lightness: { $alias: 'color.alias.lightness', $mode: 'default' },
        alpha: { $alias: 'color.alias.alpha', $mode: 'default' },
      };
      expect(makeSpecifyColorValueSchema(isSupportingAliasing).parse(inputForHsl)).toStrictEqual(
        inputForHsl,
      );

      const inputForHsb: SpecifyColorValueWithAlias = {
        model: 'hsb',
        hue: { $alias: 'color.alias.hue', $mode: 'default' },
        saturation: { $alias: 'color.alias.saturation', $mode: 'default' },
        brightness: { $alias: 'color.alias.brightness', $mode: 'default' },
        alpha: { $alias: 'color.alias.alpha', $mode: 'default' },
      };
      expect(makeSpecifyColorValueSchema(isSupportingAliasing).parse(inputForHsb)).toStrictEqual(
        inputForHsb,
      );

      const inputForLch: SpecifyColorValueWithAlias = {
        model: 'lch',
        lightness: { $alias: 'color.alias.lightness', $mode: 'default' },
        chroma: { $alias: 'color.alias.chroma', $mode: 'default' },
        hue: { $alias: 'color.alias.hue', $mode: 'default' },
        alpha: { $alias: 'color.alias.alpha', $mode: 'default' },
      };
      expect(makeSpecifyColorValueSchema(isSupportingAliasing).parse(inputForLch)).toStrictEqual(
        inputForLch,
      );

      const inputForLab: SpecifyColorValueWithAlias = {
        model: 'lab',
        lightness: { $alias: 'color.alias.lightness', $mode: 'default' },
        aAxis: { $alias: 'color.alias.aAxis', $mode: 'default' },
        bAxis: { $alias: 'color.alias.bAxis', $mode: 'default' },
        alpha: { $alias: 'color.alias.alpha', $mode: 'default' },
      };
      expect(makeSpecifyColorValueSchema(isSupportingAliasing).parse(inputForLab)).toStrictEqual(
        inputForLab,
      );
    });
  });
  describe.concurrent('specifyColorDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyColorTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({
        success: true,
      });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          'hex',
          new ValuePath(['model']),
          () => 'hex',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyHexadecimalColorStringTypeName,
          new ValuePath(['hex']),
          () => 'hex',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath(['alpha']),
          () => 'hex',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyOpacityTypeName,
          new ValuePath(['alpha']),
          () => 'hex',
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          'rgb',
          new ValuePath(['model']),
          () => 'rgb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyRGBColorNumberTypeName,
          new ValuePath(['red']),
          () => 'rgb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyRGBColorNumberTypeName,
          new ValuePath(['green']),
          () => 'rgb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyRGBColorNumberTypeName,
          new ValuePath(['blue']),
          () => 'rgb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath(['alpha']),
          () => 'rgb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyOpacityTypeName,
          new ValuePath(['alpha']),
          () => 'rgb',
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          'hsl',
          new ValuePath(['model']),
          () => 'hsl',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyArcDegreeNumberTypeName,
          new ValuePath(['hue']),
          () => 'hsl',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyPercentageNumberTypeName,
          new ValuePath(['saturation']),
          () => 'hsl',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyPercentageNumberTypeName,
          new ValuePath(['lightness']),
          () => 'hsl',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath(['alpha']),
          () => 'hsl',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyOpacityTypeName,
          new ValuePath(['alpha']),
          () => 'hsl',
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          'hsb',
          new ValuePath(['model']),
          () => 'hsb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyArcDegreeNumberTypeName,
          new ValuePath(['hue']),
          () => 'hsb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyPercentageNumberTypeName,
          new ValuePath(['saturation']),
          () => 'hsb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyPercentageNumberTypeName,
          new ValuePath(['brightness']),
          () => 'hsb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath(['alpha']),
          () => 'hsb',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyOpacityTypeName,
          new ValuePath(['alpha']),
          () => 'hsb',
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          'lch',
          new ValuePath(['model']),
          () => 'lch',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyPercentageNumberTypeName,
          new ValuePath(['lightness']),
          () => 'lch',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyPositiveNumberTypeName,
          new ValuePath(['chroma']),
          () => 'lch',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyArcDegreeNumberTypeName,
          new ValuePath(['hue']),
          () => 'lch',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath(['alpha']),
          () => 'lch',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyOpacityTypeName,
          new ValuePath(['alpha']),
          () => 'lch',
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          'lab',
          new ValuePath(['model']),
          () => 'lab',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyPercentageNumberTypeName,
          new ValuePath(['lightness']),
          () => 'lab',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyJSONNumberTypeName,
          new ValuePath(['aAxis']),
          () => 'lab',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyJSONNumberTypeName,
          new ValuePath(['bAxis']),
          () => 'lab',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath(['alpha']),
          () => 'lab',
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyColorDefinition.matchTokenTypeAgainstMapping(
          specifyOpacityTypeName,
          new ValuePath(['alpha']),
          () => 'lab',
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
