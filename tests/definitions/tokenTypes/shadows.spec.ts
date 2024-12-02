import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { ArrayWithAtLeastOneElement } from '../../../src/utils/typeUtils.js';
import {
  SpecifyShadowValue,
  SpecifyShadowValueWithAlias,
} from '../../../src/definitions/tokenTypes/shadow.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyColorTypeName,
  specifyShadowsTypeName,
  specifyShadowTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyShadowsValueSchema,
  specifyShadowsDefinition,
  SpecifyShadowsValue,
  SpecifyShadowsValueWithAlias,
} from '../../../src/definitions/tokenTypes/shadows.js';

describe.concurrent('shadows', () => {
  describe.concurrent('makeSpecifyShadowsValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a shadows value', () => {
      const input = [
        {
          color: {
            model: 'hex',
            hex: '#000000',
            alpha: 1,
          },
          offsetX: {
            value: 0,
            unit: null,
          },
          offsetY: {
            value: 2,
            unit: 'px',
          },
          blurRadius: {
            value: 8,
            unit: 'px',
          },
          spreadRadius: {
            value: 6,
            unit: 'px',
          },
          type: 'outer',
        },
      ];
      const result = makeSpecifyShadowsValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, ArrayWithAtLeastOneElement<SpecifyShadowValue>>>;
      type Declaration = Expect<Equal<typeof result, SpecifyShadowsValue>>;
    });
    it('Should fail validating a shadows value with an empty array', () => {
      expect(() => makeSpecifyShadowsValueSchema(isNotSupportingAliasing).parse([])).toThrow();
    });
    it('Should fail validating a shadows value with an array of invalid values', () => {
      expect(() =>
        makeSpecifyShadowsValueSchema(isNotSupportingAliasing).parse([1, true, 'two', null]),
      ).toThrow();
    });
    it('Should validate an alias for a shadows value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.shadows',
        $mode: 'default',
      };
      const result = makeSpecifyShadowsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<
          typeof result,
          WithModeAndValueLevelAlias<ArrayWithAtLeastOneElement<SpecifyShadowValueWithAlias>>
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyShadowsValueWithAlias>>;
    });
    it('Should validate an alias for a shadows value array item', () => {
      const input: SpecifyShadowsValueWithAlias = [
        {
          $alias: 'some.shadow',
          $mode: 'default',
        },
      ];
      const result = makeSpecifyShadowsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
    it('Should validate an alias for a shadows value sub keys', () => {
      const input: SpecifyShadowsValueWithAlias = [
        {
          color: { $alias: 'color.alias', $mode: 'default' },
          offsetX: { $alias: 'shadow.offsetX.alias', $mode: 'default' },
          offsetY: { $alias: 'shadow.offsetY.alias', $mode: 'default' },
          blurRadius: { $alias: 'shadow.blurRadius.alias', $mode: 'default' },
          spreadRadius: { $alias: 'shadow.spreadRadius.alias', $mode: 'default' },
          type: { $alias: 'shadow.type.alias', $mode: 'default' },
        },
      ];
      const result = makeSpecifyShadowsValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });
  });
  describe.concurrent('specifyShadowsDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyShadowsDefinition.matchTokenTypeAgainstMapping(
          specifyShadowsTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyShadowsDefinition.matchTokenTypeAgainstMapping(
          specifyShadowTypeName,
          new ValuePath(['0']),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of nested shadow values sub-types', () => {
      expect(
        specifyShadowsDefinition.matchTokenTypeAgainstMapping(
          specifyColorTypeName,
          new ValuePath(['0', 'color']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
