import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyPositiveIntegerNumberValue,
  SpecifyPositiveIntegerNumberValueWithAlias,
} from '../../../src/definitions/tokenTypes/_numbers.js';
import {
  specifyPositiveIntegerNumberTypeName,
  specifyZIndexTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

import {
  makeSpecifyZIndexValueSchema,
  specifyZIndexDefinition,
  SpecifyZIndexValue,
  SpecifyZIndexValueWithAlias,
} from '../../../src/definitions/tokenTypes/zIndex.js';

describe.concurrent('zIndex', () => {
  describe.concurrent('makeSpecifyZIndexValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a zIndex value', () => {
      const input: SpecifyZIndexValue = 1;
      const result = makeSpecifyZIndexValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyPositiveIntegerNumberValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifyZIndexValue>>;
    });
    it('Should fail validating a zIndex value with a negative value', () => {
      expect(() => makeSpecifyZIndexValueSchema(isNotSupportingAliasing).parse(-1)).toThrow();
    });
    it('Should fail validating a zIndex value with a non-integer value', () => {
      expect(() => makeSpecifyZIndexValueSchema(isNotSupportingAliasing).parse(1.5)).toThrow();
    });
    it('Should validate an alias for a zIndex value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.zIndex',
        $mode: 'default',
      };
      const result = makeSpecifyZIndexValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyPositiveIntegerNumberValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyZIndexValueWithAlias>>;
    });
  });
  describe.concurrent('specifyZIndexDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyZIndexDefinition.matchTokenTypeAgainstMapping(
          specifyZIndexTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyZIndexDefinition.matchTokenTypeAgainstMapping(
          specifyPositiveIntegerNumberTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
