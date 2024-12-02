import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyFontFormatValueSchema,
  specifyFontFormatValues,
  SpecifyFontFormatValue,
  SpecifyFontFormatValueWithAlias,
} from '../../../src/definitions/tokenTypes/fontFormat.js';

describe.concurrent('fontFormat', () => {
  describe.concurrent('makeSpecifyFontFormatValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a font format', () => {
      const input = 'ttf';
      const result = makeSpecifyFontFormatValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<Equal<typeof result, 'ttf' | 'woff' | 'woff2' | 'otf' | 'eot'>>;
      type Declaration = Expect<Equal<typeof result, SpecifyFontFormatValue>>;

      expect(makeSpecifyFontFormatValueSchema(isNotSupportingAliasing).parse('woff')).toBe('woff');
      expect(makeSpecifyFontFormatValueSchema(isNotSupportingAliasing).parse('woff2')).toBe(
        'woff2',
      );
      expect(makeSpecifyFontFormatValueSchema(isNotSupportingAliasing).parse('otf')).toBe('otf');
      expect(makeSpecifyFontFormatValueSchema(isNotSupportingAliasing).parse('eot')).toBe('eot');
    });
    it('Should validate all runtime values available in `specifyFontFormatValues`', ({
      expect,
    }) => {
      specifyFontFormatValues.forEach(value => {
        expect(makeSpecifyFontFormatValueSchema(isNotSupportingAliasing).parse(value)).toBe(value);
      });
      expect.assertions(specifyFontFormatValues.length);
    });
    it('Should fail validating a string for a font format', () => {
      expect(() =>
        makeSpecifyFontFormatValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a font format', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.fontFormat',
        $mode: 'default',
      };
      const result = makeSpecifyFontFormatValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyFontFormatValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyFontFormatValueWithAlias>>;
    });
  });
});
