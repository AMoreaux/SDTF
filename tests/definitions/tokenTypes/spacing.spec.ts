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
  specifySpacingTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

import {
  makeSpecifySpacingValueSchema,
  specifySpacingDefinition,
  SpecifySpacingValue,
  SpecifySpacingValueWithAlias,
} from '../../../src/definitions/tokenTypes/spacing.js';

describe.concurrent('spacing', () => {
  describe.concurrent('makeSpecifySpacingValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a spacing value', () => {
      const input = {
        value: 10,
        unit: 'px',
      };
      const result = makeSpecifySpacingValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifySpacingValue>>;

      const inputWithNullValues = {
        value: 10,
        unit: null,
      };
      const resultWithNullValues =
        makeSpecifySpacingValueSchema(isNotSupportingAliasing).parse(inputWithNullValues);
      expect(resultWithNullValues).toStrictEqual(inputWithNullValues);
    });
    it('Should fail validating a spacing value with extra properties', () => {
      expect(() =>
        makeSpecifySpacingValueSchema(isNotSupportingAliasing).parse({
          value: 10,
          unit: 'px',
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a spacing value with missing properties', () => {
      expect(() => makeSpecifySpacingValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a spacing value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.spacing',
        $mode: 'default',
      };
      const result = makeSpecifySpacingValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifySpacingValueWithAlias>>;
    });
  });
  describe.concurrent('specifySpacingDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifySpacingDefinition.matchTokenTypeAgainstMapping(
          specifySpacingTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifySpacingDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifySpacingDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionUnitTypeName,
          new ValuePath(['unit']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifySpacingDefinition.matchTokenTypeAgainstMapping(
          specifyJSONNumberTypeName,
          new ValuePath(['value']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
