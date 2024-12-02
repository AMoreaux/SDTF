import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyJSONStringValue } from '../../../src/definitions/tokenTypes/_JSON.js';
import { SpecifyVectorFormatValue } from '../../../src/definitions/tokenTypes/vectorFormat.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyJSONStringTypeName,
  specifyVectorFormatTypeName,
  specifyVectorTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyVectorValueSchema,
  specifyVectorDefinition,
  SpecifyVectorProvider,
  SpecifyVectorValue,
  SpecifyVectorValueWithAlias,
} from '../../../src/definitions/tokenTypes/vector.js';

describe.concurrent('vector', () => {
  describe.concurrent('makeSpecifyVectorValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a vector value', () => {
      const input: SpecifyVectorValue = {
        url: 'https://specifyapp.com/images/vector.svg',
        format: 'svg',
        variationLabel: '',
        provider: 'Specify',
      };
      const result = makeSpecifyVectorValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          {
            url: SpecifyJSONStringValue;
            format: SpecifyVectorFormatValue;
            variationLabel: SpecifyJSONStringValue | null;
            provider: SpecifyVectorProvider;
          }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyVectorValue>>;

      const inputWithNullValues = {
        url: 'https://specifyapp.com/images/vector.svg',
        format: 'svg',
        variationLabel: null,
        provider: 'Specify',
      };
      const resultWithNullValues =
        makeSpecifyVectorValueSchema(isNotSupportingAliasing).parse(inputWithNullValues);
      expect(resultWithNullValues).toStrictEqual(inputWithNullValues);
    });
    it('Should fail validating a vector value with extra properties', () => {
      expect(() =>
        makeSpecifyVectorValueSchema(isNotSupportingAliasing).parse({
          url: 'https://specifyapp.com/images/vector.svg',
          format: 'svg',
          variationLabel: '',
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a vector value with missing properties', () => {
      expect(() => makeSpecifyVectorValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a vector value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.vector',
        $mode: 'default',
      };
      const result = makeSpecifyVectorValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyVectorValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyVectorValueWithAlias>>;
    });
    it('Should validate an alias for a vector value sub keys', () => {
      const input: SpecifyVectorValueWithAlias = {
        url: { $alias: 'some.vector.url', $mode: 'default' },
        format: { $alias: 'some.vector.format', $mode: 'default' },
        variationLabel: { $alias: 'some.vector.variationLabel', $mode: 'default' },
        provider: 'Specify',
      };
      const result = makeSpecifyVectorValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyVectorDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyVectorDefinition.matchTokenTypeAgainstMapping(
          specifyVectorTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyVectorDefinition.matchTokenTypeAgainstMapping(
          specifyJSONStringTypeName,
          new ValuePath(['url']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyVectorDefinition.matchTokenTypeAgainstMapping(
          specifyVectorFormatTypeName,
          new ValuePath(['format']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyVectorDefinition.matchTokenTypeAgainstMapping(
          specifyJSONStringTypeName,
          new ValuePath(['variationLabel']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
