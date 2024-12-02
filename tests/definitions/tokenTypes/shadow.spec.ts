import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyColorValue } from '../../../src/definitions/tokenTypes/color.js';
import { SpecifyDimensionValue } from '../../../src/definitions/tokenTypes/dimension.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import { SpecifyShadowTypeValue } from '../../../src/definitions/tokenTypes/shadowType.js';
import {
  specifyBlurTypeName,
  specifyColorTypeName,
  specifyDimensionTypeName,
  specifyRadiusTypeName,
  specifyRGBColorNumberTypeName,
  specifyShadowTypeName,
  specifyShadowTypeTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyShadowValueSchema,
  specifyShadowDefinition,
  SpecifyShadowValue,
  SpecifyShadowValueWithAlias,
} from '../../../src/definitions/tokenTypes/shadow.js';

describe.concurrent('shadow', () => {
  describe.concurrent('makeSpecifyShadowValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a shadow value', () => {
      const input = {
        color: {
          model: 'hex',
          hex: '#000000',
          alpha: 1,
        },
        offsetX: {
          value: 0,
          unit: null,
        },
        offsetY: {
          value: 2,
          unit: 'px',
        },
        blurRadius: {
          value: 8,
          unit: 'px',
        },
        spreadRadius: {
          value: 6,
          unit: 'px',
        },
        type: 'outer',
      };
      const result = makeSpecifyShadowValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          {
            color: SpecifyColorValue;
            offsetX: SpecifyDimensionValue;
            offsetY: SpecifyDimensionValue;
            blurRadius: SpecifyDimensionValue;
            spreadRadius: SpecifyDimensionValue;
            type: SpecifyShadowTypeValue;
          }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyShadowValue>>;
    });
    it('Should validate all values of shadowType', () => {
      const input = {
        color: {
          model: 'hex',
          hex: '#000000',
          alpha: 1,
        },
        offsetX: {
          value: 0,
          unit: null,
        },
        offsetY: {
          value: 2,
          unit: 'px',
        },
        blurRadius: {
          value: 8,
          unit: 'px',
        },
        spreadRadius: {
          value: 6,
          unit: 'px',
        },
      };

      expect(
        makeSpecifyShadowValueSchema(isNotSupportingAliasing).parse({
          ...input,
          type: 'outer',
        }),
      ).toStrictEqual({
        ...input,
        type: 'outer',
      });
      expect(
        makeSpecifyShadowValueSchema(isNotSupportingAliasing).parse({
          ...input,
          type: 'inner',
        }),
      ).toStrictEqual({
        ...input,
        type: 'inner',
      });
    });
    it('Should fail validating a shadow value with extra properties', () => {
      expect(() =>
        makeSpecifyShadowValueSchema(isNotSupportingAliasing).parse({
          color: {
            model: 'hex',
            hex: '#000000',
            alpha: 1,
          },
          offsetX: {
            value: 0,
            unit: null,
          },
          offsetY: {
            value: 2,
            unit: 'px',
          },
          blurRadius: {
            value: 8,
            unit: 'px',
          },
          spreadRadius: {
            value: 6,
            unit: 'px',
          },
          type: 'outer',
          extra: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a shadow value with missing properties', () => {
      expect(() => makeSpecifyShadowValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a shadow value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.shadow',
        $mode: 'default',
      };
      const result = makeSpecifyShadowValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyShadowValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyShadowValueWithAlias>>;
    });
    it('Should validate a shadow value sub keys', () => {
      const input: SpecifyShadowValueWithAlias = {
        color: { $alias: 'color.alias', $mode: 'default' },
        offsetX: { $alias: 'shadow.offsetX.alias', $mode: 'default' },
        offsetY: { $alias: 'shadow.offsetY.alias', $mode: 'default' },
        blurRadius: { $alias: 'shadow.blurRadius.alias', $mode: 'default' },
        spreadRadius: { $alias: 'shadow.spreadRadius.alias', $mode: 'default' },
        type: { $alias: 'shadow.type.alias', $mode: 'default' },
      };
      const result = makeSpecifyShadowValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyShadowDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyShadowTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyColorTypeName,
          new ValuePath(['color']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['offsetX']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['offsetY']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyBlurTypeName,
          new ValuePath(['blurRadius']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['blurRadius']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['blurRadius']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyBlurTypeName,
          new ValuePath(['spreadRadius']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['spreadRadius']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['spreadRadius']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyShadowTypeTypeName,
          new ValuePath(['type']),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match a color sub-key token type in a shadow token type', () => {
      expect(
        specifyShadowDefinition.matchTokenTypeAgainstMapping(
          specifyRGBColorNumberTypeName,
          new ValuePath(['color', 'red']),
          () => 'rgb',
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
