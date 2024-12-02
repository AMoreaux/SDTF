import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyTextAlignVerticalValueSchema,
  SpecifyTextAlignVerticalValue,
  specifyTextAlignVerticalValues,
  SpecifyTextAlignVerticalValueWithAlias,
} from '../../../src/definitions/tokenTypes/textAlignVertical.js';

describe.concurrent('textAlignVertical', () => {
  describe.concurrent('makeSpecifyTextAlignVerticalValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a text align vertical', () => {
      const input = 'initial';
      const result = makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<
        Equal<
          typeof result,
          | 'initial'
          | 'baseline'
          | 'sub'
          | 'super'
          | 'text-top'
          | 'text-bottom'
          | 'middle'
          | 'top'
          | 'bottom'
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyTextAlignVerticalValue>>;

      expect(
        makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse('baseline'),
      ).toBe('baseline');
      expect(makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse('sub')).toBe(
        'sub',
      );
      expect(makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse('super')).toBe(
        'super',
      );
      expect(
        makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse('text-top'),
      ).toBe('text-top');
      expect(
        makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse('text-bottom'),
      ).toBe('text-bottom');
      expect(makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse('middle')).toBe(
        'middle',
      );
      expect(makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse('top')).toBe(
        'top',
      );
      expect(makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse('bottom')).toBe(
        'bottom',
      );
    });
    it('Should validate all runtime values available in `specifyTextAlignVerticalValues`', ({
      expect,
    }) => {
      specifyTextAlignVerticalValues.forEach(value => {
        expect(makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse(value)).toBe(
          value,
        );
      });
      expect.assertions(specifyTextAlignVerticalValues.length);
    });
    it('Should fail validating a string for a text align vertical', () => {
      expect(() =>
        makeSpecifyTextAlignVerticalValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a text align vertical', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.textAlignVertical',
        $mode: 'default',
      };
      const result = makeSpecifyTextAlignVerticalValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyTextAlignVerticalValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyTextAlignVerticalValueWithAlias>>;
    });
  });
});
