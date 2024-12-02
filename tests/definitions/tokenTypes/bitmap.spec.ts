import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import { SpecifyJSONStringValue } from '../../../src/definitions/tokenTypes/_JSON.js';
import { SpecifyBitmapFormatValue } from '../../../src/definitions/tokenTypes/bitmapFormat.js';
import { SpecifyPositiveIntegerNumberValue } from '../../../src/definitions/tokenTypes/_numbers.js';
import {
  specifyBitmapFormatTypeName,
  specifyBitmapTypeName,
  specifyJSONStringTypeName,
  specifyPositiveIntegerNumberTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyBitmapValueSchema,
  specifyBitmapDefinition,
  SpecifyBitmapProvider,
  SpecifyBitmapValue,
  SpecifyBitmapValueWithAlias,
} from '../../../src/definitions/tokenTypes/bitmap.js';

describe.concurrent('bitmap', () => {
  describe.concurrent('makeSpecifyBitmapValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a bitmap value', () => {
      const input = {
        url: 'https://specifyapp.com/bitmap.png',
        format: 'png',
        width: 400,
        height: 400,
        variationLabel: '@2x',
        provider: 'Specify',
      };
      const result = makeSpecifyBitmapValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          {
            url: SpecifyJSONStringValue;
            format: SpecifyBitmapFormatValue;
            width: SpecifyPositiveIntegerNumberValue | null;
            height: SpecifyPositiveIntegerNumberValue | null;
            variationLabel: SpecifyJSONStringValue | null;
            provider: SpecifyBitmapProvider;
          }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyBitmapValue>>;

      const inputWithNullValues = {
        url: 'https://specifyapp.com/bitmap.png',
        format: 'png',
        width: null,
        height: null,
        variationLabel: null,
        provider: 'Specify',
      };
      const resultWithNullValues =
        makeSpecifyBitmapValueSchema(isNotSupportingAliasing).parse(inputWithNullValues);
      expect(resultWithNullValues).toStrictEqual(inputWithNullValues);
    });
    it('Should fail validating a bitmap with extra properties', () => {
      expect(() =>
        makeSpecifyBitmapValueSchema(isNotSupportingAliasing).parse({
          url: 'https://specifyapp.com/bitmap.png',
          format: 'png',
          width: 400,
          height: 400,
          variationLabel: '@2x',
          extraProperty: 'extra',
          provider: 'Specify',
        }),
      ).toThrow();
    });
    it('Should fail validating a bitmap with missing properties', () => {
      expect(() => makeSpecifyBitmapValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a bitmap', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.bitmap',
        $mode: 'default',
      };
      const result = makeSpecifyBitmapValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);

      type Result = Expect<Equal<typeof result, SpecifyBitmapValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyBitmapValueWithAlias>>;
    });
    it('Should validate an alias for a bitmap sub keys', () => {
      const input: SpecifyBitmapValueWithAlias = {
        url: {
          $alias: 'some-bitmap.value.url',
          $mode: 'default',
        },
        format: {
          $alias: 'some-bitmap.value.format',
          $mode: 'default',
        },
        width: {
          $alias: 'some-bitmap.value.width',
          $mode: 'default',
        },
        height: {
          $alias: 'some-bitmap.value.height',
          $mode: 'default',
        },
        variationLabel: {
          $alias: 'some-bitmap.value.variationLabel',
          $mode: 'default',
        },
        provider: 'Specify',
      };
      const result = makeSpecifyBitmapValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyBitmapDefinition', () => {
    it('Should match token types of root level type', () => {
      expect(
        specifyBitmapDefinition.matchTokenTypeAgainstMapping(
          specifyBitmapTypeName,
          ValuePath.empty(),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyBitmapDefinition.matchTokenTypeAgainstMapping(
          specifyJSONStringTypeName,
          new ValuePath(['url']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBitmapDefinition.matchTokenTypeAgainstMapping(
          specifyBitmapFormatTypeName,
          new ValuePath(['format']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBitmapDefinition.matchTokenTypeAgainstMapping(
          specifyPositiveIntegerNumberTypeName,
          new ValuePath(['width']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBitmapDefinition.matchTokenTypeAgainstMapping(
          specifyPositiveIntegerNumberTypeName,
          new ValuePath(['height']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyBitmapDefinition.matchTokenTypeAgainstMapping(
          specifyJSONStringTypeName,
          new ValuePath(['variationLabel']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
