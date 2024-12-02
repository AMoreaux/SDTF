import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyTextDecorationValueSchema,
  SpecifyTextDecorationValue,
  specifyTextDecorationValues,
  SpecifyTextDecorationValueWithAlias,
} from '../../../src/definitions/tokenTypes/textDecoration.js';

describe.concurrent('textDecoration', () => {
  describe.concurrent('makeSpecifyTextDecorationValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a text decoration', () => {
      const input = 'none';
      const result = makeSpecifyTextDecorationValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<
        Equal<typeof result, 'none' | 'underline' | 'overline' | 'line-through' | 'dashed' | 'wavy'>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyTextDecorationValue>>;

      expect(makeSpecifyTextDecorationValueSchema(isNotSupportingAliasing).parse('underline')).toBe(
        'underline',
      );
      expect(makeSpecifyTextDecorationValueSchema(isNotSupportingAliasing).parse('overline')).toBe(
        'overline',
      );
      expect(
        makeSpecifyTextDecorationValueSchema(isNotSupportingAliasing).parse('line-through'),
      ).toBe('line-through');
      expect(makeSpecifyTextDecorationValueSchema(isNotSupportingAliasing).parse('dashed')).toBe(
        'dashed',
      );
      expect(makeSpecifyTextDecorationValueSchema(isNotSupportingAliasing).parse('wavy')).toBe(
        'wavy',
      );
    });
    it('Should validate all runtime values available in `specifyTextDecorationValues`', ({
      expect,
    }) => {
      specifyTextDecorationValues.forEach(value => {
        expect(makeSpecifyTextDecorationValueSchema(isNotSupportingAliasing).parse(value)).toBe(
          value,
        );
      });
      expect.assertions(specifyTextDecorationValues.length);
    });
    it('Should fail validating a string for a text decoration', () => {
      expect(() =>
        makeSpecifyTextDecorationValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a text decoration', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.textDecoration',
        $mode: 'default',
      };
      const result = makeSpecifyTextDecorationValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyTextDecorationValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyTextDecorationValueWithAlias>>;
    });
  });
});
