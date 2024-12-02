import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyDimensionValue,
  SpecifyDimensionValueWithAlias,
} from '../../../src/definitions/tokenTypes/dimension.js';
import {
  specifyBreakpointTypeName,
  specifyDimensionTypeName,
  specifyDimensionUnitTypeName,
  specifyJSONNumberTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyBreakpointValueSchema,
  specifyBreakpointDefinition,
  SpecifyBreakpointValue,
  SpecifyBreakpointValueWithAlias,
} from '../../../src/definitions/tokenTypes/breakpoint.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

describe.concurrent('breakpoint', () => {
  describe.concurrent('makeSpecifyBreakpointValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a breakpoint value', () => {
      const input = {
        value: 100,
        unit: 'px',
      };
      const result = makeSpecifyBreakpointValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBreakpointValue>>;
    });
    it('Should fail validating a breakpoint with extra properties', () => {
      expect(() =>
        makeSpecifyBreakpointValueSchema(isNotSupportingAliasing).parse({
          value: 100,
          unit: 'px',
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a breakpoint with missing properties', () => {
      expect(() => makeSpecifyBreakpointValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a breakpoint', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.breakpoint',
        $mode: 'default',
      };
      const result = makeSpecifyBreakpointValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBreakpointValueWithAlias>>;
    });
  });
  describe.concurrent('specifyBreakpointDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyBreakpointDefinition.matchTokenTypeAgainstMapping(
          specifyBreakpointTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBreakpointDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyBreakpointDefinition.matchTokenTypeAgainstMapping(
          specifyDimensionUnitTypeName,
          new ValuePath(['unit']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBreakpointDefinition.matchTokenTypeAgainstMapping(
          specifyJSONNumberTypeName,
          new ValuePath(['value']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
