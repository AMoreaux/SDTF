import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyJSONNumberValue } from '../../../src/definitions/tokenTypes/_JSON.js';
import { SpecifyDimensionUnitValue } from '../../../src/definitions/tokenTypes/dimensionUnit.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyDimensionTypeName,
  specifyDimensionUnitTypeName,
  specifyJSONNumberTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyDimensionValueSchema,
  specifyDimensionDefinition,
  SpecifyDimensionValue,
  SpecifyDimensionValueWithAlias,
} from '../../../src/definitions/tokenTypes/dimension.js';

describe.concurrent('dimension', () => {
  describe.concurrent('makeSpecifyDimensionValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a dimension value', () => {
      const input = {
        value: 10,
        unit: 'px',
      };
      const result = makeSpecifyDimensionValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          {
            value: SpecifyJSONNumberValue;
            unit: SpecifyDimensionUnitValue;
          }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyDimensionValue>>;

      const inputWithNullUnit = {
        value: 10,
        unit: null,
      };
      expect(
        makeSpecifyDimensionValueSchema(isNotSupportingAliasing).parse(inputWithNullUnit),
      ).toStrictEqual(inputWithNullUnit);

      const inputWithNegativeValue = {
        value: -10,
        unit: 'px',
      };
      expect(
        makeSpecifyDimensionValueSchema(isNotSupportingAliasing).parse(inputWithNegativeValue),
      ).toStrictEqual(inputWithNegativeValue);
    });
    it('Should fail validating a string for specify dimension value', () => {
      expect(() =>
        makeSpecifyDimensionValueSchema(isNotSupportingAliasing).parse('some string'),
      ).toThrow();
    });
    it('Should fail validating a dimension with extra properties', () => {
      expect(() =>
        makeSpecifyDimensionValueSchema(isNotSupportingAliasing).parse({
          value: 10,
          unit: 'px',
          extra: 'extra',
        }),
      ).toThrow();
    });
    it('Should validate an alias for a dimension value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.dimension',
        $mode: 'default',
      };
      const result = makeSpecifyDimensionValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyDimensionValueWithAlias>>;
    });
    it('Should validate an alias for a dimension value sub keys', () => {
      const input: SpecifyDimensionValueWithAlias = {
        value: {
          $alias: 'dimension.alias.value',
          $mode: 'default',
        },
        unit: {
          $alias: 'dimension.alias.unit',
          $mode: 'default',
        },
      };
      expect(makeSpecifyDimensionValueSchema(isSupportingAliasing).parse(input)).toStrictEqual(
        input,
      );
    });
  });
  describe.concurrent('specifyDimensionDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyDimensionDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyDimensionDefinition.matchTokenTypeAgainstMapping(
          specifyJSONNumberTypeName,
          new ValuePath(['value']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyDimensionDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionUnitTypeName,
          new ValuePath(['unit']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
