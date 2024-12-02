import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyPositiveNumberValue } from '../../../src/definitions/tokenTypes/_numbers.js';
import { SpecifyDurationUnitValue } from '../../../src/definitions/tokenTypes/durationUnit.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyDurationTypeName,
  specifyDurationUnitTypeName,
  specifyPositiveNumberTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyDurationValueSchema,
  specifyDurationDefinition,
  SpecifyDurationValue,
  SpecifyDurationValueWithAlias,
} from '../../../src/definitions/tokenTypes/duration.js';

describe.concurrent('duration', () => {
  describe.concurrent('makeSpecifyDurationValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a duration value', () => {
      const input = {
        value: 10,
        unit: 'ms',
      };
      const result = makeSpecifyDurationValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          {
            value: SpecifyPositiveNumberValue;
            unit: SpecifyDurationUnitValue;
          }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyDurationValue>>;
    });
    it('Should fail validating a negative value for specify duration', () => {
      expect(() =>
        makeSpecifyDurationValueSchema(isNotSupportingAliasing).parse({
          value: -10,
          unit: 'ms',
        }),
      ).toThrow();
    });
    it('Should fail validating a null unit for specify duration value', () => {
      expect(() =>
        makeSpecifyDurationValueSchema(isNotSupportingAliasing).parse({
          value: 10,
          unit: null,
        }),
      ).toThrow();
    });
    it('Should fail validating a duration with extra properties', () => {
      expect(() =>
        makeSpecifyDurationValueSchema(isNotSupportingAliasing).parse({
          value: 10,
          unit: 'ms',
          extra: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a duration with missing properties', () => {
      expect(() =>
        makeSpecifyDurationValueSchema(isNotSupportingAliasing).parse({
          value: 10,
        }),
      ).toThrow();
    });
    it('Should validate an alias for a duration value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.duration',
        $mode: 'default',
      };
      const result = makeSpecifyDurationValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDurationValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyDurationValueWithAlias>>;
    });
    it('Should validate an alias for a duration value sub keys', () => {
      const input: SpecifyDurationValueWithAlias = {
        value: { $alias: 'duration.alias.value', $mode: 'default' },
        unit: { $alias: 'duration.alias.unit', $mode: 'default' },
      };
      expect(makeSpecifyDurationValueSchema(isSupportingAliasing).parse(input)).toStrictEqual(
        input,
      );
    });
  });
  describe.concurrent('specifyDurationDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyDurationDefinition.matchTokenTypeAgainstMapping(
          specifyDurationTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyDurationDefinition.matchTokenTypeAgainstMapping(
          specifyPositiveNumberTypeName,
          new ValuePath(['value']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyDurationDefinition.matchTokenTypeAgainstMapping(
          specifyDurationUnitTypeName,
          new ValuePath(['unit']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
