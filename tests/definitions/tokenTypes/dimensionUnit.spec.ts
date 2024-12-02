import { describe, expect, it } from 'vitest';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  WithModeAndValueLevelAlias,
} from '../../../src/definitions/internals/designTokenAlias.js';
import { specifyDimensionUnitTypeName } from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyDimensionUnitValueSchema,
  SpecifyDimensionUnitValue,
  specifyDimensionUnitValues,
  SpecifyDimensionUnitValueWithAlias,
} from '../../../src/definitions/tokenTypes/dimensionUnit.js';

describe.concurrent('dimensionUnit', () => {
  describe.concurrent('makeSpecifyDimensionUnitValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a dimension unit', () => {
      const input = '%';
      const result = makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<
        Equal<
          typeof result,
          | null
          | '%'
          | 'px'
          | 'em'
          | 'rem'
          | 'pt'
          | 'pc'
          | 'in'
          | 'cm'
          | 'mm'
          | 'ex'
          | 'cap'
          | 'ch'
          | 'ic'
          | 'lh'
          | 'rlh'
          | 'vw'
          | 'svw'
          | 'lvw'
          | 'dvw'
          | 'vh'
          | 'svh'
          | 'lvh'
          | 'dvh'
          | 'vi'
          | 'svi'
          | 'lvi'
          | 'dvi'
          | 'vb'
          | 'svb'
          | 'lvb'
          | 'dvb'
          | 'vmin'
          | 'svmin'
          | 'lvmin'
          | 'dvmin'
          | 'vmax'
          | 'svmax'
          | 'lvmax'
          | 'dvmax'
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyDimensionUnitValue>>;

      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('px')).toBe('px');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('em')).toBe('em');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('rem')).toBe('rem');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('pt')).toBe('pt');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('pc')).toBe('pc');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('in')).toBe('in');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('cm')).toBe('cm');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('mm')).toBe('mm');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('ex')).toBe('ex');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('cap')).toBe('cap');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('ch')).toBe('ch');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('ic')).toBe('ic');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('lh')).toBe('lh');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('rlh')).toBe('rlh');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('vw')).toBe('vw');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('svw')).toBe('svw');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('lvw')).toBe('lvw');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('dvw')).toBe('dvw');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('vh')).toBe('vh');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('svh')).toBe('svh');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('lvh')).toBe('lvh');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('dvh')).toBe('dvh');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('vi')).toBe('vi');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('svi')).toBe('svi');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('lvi')).toBe('lvi');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('dvi')).toBe('dvi');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('vb')).toBe('vb');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('svb')).toBe('svb');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('lvb')).toBe('lvb');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('dvb')).toBe('dvb');
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('vmin')).toBe(
        'vmin',
      );
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('svmin')).toBe(
        'svmin',
      );
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('lvmin')).toBe(
        'lvmin',
      );
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('dvmin')).toBe(
        'dvmin',
      );
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('vmax')).toBe(
        'vmax',
      );
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('svmax')).toBe(
        'svmax',
      );
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('lvmax')).toBe(
        'lvmax',
      );
      expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('dvmax')).toBe(
        'dvmax',
      );
    });
    it('Should validate a null value', () => {
      const input = null;
      const result = makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse(input);
      expect(result).toBe(input);
      type Result = Expect<Equal<typeof result, SpecifyDimensionUnitValue>>;
    });

    it('Should validate all runtime values available in `specifyDimensionUnitValues`', ({
      expect,
    }) => {
      specifyDimensionUnitValues.forEach(value => {
        expect(makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse(value)).toBe(
          value,
        );
      });
      expect.assertions(specifyDimensionUnitValues.length);
    });
    it('Should fail validating a string for a dimension unit', () => {
      expect(() =>
        makeSpecifyDimensionUnitValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a dimension unit', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.dimensionUnit',
        $mode: 'default',
      };
      const result = makeSpecifyDimensionUnitValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<
        Equal<typeof result, WithModeAndValueLevelAlias<SpecifyDimensionUnitValue>>
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyDimensionUnitValueWithAlias>>;
    });
  });
});
