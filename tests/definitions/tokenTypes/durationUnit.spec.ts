import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyDurationUnitValueSchema,
  SpecifyDurationUnitValue,
  specifyDurationUnitValues,
  SpecifyDurationUnitValueWithAlias,
} from '../../../src/definitions/tokenTypes/durationUnit.js';

describe.concurrent('durationUnit', () => {
  describe.concurrent('makeSpecifyDurationUnitValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a duration unit', () => {
      const input = 'ms';
      const result = makeSpecifyDurationUnitValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<Equal<typeof result, 'ms' | 's'>>;
      type Declaration = Expect<Equal<typeof result, SpecifyDurationUnitValue>>;

      expect(makeSpecifyDurationUnitValueSchema(isNotSupportingAliasing).parse('s')).toBe('s');
    });
    it('Should validate all runtime values available in `specifyDurationUnitValues`', ({
      expect,
    }) => {
      specifyDurationUnitValues.forEach(value => {
        expect(makeSpecifyDurationUnitValueSchema(isNotSupportingAliasing).parse(value)).toBe(
          value,
        );
      });
      expect.assertions(specifyDurationUnitValues.length);
    });
    it('Should fail validating a string for a duration unit', () => {
      expect(() =>
        makeSpecifyDurationUnitValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a duration unit', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.durationUnit',
        $mode: 'default',
      };
      const result = makeSpecifyDurationUnitValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyDurationUnitValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyDurationUnitValueWithAlias>>;
    });
  });
});
