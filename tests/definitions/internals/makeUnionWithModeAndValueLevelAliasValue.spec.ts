import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import { makeUnionWithModeAndValueLevelAliasValue } from '../../../src/definitions/internals/makeUnionWithModeAndValueLevelAliasValue.js';

describe.concurrent('makeUnionWithModeAndValueLevelAliasValue', () => {
  it('Should parse an alias term with `makeUnionWithModeAndValueLevelAliasValue` along with `isSupportingAliasing = true`', () => {
    const isSupportingAliasing = true;
    const schema = makeUnionWithModeAndValueLevelAliasValue(z.number())(isSupportingAliasing);
    const input = {
      $alias: 'some.number',
      $mode: 'some mode',
    };
    const result = schema.parse(input);
    expect(result).toStrictEqual(input);
    type Result = Expect<Equal<typeof result, number | SpecifyModeAndValueLevelAliasSignature>>;
  });
  it('Should fail parsing an alias term with `makeUnionWithModeAndValueLevelAliasValue` along with `isSupportingAliasing = false`', () => {
    const isSupportingAliasing = false;
    const schema = makeUnionWithModeAndValueLevelAliasValue(z.number())(isSupportingAliasing);
    const input = {
      $alias: 'some.number',
      $mode: 'some mode',
    };
    expect(() => schema.parse(input)).toThrow();
  });
});
