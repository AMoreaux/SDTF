import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyBitmapsTypeName,
  specifyBitmapTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyBitmapsValueSchema,
  specifyBitmapsDefinition,
  SpecifyBitmapsValue,
  SpecifyBitmapsValueWithAlias,
} from '../../../src/definitions/tokenTypes/bitmaps.js';
import { ValuePath } from '../../../src/index.js';

describe.concurrent('bitmaps', () => {
  describe.concurrent('makeSpecifyBitmapsValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a bitmaps value', () => {
      const input: SpecifyBitmapsValue = {
        files: [
          {
            url: 'https://specifyapp.com/bitmap.png',
            format: 'png',
            width: 400,
            height: 400,
            variationLabel: '@2x',
            provider: 'Specify',
          },
        ],
      };
      const result = makeSpecifyBitmapsValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyBitmapsValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBitmapsValue>>;

      const inputWithNullValues = {
        files: [
          {
            url: 'https://specifyapp.com/bitmap.png',
            format: 'png',
            width: null,
            height: null,
            variationLabel: null,
            provider: 'Specify',
          },
          {
            url: 'https://specifyapp.com/bitmap.png',
            format: 'png',
            width: null,
            height: null,
            variationLabel: null,
            provider: 'Specify',
          },
        ],
      };
      const resultWithNullValues =
        makeSpecifyBitmapsValueSchema(isNotSupportingAliasing).parse(inputWithNullValues);
      expect(resultWithNullValues).toStrictEqual(inputWithNullValues);
    });
    it('Should fail validating a bitmaps value with extra properties', () => {
      expect(() =>
        makeSpecifyBitmapsValueSchema(isNotSupportingAliasing).parse({
          url: 'https://specifyapp.com/images/bitmaps.svg',
          format: 'svg',
          variationLabel: '',
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a bitmaps value with missing properties', () => {
      expect(() => makeSpecifyBitmapsValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a bitmaps value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.bitmaps',
        $mode: 'default',
      };
      const result = makeSpecifyBitmapsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyBitmapsValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBitmapsValueWithAlias>>;
    });
    it('Should validate an alias for a bitmaps value sub keys', () => {
      const input: SpecifyBitmapsValueWithAlias = {
        files: [
          {
            $alias: 'some.bitmap',
            $mode: 'mode',
          },
        ],
      };
      const result = makeSpecifyBitmapsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyBitmapsDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyBitmapsDefinition.matchTokenTypeAgainstMapping(
          specifyBitmapsTypeName,
          ValuePath.empty(),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyBitmapsDefinition.matchTokenTypeAgainstMapping(
          specifyBitmapTypeName,
          new ValuePath(['files', 0]),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
