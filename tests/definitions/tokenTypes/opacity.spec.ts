import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyZeroToOneNumberValue,
  SpecifyZeroToOneNumberValueWithAlias,
} from '../../../src/definitions/tokenTypes/_numbers.js';
import {
  specifyOpacityTypeName,
  specifyZeroToOneNumberTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

import {
  makeSpecifyOpacityValueSchema,
  specifyOpacityDefinition,
  SpecifyOpacityValue,
  SpecifyOpacityValueWithAlias,
} from '../../../src/definitions/tokenTypes/opacity.js';

describe.concurrent('opacity', () => {
  describe.concurrent('makeSpecifyOpacityValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate an opacity value', () => {
      const input = 0.5;
      const result = makeSpecifyOpacityValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<Equal<typeof result, SpecifyZeroToOneNumberValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifyOpacityValue>>;
    });
    it('Should fail validating an opacity value with a string value', () => {
      expect(() => makeSpecifyOpacityValueSchema(isNotSupportingAliasing).parse('0.5')).toThrow();
    });
    it('Should validate an alias for an opacity value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.opacity',
        $mode: 'default',
      };
      const result = makeSpecifyOpacityValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyZeroToOneNumberValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyOpacityValueWithAlias>>;
    });
  });
  describe.concurrent('specifyOpacityDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyOpacityDefinition.matchTokenTypeAgainstMapping(
          specifyOpacityTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyOpacityDefinition.matchTokenTypeAgainstMapping(
          specifyZeroToOneNumberTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
