import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyBorderStyleTypeName,
  specifyBorderTypeName,
  specifyColorTypeName,
  specifyDimensionTypeName,
  specifyRadiusTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyBorderValueSchema,
  specifyBorderDefinition,
  SpecifyBorderValue,
  SpecifyBorderValueWithAlias,
} from '../../../src/definitions/tokenTypes/border.js';

describe.concurrent('border', () => {
  describe.concurrent('makeSpecifyBorderValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a border value', () => {
      const input = {
        width: {
          value: 2,
          unit: 'px',
        },
        style: 'solid',
        color: {
          model: 'hex',
          hex: '#000000',
          alpha: 1,
        },
        rectangleCornerRadii: [
          {
            unit: 'px',
            value: 1,
          },
          {
            unit: 'px',
            value: 1,
          },
          {
            unit: 'px',
            value: 1,
          },
          {
            unit: 'px',
            value: 1,
          },
        ],
      };
      const result = makeSpecifyBorderValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyBorderValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBorderValue>>;
    });
    it('Should validate a border with null rectangleCornerRadii', () => {
      const input = {
        width: {
          value: 2,
          unit: 'px',
        },
        style: 'solid',
        color: {
          model: 'hex',
          hex: '#000000',
          alpha: 1,
        },
        rectangleCornerRadii: null,
      };
      const result = makeSpecifyBorderValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should fail validating a border with extra properties', () => {
      expect(() =>
        makeSpecifyBorderValueSchema(isNotSupportingAliasing).parse({
          width: {
            value: 2,
            unit: 'px',
          },
          style: 'solid',
          color: {
            model: 'hex',
            hex: '#000000',
            alpha: 1,
          },
          rectangleCornerRadii: null,
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a border with missing properties', () => {
      expect(() => makeSpecifyBorderValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a border', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.border',
        $mode: 'default',
      };
      const result = makeSpecifyBorderValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyBorderValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBorderValueWithAlias>>;
    });
    it('Should validate an alias for a border sub keys', () => {
      const input: SpecifyBorderValueWithAlias = {
        width: { $alias: 'some-border.value.width', $mode: 'default' },
        style: { $alias: 'some-border.value.style', $mode: 'default' },
        color: { $alias: 'some-border.value.color', $mode: 'default' },
        rectangleCornerRadii: [
          { $alias: 'some-border.value.rectangleCornerRadii', $mode: 'default' },
          { $alias: 'some-border.value.rectangleCornerRadii', $mode: 'default' },
          { $alias: 'some-border.value.rectangleCornerRadii', $mode: 'default' },
          { $alias: 'some-border.value.rectangleCornerRadii', $mode: 'default' },
        ],
      };
      const result = makeSpecifyBorderValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyBorderDefinition', () => {
    it('Should match token types of root level type', () => {
      expect(
        specifyBorderDefinition.matchTokenTypeAgainstMapping(
          specifyBorderTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyBorderDefinition.matchTokenTypeAgainstMapping(
          specifyColorTypeName,
          new ValuePath(['color']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBorderDefinition.matchTokenTypeAgainstMapping(
          specifyBorderStyleTypeName,
          new ValuePath(['style']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBorderDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath(['width']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBorderDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['rectangleCornerRadii', '0']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBorderDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['rectangleCornerRadii', '1']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBorderDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['rectangleCornerRadii', '2']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBorderDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['rectangleCornerRadii', '3']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
