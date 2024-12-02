import { describe, it, expect } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyShadowTypeValueSchema,
  specifyShadowTypeTypeValues,
  SpecifyShadowTypeValue,
  SpecifyShadowTypeValueWithAlias,
} from '../../../src/definitions/tokenTypes/shadowType.js';

describe.concurrent('shadowType', () => {
  describe.concurrent('makeSpecifyShadowTypeValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a shadow type', () => {
      const input = 'outer';
      const result = makeSpecifyShadowTypeValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<Equal<typeof result, 'outer' | 'inner'>>;
      type Declaration = Expect<Equal<typeof result, SpecifyShadowTypeValue>>;
    });
    it('Should validate all runtime values available in `specifyShadowTypeValues`', ({
      expect,
    }) => {
      specifyShadowTypeTypeValues.forEach(value => {
        expect(makeSpecifyShadowTypeValueSchema(isNotSupportingAliasing).parse(value)).toBe(value);
      });
      expect.assertions(specifyShadowTypeTypeValues.length);
    });
    it('Should fail validating a string for a shadow type', () => {
      expect(() =>
        makeSpecifyShadowTypeValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a shadow type', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.shadowType',
        $mode: 'default',
      };
      const result = makeSpecifyShadowTypeValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyShadowTypeValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyShadowTypeValueWithAlias>>;
    });
  });
});
