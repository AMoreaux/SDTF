import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyFontStyleValueSchema,
  SpecifyFontStyleValue,
  specifyFontStyleValues,
  SpecifyFontStyleValueWithAlias,
} from '../../../src/definitions/tokenTypes/fontStyle.js';

describe.concurrent('fontStyle', () => {
  describe.concurrent('makeSpecifyFontStyleValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a font style', () => {
      const input = 'normal';
      const result = makeSpecifyFontStyleValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<Equal<typeof result, 'normal' | 'italic'>>;
      type Declaration = Expect<Equal<typeof result, SpecifyFontStyleValue>>;

      expect(makeSpecifyFontStyleValueSchema(isNotSupportingAliasing).parse('italic')).toBe(
        'italic',
      );
    });
    it('Should validate all runtime values available in `specifyFontStyleValues`', ({ expect }) => {
      specifyFontStyleValues.forEach(value => {
        expect(makeSpecifyFontStyleValueSchema(isNotSupportingAliasing).parse(value)).toBe(value);
      });
      expect.assertions(specifyFontStyleValues.length);
    });
    it('Should fail validating a string for a font style', () => {
      expect(() =>
        makeSpecifyFontStyleValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a font style', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.fontStyle',
        $mode: 'default',
      };
      const result = makeSpecifyFontStyleValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, WithModeAndValueLevelAlias<SpecifyFontStyleValue>>>;
      type Declaration = Expect<Equal<typeof result, SpecifyFontStyleValueWithAlias>>;
    });
  });
});
