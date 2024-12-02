import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';

import {
  makeSpecifyHexadecimalColorStringValueSchema,
  SpecifyHexadecimalColorStringValue,
  SpecifyHexadecimalColorStringValueWithAlias,
} from '../../../src/definitions/tokenTypes/_strings.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

describe.concurrent('Parse Specify Utility types - Strings', () => {
  describe.concurrent('Hexadecimal string', () => {
    describe.concurrent('makeSpecifyHexadecimalColorStringValueSchema', () => {
      const isSupportingAliasing = true;
      const isNotSupportingAliasing = false;

      it('Should validate a hexadecimal color', () => {
        const input = '#000000';
        const result =
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyHexadecimalColorStringValue>>;

        expect(
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('#ffffff'),
        ).toBe('#ffffff');
      });
      it('Should fail validating a hexadecimal color with an invalid format', () => {
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('#ffffff12'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('#ffffff1'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('#00000'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('#0000'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('#000'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('#00'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('#0'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('#'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('000000'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('00000'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('0000'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('000'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('00'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse('0'),
        ).toThrow();
        expect(() =>
          makeSpecifyHexadecimalColorStringValueSchema(isNotSupportingAliasing).parse(''),
        ).toThrow();
      });
      it('Should validate an alias for a hexadecimal color', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result =
          makeSpecifyHexadecimalColorStringValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyHexadecimalColorStringValueWithAlias>>;
      });
    });
  });
});
