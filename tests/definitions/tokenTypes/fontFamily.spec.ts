import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyJSONStringValue,
  SpecifyJSONStringValueWithAlias,
} from '../../../src/definitions/tokenTypes/_JSON.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

import {
  makeSpecifyFontFamilyValueSchema,
  SpecifyFontFamilyValue,
  SpecifyFontFamilyValueWithAlias,
} from '../../../src/definitions/tokenTypes/fontFamily.js';

describe.concurrent('fontFamily', () => {
  describe.concurrent('makeSpecifyFontFamilyValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a font family', () => {
      const input = 'Arial';
      const result = makeSpecifyFontFamilyValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<Equal<typeof result, SpecifyJSONStringValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifyFontFamilyValue>>;
    });
    it('Should fail validating an empty string for a font family', () => {
      expect(() => makeSpecifyFontFamilyValueSchema(isNotSupportingAliasing).parse('')).toThrow();
    });
    it('Should validate an alias for a font family', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.fontFamily',
        $mode: 'default',
      };
      const result = makeSpecifyFontFamilyValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyJSONStringValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyFontFamilyValueWithAlias>>;
    });
  });
});
