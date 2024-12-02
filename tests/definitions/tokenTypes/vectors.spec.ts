import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyVectorsTypeName,
  specifyVectorTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyVectorsValueSchema,
  specifyVectorsDefinition,
  SpecifyVectorsValue,
  SpecifyVectorsValueWithAlias,
} from '../../../src/definitions/tokenTypes/vectors.js';
import { ValuePath } from '../../../src/index.js';

describe.concurrent('vectors', () => {
  describe.concurrent('makeSpecifyVectorsValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a vectors value', () => {
      const input: SpecifyVectorsValue = {
        files: [
          {
            url: 'https://specifyapp.com/images/vectors.svg',
            format: 'svg',
            variationLabel: '',
            provider: 'Specify',
          },
        ],
      };
      const result = makeSpecifyVectorsValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyVectorsValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifyVectorsValue>>;

      const inputWithNullValues = {
        files: [
          {
            url: 'https://specifyapp.com/images/vectors.svg',
            format: 'svg',
            variationLabel: null,
            provider: 'Specify',
          },
          {
            url: 'https://specifyapp.com/images/vectors.svg',
            format: 'pdf',
            variationLabel: null,
            provider: 'Specify',
          },
        ],
      };
      const resultWithNullValues =
        makeSpecifyVectorsValueSchema(isNotSupportingAliasing).parse(inputWithNullValues);
      expect(resultWithNullValues).toStrictEqual(inputWithNullValues);
    });
    it('Should fail validating a vectors value with extra properties', () => {
      expect(() =>
        makeSpecifyVectorsValueSchema(isNotSupportingAliasing).parse({
          url: 'https://specifyapp.com/images/vectors.svg',
          format: 'svg',
          variationLabel: '',
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a vectors value with missing properties', () => {
      expect(() => makeSpecifyVectorsValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a vectors value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.vectors',
        $mode: 'default',
      };
      const result = makeSpecifyVectorsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyVectorsValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyVectorsValueWithAlias>>;
    });
    it('Should validate an alias for a vectors value sub keys', () => {
      const input: SpecifyVectorsValueWithAlias = {
        files: [
          {
            $alias: 'some.vector',
            $mode: 'mode',
          },
        ],
      };
      const result = makeSpecifyVectorsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyVectorsDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyVectorsDefinition.matchTokenTypeAgainstMapping(
          specifyVectorsTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyVectorsDefinition.matchTokenTypeAgainstMapping(
          specifyVectorTypeName,
          new ValuePath(['files', 0]),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
