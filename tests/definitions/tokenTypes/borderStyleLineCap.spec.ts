import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyBorderStyleLineCapValueSchema,
  SpecifyBorderStyleLineCapValue,
  SpecifyBorderStyleLineCapValueWithAlias,
} from '../../../src/definitions/tokenTypes/borderStyleLineCap.js';

describe.concurrent('borderStyleLineCap', () => {
  describe.concurrent('makeSpecifyBorderStyleLineCapValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;
    it('Should validate a border style line cap', () => {
      const input = 'butt';
      const result = makeSpecifyBorderStyleLineCapValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);

      type Result = Expect<Equal<typeof result, 'butt' | 'round' | 'square'>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBorderStyleLineCapValue>>;

      expect(makeSpecifyBorderStyleLineCapValueSchema(isNotSupportingAliasing).parse('round')).toBe(
        'round',
      );
      expect(
        makeSpecifyBorderStyleLineCapValueSchema(isNotSupportingAliasing).parse('square'),
      ).toBe('square');
    });
    it('Should fail validating a string', () => {
      expect(() =>
        makeSpecifyBorderStyleLineCapValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a border style line cap', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.border-style-line-cap',
        $mode: 'default',
      };
      const result = makeSpecifyBorderStyleLineCapValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);

      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<'butt' | 'round' | 'square'>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyBorderStyleLineCapValueWithAlias>>;
    });
  });
});
