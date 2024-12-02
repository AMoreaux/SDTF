import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyTextAlignHorizontalValueSchema,
  SpecifyTextAlignHorizontalValue,
  specifyTextAlignHorizontalValues,
  SpecifyTextAlignHorizontalValueWithAlias,
} from '../../../src/definitions/tokenTypes/textAlignHorizontal.js';

describe.concurrent('textAlignHorizontal', () => {
  describe.concurrent('makeSpecifyTextAlignHorizontalValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a text align horizontal', () => {
      const input = 'initial';
      const result =
        makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<
        Equal<
          typeof result,
          | 'initial'
          | 'left'
          | 'right'
          | 'center'
          | 'justify'
          | 'start'
          | 'end'
          | 'justify-all'
          | 'match-parent'
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyTextAlignHorizontalValue>>;

      expect(makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse('left')).toBe(
        'left',
      );
      expect(
        makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse('right'),
      ).toBe('right');
      expect(
        makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse('center'),
      ).toBe('center');
      expect(
        makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse('justify'),
      ).toBe('justify');
      expect(
        makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse('start'),
      ).toBe('start');
      expect(makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse('end')).toBe(
        'end',
      );
      expect(
        makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse('justify-all'),
      ).toBe('justify-all');
      expect(
        makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse('match-parent'),
      ).toBe('match-parent');
    });
    it('Should validate all runtime values available in `specifyTextAlignHorizontalValues`', ({
      expect,
    }) => {
      specifyTextAlignHorizontalValues.forEach(value => {
        expect(
          makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse(value),
        ).toBe(value);
      });
      expect.assertions(specifyTextAlignHorizontalValues.length);
    });
    it('Should fail validating a string for a text align horizontal', () => {
      expect(() =>
        makeSpecifyTextAlignHorizontalValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a text align horizontal', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.textAlignHorizontal',
        $mode: 'default',
      };
      const result = makeSpecifyTextAlignHorizontalValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyTextAlignHorizontalValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyTextAlignHorizontalValueWithAlias>>;
    });
  });
});
