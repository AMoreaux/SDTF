import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyVectorFormatValueSchema,
  specifyVectorFormatValues,
  SpecifyVectorFormatValue,
  SpecifyVectorFormatValueWithAlias,
} from '../../../src/definitions/tokenTypes/vectorFormat.js';

describe.concurrent('vectorFormat', () => {
  describe.concurrent('makeSpecifyVectorFormatValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a vector format', () => {
      const input = 'svg';
      const result = makeSpecifyVectorFormatValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<Equal<typeof result, 'svg' | 'pdf'>>;
      type Declaration = Expect<Equal<typeof result, SpecifyVectorFormatValue>>;

      expect(makeSpecifyVectorFormatValueSchema(isNotSupportingAliasing).parse('pdf')).toBe('pdf');
    });
    it('Should validate all runtime values available in `specifyVectorFormatValues`', ({
      expect,
    }) => {
      specifyVectorFormatValues.forEach(value => {
        expect(makeSpecifyVectorFormatValueSchema(isNotSupportingAliasing).parse(value)).toBe(
          value,
        );
      });
      expect.assertions(specifyVectorFormatValues.length);
    });
    it('Should fail validating a string for a vector format', () => {
      expect(() =>
        makeSpecifyVectorFormatValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a vector format', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.vectorFormat',
        $mode: 'default',
      };
      const result = makeSpecifyVectorFormatValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyVectorFormatValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyVectorFormatValueWithAlias>>;
    });
  });
});
