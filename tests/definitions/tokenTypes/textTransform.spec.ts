import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyTextTransformValueSchema,
  specifyTextTransformValues,
  SpecifyTextTransformValue,
  SpecifyTextTransformValueWithAlias,
} from '../../../src/definitions/tokenTypes/textTransform.js';

describe.concurrent('textTransform', () => {
  describe.concurrent('makeSpecifyTextTransformValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a text transform', () => {
      const input = 'none';
      const result = makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<
        Equal<
          typeof result,
          | 'none'
          | 'capitalize'
          | 'uppercase'
          | 'lowercase'
          | 'full-width'
          | 'full-size-kana'
          | 'small-caps'
          | 'all-small-caps'
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyTextTransformValue>>;

      expect(makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse('capitalize')).toBe(
        'capitalize',
      );
      expect(makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse('uppercase')).toBe(
        'uppercase',
      );
      expect(makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse('lowercase')).toBe(
        'lowercase',
      );
      expect(makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse('full-width')).toBe(
        'full-width',
      );
      expect(
        makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse('full-size-kana'),
      ).toBe('full-size-kana');
      expect(makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse('small-caps')).toBe(
        'small-caps',
      );
      expect(
        makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse('all-small-caps'),
      ).toBe('all-small-caps');
    });
    it('Should validate all runtime values available in `specifyTextTransformValues`', ({
      expect,
    }) => {
      specifyTextTransformValues.forEach(value => {
        expect(makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse(value)).toBe(
          value,
        );
      });
      expect.assertions(specifyTextTransformValues.length);
    });
    it('Should fail validating a string for a text transform', () => {
      expect(() =>
        makeSpecifyTextTransformValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a text transform', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.textTransform',
        $mode: 'default',
      };
      const result = makeSpecifyTextTransformValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyTextTransformValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyTextTransformValueWithAlias>>;
    });
  });
});
