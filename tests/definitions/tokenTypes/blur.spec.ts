import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyDimensionValue,
  SpecifyDimensionValueWithAlias,
} from '../../../src/definitions/tokenTypes/dimension.js';
import {
  specifyBlurTypeName,
  specifyDimensionTypeName,
  specifyDimensionUnitTypeName,
  specifyJSONNumberTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyBlurValueSchema,
  specifyBlurDefinition,
  SpecifyBlurValue,
  SpecifyBlurValueWithAlias,
} from '../../../src/definitions/tokenTypes/blur.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

describe.concurrent('blur', () => {
  describe.concurrent('makeSpecifyBlurValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a blur value', () => {
      const input = {
        value: 10,
        unit: 'px',
      };
      const result = makeSpecifyBlurValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionValue>>;
      type Declaration = Expect<Equal<SpecifyBlurValue, SpecifyDimensionValue>>;

      const inputWithNullValues = {
        value: 10,
        unit: null,
      };
      const resultWithNullValues =
        makeSpecifyBlurValueSchema(isNotSupportingAliasing).parse(inputWithNullValues);
      expect(resultWithNullValues).toStrictEqual(inputWithNullValues);
    });
    it('Should fail validating a blur with extra properties', () => {
      expect(() =>
        makeSpecifyBlurValueSchema(isNotSupportingAliasing).parse({
          value: 10,
          unit: 'px',
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a blur with missing properties', () => {
      expect(() => makeSpecifyBlurValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a blur', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.blur',
        $mode: 'default',
      };
      const result = makeSpecifyBlurValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBlurValueWithAlias>>;
    });
  });

  describe.concurrent('specifyBlurDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyBlurDefinition.matchTokenTypeAgainstMapping(specifyBlurTypeName, new ValuePath([])),
      ).toStrictEqual({ success: true });
      expect(
        specifyBlurDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyBlurDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionUnitTypeName,
          new ValuePath(['unit']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBlurDefinition.matchTokenTypeAgainstMapping(
          specifyJSONNumberTypeName,
          new ValuePath(['value']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
