import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyFontWeightValueSchema,
  SpecifyFontWeightValue,
  SpecifyFontWeightValueWithAlias,
  specifyNamedFontWeightValues,
} from '../../../src/definitions/tokenTypes/fontWeight.js';

describe.concurrent('fontWeight', () => {
  describe.concurrent('makeSpecifyFontWeightValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a font weight', () => {
      const input = 'normal';
      const result = makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<
        Equal<
          typeof result,
          | number // [1,1000]
          | 'thin'
          | 'hairline'
          | 'extra-light'
          | 'ultra-light'
          | 'light'
          | 'normal'
          | 'plain'
          | 'standard'
          | 'regular'
          | 'roman'
          | 'book'
          | 'medium'
          | 'semi-bold'
          | 'demi-bold'
          | 'bold'
          | 'extra-bold'
          | 'ultra-bold'
          | 'black'
          | 'heavy'
          | 'extra-black'
          | 'ultra-black'
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyFontWeightValue>>;

      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('thin')).toBe('thin');
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('hairline')).toBe(
        'hairline',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('extra-light')).toBe(
        'extra-light',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('ultra-light')).toBe(
        'ultra-light',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('light')).toBe(
        'light',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('normal')).toBe(
        'normal',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('book')).toBe('book');
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('medium')).toBe(
        'medium',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('semi-bold')).toBe(
        'semi-bold',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('demi-bold')).toBe(
        'demi-bold',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('bold')).toBe('bold');
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('extra-bold')).toBe(
        'extra-bold',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('ultra-bold')).toBe(
        'ultra-bold',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('black')).toBe(
        'black',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('heavy')).toBe(
        'heavy',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('extra-black')).toBe(
        'extra-black',
      );
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('ultra-black')).toBe(
        'ultra-black',
      );

      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse(1)).toBe(1);
      expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse(1000)).toBe(1000);
    });
    it('Should validate all runtime values available for `specifyNamedFontWeightValues`', ({
      expect,
    }) => {
      specifyNamedFontWeightValues.forEach(value => {
        expect(makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse(value)).toBe(value);
      });
      expect.assertions(specifyNamedFontWeightValues.length);
    });
    it('Should fail validating a string for a font weight', () => {
      expect(() =>
        makeSpecifyFontWeightValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a font weight', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.fontWeight',
        $mode: 'default',
      };
      const result = makeSpecifyFontWeightValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyFontWeightValueWithAlias>>;
      type Declaration = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyFontWeightValue>>
      >;
    });
  });
});
