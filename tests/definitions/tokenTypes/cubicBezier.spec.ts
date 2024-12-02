import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyCubicBezierValueSchema,
  SpecifyCubicBezierValue,
  SpecifyCubicBezierValueWithAlias,
} from '../../../src/definitions/tokenTypes/cubicBezier.js';

describe.concurrent('cubicBezier', () => {
  describe.concurrent('makeSpecifyCubicBezierValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a cubic bezier value', () => {
      const input = [0.4, 100, 0.2, 100];
      const result = makeSpecifyCubicBezierValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, [number, number, number, number]>>;
      type Declaration = Expect<Equal<typeof result, SpecifyCubicBezierValue>>;
    });
    it('Should fail validating out of boundaries values for specify cubic bezier value', () => {
      expect(() =>
        makeSpecifyCubicBezierValueSchema(isNotSupportingAliasing).parse([-1, 0, 0.2, 1]),
      ).toThrow();
      expect(() =>
        makeSpecifyCubicBezierValueSchema(isNotSupportingAliasing).parse([1, 0, -1, 1]),
      ).toThrow();
      expect(() =>
        makeSpecifyCubicBezierValueSchema(isNotSupportingAliasing).parse([1.1, 0, 0.2, 1]),
      ).toThrow();
      expect(() =>
        makeSpecifyCubicBezierValueSchema(isNotSupportingAliasing).parse([1, 0, 1.1, 1]),
      ).toThrow();
      expect(() =>
        makeSpecifyCubicBezierValueSchema(isNotSupportingAliasing).parse([0.4, 0, 0.2, 1, 1]),
      ).toThrow();
      expect(() =>
        makeSpecifyCubicBezierValueSchema(isNotSupportingAliasing).parse([0.4, 0, 0.2, '1']),
      ).toThrow();
      expect(() =>
        makeSpecifyCubicBezierValueSchema(isNotSupportingAliasing).parse('[0.4, 0, 0.2, 1]'),
      ).toThrow();
    });
    it('Should validate an alias for a specify cubic bezier value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.cubicBezier',
        $mode: 'default',
      };
      const result = makeSpecifyCubicBezierValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyCubicBezierValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyCubicBezierValueWithAlias>>;
    });
  });
});
