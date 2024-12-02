import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  specifyRadiiTypeName,
  specifyRadiusTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

import {
  makeSpecifyRadiiValueSchema,
  specifyRadiiDefinition,
  SpecifyRadiiValue,
  SpecifyRadiiValueWithAlias,
} from '../../../src/definitions/tokenTypes/radii.js';

describe.concurrent('radii', () => {
  describe.concurrent('makeSpecifyRadiiValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;
    it('Should validate a radii of 1 value', () => {
      const input = [{ unit: 'px', value: 10 }];
      const result = makeSpecifyRadiiValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyRadiiValue>>;
    });
    it('Should validate a radii of 2 values', () => {
      const input = [
        { unit: 'px', value: 10 },
        { unit: 'px', value: 20 },
      ];
      const result = makeSpecifyRadiiValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyRadiiValue>>;
    });
    it('Should validate a radii of 3 values', () => {
      const input = [
        { unit: 'px', value: 10 },
        { unit: 'px', value: 20 },
        { unit: 'px', value: 30 },
      ];
      makeSpecifyRadiiValueSchema(isNotSupportingAliasing).parse(input);
      expect(input).toStrictEqual(input);
    });
    it('Should validate a radii of 4 values', () => {
      const input = [
        { unit: 'px', value: 10 },
        { unit: 'px', value: 20 },
        { unit: 'px', value: 30 },
        { unit: 'px', value: 40 },
      ];
      makeSpecifyRadiiValueSchema(isNotSupportingAliasing).parse(input);
      expect(input).toStrictEqual(input);
    });
    it('Should fail validating a radii value with an undefined value', () => {
      expect(() => makeSpecifyRadiiValueSchema(isNotSupportingAliasing).parse([])).toThrow(`[
  {
    "code": "too_small",
    "minimum": 1,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Specify radii must have at least 1 radius value(s)",
    "path": []
  }
]`);
    });
    it('Should fail validating a radii value with an empty value', () => {
      expect(() => makeSpecifyRadiiValueSchema(isNotSupportingAliasing).parse([])).toThrow(`[
  {
    "code": "too_small",
    "minimum": 1,
    "type": "array",
    "inclusive": true,
    "exact": false,
    "message": "Specify radii must have at least 1 radius value(s)",
    "path": []
  }
]`);
    });
    it('Should fail validating a radii with 5 values (or above)', () => {
      expect(() =>
        makeSpecifyRadiiValueSchema(isNotSupportingAliasing).parse([
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
    "message": "Specify radii must have at most 4 radius values",
    "path": []
  }
]`);
    });
    it('Should validate an alias for a radii value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = { $alias: 'a-radii', $mode: 'default' };
      const result = makeSpecifyRadiiValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyRadiiValueWithAlias>>;
    });
    it('Should validate an alias for a radii value for 2 sub values', () => {
      const input: SpecifyRadiiValueWithAlias = [
        { $alias: 'some.radius', $mode: 'default' },
        { $alias: 'some.other-radius', $mode: 'default' },
      ];
      const result = makeSpecifyRadiiValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should validate an alias for a radii value for 3 sub values', () => {
      const input: SpecifyRadiiValueWithAlias = [
        { $alias: 'some.radius', $mode: 'default' },
        { $alias: 'some.second-radius', $mode: 'default' },
        { $alias: 'some.third-radius', $mode: 'default' },
      ];
      const result = makeSpecifyRadiiValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should validate an alias for a radii value for 4 sub values', () => {
      const input: SpecifyRadiiValueWithAlias = [
        { $alias: 'some.radius', $mode: 'default' },
        { $alias: 'some.second-radius', $mode: 'default' },
        { $alias: 'some.third-radius', $mode: 'default' },
        { $alias: 'some.fourth-radius', $mode: 'default' },
      ];
      const result = makeSpecifyRadiiValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyRadiiDefinition', () => {
    it('Should match a token types of root level types', () => {
      expect(
        specifyRadiiDefinition.matchTokenTypeAgainstMapping(
          specifyRadiiTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of nested level types', () => {
      expect(
        specifyRadiiDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['0']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyRadiiDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['1']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyRadiiDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['2']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyRadiiDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['3']),
        ),
      ).toStrictEqual({ success: true });

      expect(
        specifyRadiiDefinition.matchTokenTypeAgainstMapping(
          specifyRadiusTypeName,
          new ValuePath(['4']),
        ),
      ).toStrictEqual({ success: false, expectedType: '' });
    });
  });
});
