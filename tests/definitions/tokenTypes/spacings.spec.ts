import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  specifySpacingsTypeName,
  specifySpacingTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

import {
  makeSpecifySpacingsValueSchema,
  specifySpacingsDefinition,
  SpecifySpacingsValue,
  SpecifySpacingsValueWithAlias,
} from '../../../src/definitions/tokenTypes/spacings.js';

describe.concurrent('spacing', () => {
  describe.concurrent('makeSpecifySpacingsValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;
    it('Should validate a spacings of 1 value', () => {
      const input = [{ unit: 'px', value: 10 }];
      const result = makeSpecifySpacingsValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifySpacingsValue>>;
    });
    it('Should validate a spacings of 2 values', () => {
      const input = [
        { unit: 'px', value: 10 },
        { unit: 'px', value: 20 },
      ];
      const result = makeSpecifySpacingsValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifySpacingsValue>>;
    });
    it('Should validate a spacings of 3 values', () => {
      const input = [
        { unit: 'px', value: 10 },
        { unit: 'px', value: 20 },
        { unit: 'px', value: 30 },
      ];
      const result = makeSpecifySpacingsValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should validate a spacings of 4 values', () => {
      const input = [
        { unit: 'px', value: 10 },
        { unit: 'px', value: 20 },
        { unit: 'px', value: 30 },
        { unit: 'px', value: 40 },
      ];
      const result = makeSpecifySpacingsValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should fail validating a spacings value with an undefined value', () => {
      expect(() => makeSpecifySpacingsValueSchema(isNotSupportingAliasing).parse(undefined))
        .toThrow(`[
  {
    "code": "invalid_type",
    "expected": "array",
    "received": "undefined",
    "path": [],
    "message": "Specify spacings must be an array containing 1 to 4 spacing value(s)"
  }
]`);
    });
    it('Should fail validating a spacings value with an empty value', () => {
      expect(() => makeSpecifySpacingsValueSchema(isNotSupportingAliasing).parse([])).toThrow(`[
  {
    "code": "too_small",
    "minimum": 1,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Specify spacings must have at least 1 spacing value(s)",
    "path": []
  }
]`);
    });
    it('Should fail validating a spacings value with 5 values (or above)', () => {
      expect(() =>
        makeSpecifySpacingsValueSchema(isNotSupportingAliasing).parse([
          { unit: 'px', value: 10 },
          { unit: 'px', value: 20 },
          { unit: 'px', value: 30 },
          { unit: 'px', value: 40 },
          { unit: 'px', value: 50 },
        ]),
      ).toThrow(`[
  {
    "code": "too_big",
    "maximum": 4,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Specify spacings must have at most 4 spacing values",
    "path": []
  }
]`);
    });
    it('Should validate an alias for a spacings value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.spacings',
        $mode: 'default',
      };
      const result = makeSpecifySpacingsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifySpacingsValueWithAlias>>;
    });
    it('Should validate an alias for a spacings value for 1 sub value', () => {
      const input: SpecifySpacingsValueWithAlias = [{ $alias: 'some.spacing', $mode: 'default' }];
      const result = makeSpecifySpacingsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should validate an alias for a spacings value for 2 sub values', () => {
      const input: SpecifySpacingsValueWithAlias = [
        { $alias: 'some.spacing', $mode: 'default' },
        { $alias: 'some.other-spacing', $mode: 'default' },
      ];
      const result = makeSpecifySpacingsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should validate an alias for a spacings value for 3 sub values', () => {
      const input: SpecifySpacingsValueWithAlias = [
        { $alias: 'some.spacing', $mode: 'default' },
        { $alias: 'some.second-spacing', $mode: 'default' },
        { $alias: 'some.third-spacing', $mode: 'default' },
      ];
      const result = makeSpecifySpacingsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should validate an alias for a spacings value for 4 sub values', () => {
      const input: SpecifySpacingsValueWithAlias = [
        { $alias: 'some.spacing', $mode: 'default' },
        { $alias: 'some.second-spacing', $mode: 'default' },
        { $alias: 'some.third-spacing', $mode: 'default' },
        { $alias: 'some.fourth-spacing', $mode: 'default' },
      ];
      const result = makeSpecifySpacingsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifySpacingsDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifySpacingsDefinition.matchTokenTypeAgainstMapping(
          specifySpacingsTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({
        success: true,
      });
    });
    it('Should match token types of nested level types', () => {
      expect(
        specifySpacingsDefinition.matchTokenTypeAgainstMapping(
          specifySpacingTypeName,
          new ValuePath(['0']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifySpacingsDefinition.matchTokenTypeAgainstMapping(
          specifySpacingTypeName,
          new ValuePath(['1']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifySpacingsDefinition.matchTokenTypeAgainstMapping(
          specifySpacingTypeName,
          new ValuePath(['2']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifySpacingsDefinition.matchTokenTypeAgainstMapping(
          specifySpacingTypeName,
          new ValuePath(['3']),
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifySpacingsDefinition.matchTokenTypeAgainstMapping(
          specifySpacingTypeName,
          new ValuePath(['4']),
        ),
      ).toStrictEqual({ success: false, expectedType: '' });
    });
  });
});
