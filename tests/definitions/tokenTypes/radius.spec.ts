import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyDimensionValue,
  SpecifyDimensionValueWithAlias,
} from '../../../src/definitions/tokenTypes/dimension.js';
import {
  specifyDimensionTypeName,
  specifyDimensionUnitTypeName,
  specifyJSONNumberTypeName,
  specifyRadiusTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

import {
  makeSpecifyRadiusValueSchema,
  specifyRadiusDefinition,
  SpecifyRadiusValue,
  SpecifyRadiusValueWithAlias,
} from '../../../src/definitions/tokenTypes/radius.js';

describe.concurrent('radius', () => {
  describe.concurrent('makeSpecifyRadiusValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a radius value', () => {
      const input = {
        value: 10,
        unit: 'px',
      };
      const result = makeSpecifyRadiusValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifyRadiusValue>>;

      const inputWithNullValues = {
        value: 10,
        unit: null,
      };
      const resultWithNullValues =
        makeSpecifyRadiusValueSchema(isNotSupportingAliasing).parse(inputWithNullValues);
      expect(resultWithNullValues).toStrictEqual(inputWithNullValues);
    });
    it('Should fail validating a radius with extra properties', () => {
      expect(() =>
        makeSpecifyRadiusValueSchema(isNotSupportingAliasing).parse({
          value: 10,
          unit: 'px',
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a radius with missing properties', () => {
      expect(() => makeSpecifyRadiusValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a radius value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.radius',
        $mode: 'default',
      };
      const result = makeSpecifyRadiusValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyRadiusValueWithAlias>>;
    });
  });
  describe.concurrent('specifyRadiusDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyRadiusDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyRadiusDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyRadiusDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionUnitTypeName,
          new ValuePath(['unit']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyRadiusDefinition.matchTokenTypeAgainstMapping(
          specifyJSONNumberTypeName,
          new ValuePath(['value']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
