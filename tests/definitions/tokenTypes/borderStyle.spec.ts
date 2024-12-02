import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyDimensionValue } from '../../../src/definitions/tokenTypes/dimension.js';
import { SpecifyBorderStyleLineCapValue } from '../../../src/definitions/tokenTypes/borderStyleLineCap.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';

import {
  makeSpecifyBorderStyleValueSchema,
  makeSpecifyNamedBorderStyleValueSchema,
  makeSpecifyObjectBorderStyleValueSchema,
  SpecifyBorderStyleValue,
  SpecifyBorderStyleValueWithAlias,
  SpecifyNamedBorderStyleValue,
  specifyNamedBorderStyleValues,
  SpecifyNamedBorderStyleValueWithAlias,
  SpecifyObjectBorderStyleValue,
  SpecifyObjectBorderStyleValueWithAlias,
} from '../../../src/definitions/tokenTypes/borderStyle.js';

const isSupportingAliasing = true;
const isNotSupportingAliasing = false;

describe.concurrent('borderStyle', () => {
  describe.concurrent('makeSpecifyObjectBorderStyleValueSchema  — MUST NOT BE IMPLEMENTED', () => {
    it('Should validate an object border style', () => {
      const input = {
        lineCap: 'butt',
        dashArray: [
          { value: 2, unit: 'px' },
          { value: 3, unit: 'px' },
        ],
      };
      const result = makeSpecifyObjectBorderStyleValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          {
            dashArray: Array<SpecifyDimensionValue>;
            lineCap: SpecifyBorderStyleLineCapValue;
          }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyObjectBorderStyleValue>>;
    });
    it('Should fail validating an object border style with an invalid shape', () => {
      expect(() =>
        makeSpecifyObjectBorderStyleValueSchema(isNotSupportingAliasing).parse({
          someKey: 'a-string',
        }),
      ).toThrow();
    });
    it('Should fail validating an object border style with extra properties', () => {
      expect(() =>
        makeSpecifyObjectBorderStyleValueSchema(isNotSupportingAliasing).parse({
          lineCap: 'butt',
          dashArray: [
            { value: 2, unit: 'px' },
            { value: 3, unit: 'px' },
          ],
          extraProperty: 'a-string',
        }),
      ).toThrow();
    });
    it('Should validate an alias for an object border style on lineCap key', () => {
      const input: SpecifyObjectBorderStyleValueWithAlias = {
        lineCap: {
          $alias: 'some.border-style-line-cap',
          $mode: 'default',
        },
        dashArray: [
          { value: 2, unit: 'px' },
          { value: 3, unit: 'px' },
        ],
      };
      const result = makeSpecifyObjectBorderStyleValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyObjectBorderStyleValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyObjectBorderStyleValueWithAlias>>;
    });
    it('Should validate an alias for an object border style on dashArray values', () => {
      const input: SpecifyObjectBorderStyleValueWithAlias = {
        lineCap: 'butt',
        dashArray: [
          { $alias: 'some.dimension', $mode: 'default' },
          {
            value: { $alias: 'some.number', $mode: 'default' },
            unit: 'px',
          },
        ],
      };
      const result = makeSpecifyObjectBorderStyleValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should fail validating a top level alias for an object border style', () => {
      expect(() =>
        makeSpecifyObjectBorderStyleValueSchema(isSupportingAliasing).parse({
          $alias: 'some-alias',
        }),
      ).toThrow();
    });
  });
  describe.concurrent('specifyNamedBorderStyleValues — MUST NOT BE IMPLEMENTED', () => {
    it('Should validate a named border style', () => {
      const input = 'none';
      const result = makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<
        Equal<
          typeof result,
          | 'none'
          | 'hidden'
          | 'dotted'
          | 'dashed'
          | 'solid'
          | 'double'
          | 'groove'
          | 'ridge'
          | 'inset'
          | 'outset'
          | 'inherit'
          | 'initial'
          | 'unset'
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyNamedBorderStyleValue>>;

      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('hidden')).toBe(
        'hidden',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('dotted')).toBe(
        'dotted',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('dashed')).toBe(
        'dashed',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('solid')).toBe(
        'solid',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('double')).toBe(
        'double',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('groove')).toBe(
        'groove',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('ridge')).toBe(
        'ridge',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('inset')).toBe(
        'inset',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('outset')).toBe(
        'outset',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('inherit')).toBe(
        'inherit',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('initial')).toBe(
        'initial',
      );
      expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('unset')).toBe(
        'unset',
      );
    });
    it('Should fail validating a string for a named border style', () => {
      expect(() =>
        makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a named border style', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.named-border-style',
        $mode: 'default',
      };
      const result = makeSpecifyNamedBorderStyleValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyNamedBorderStyleValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyNamedBorderStyleValueWithAlias>>;
    });
    it('Should validate all runtime values available in `specifyNamedBorderStyleValues`', () => {
      let count = 0;
      specifyNamedBorderStyleValues.forEach(value => {
        expect(makeSpecifyNamedBorderStyleValueSchema(isNotSupportingAliasing).parse(value)).toBe(
          value,
        );
        count++;
      });
      expect(count).toBe(specifyNamedBorderStyleValues.length);
    });
  });
  describe.concurrent('makeSpecifyBorderStyleValueSchema', () => {
    it('Should validate a named border style over border style union', () => {
      const input = 'none';
      const result = makeSpecifyBorderStyleValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<
        Equal<typeof result, SpecifyNamedBorderStyleValue | SpecifyObjectBorderStyleValue>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyBorderStyleValue>>;
    });
    it('Should validate an object border style over border style union', () => {
      const input = {
        lineCap: 'butt',
        dashArray: [
          { value: 2, unit: 'px' },
          { value: 3, unit: 'px' },
        ],
      };
      const result = makeSpecifyBorderStyleValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should fail validating a string', () => {
      expect(() =>
        makeSpecifyBorderStyleValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a border style', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.border-style',
        $mode: 'default',
      };
      const result = makeSpecifyBorderStyleValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          WithModeAndValueLevelAlias<
            SpecifyNamedBorderStyleValueWithAlias | SpecifyObjectBorderStyleValueWithAlias
          >
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyBorderStyleValueWithAlias>>;
    });
  });
});
