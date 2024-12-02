import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { ReturnTypeWithArgs } from '../../utils/typeUtils.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyDimensionUnitTypeName } from '../designTokenTypeNames.js';

export const specifyDimensionUnitValues = [
  '%',
  'px',
  'em',
  'rem',
  'pt',
  'pc',
  'in',
  'cm',
  'mm',
  'ex',
  'cap',
  'ch',
  'ic',
  'lh',
  'rlh',
  'vw',
  'svw',
  'lvw',
  'dvw',
  'vh',
  'svh',
  'lvh',
  'dvh',
  'vi',
  'svi',
  'lvi',
  'dvi',
  'vb',
  'svb',
  'lvb',
  'dvb',
  'vmin',
  'svmin',
  'lvmin',
  'dvmin',
  'vmax',
  'svmax',
  'lvmax',
  'dvmax',
] as const;

export const makeSpecifyDimensionUnitValueSchema = makeUnionWithModeAndValueLevelAliasValue(
  z
    .union([
      z.literal('%'),
      z.literal('px'),
      z.literal('em'),
      z.literal('rem'),
      z.literal('pt'),
      z.literal('pc'),
      z.literal('in'),
      z.literal('cm'),
      z.literal('mm'),
      z.literal('ex'),
      z.literal('cap'),
      z.literal('ch'),
      z.literal('ic'),
      z.literal('lh'),
      z.literal('rlh'),
      z.literal('vw'),
      z.literal('svw'),
      z.literal('lvw'),
      z.literal('dvw'),
      z.literal('vh'),
      z.literal('svh'),
      z.literal('lvh'),
      z.literal('dvh'),
      z.literal('vi'),
      z.literal('svi'),
      z.literal('lvi'),
      z.literal('dvi'),
      z.literal('vb'),
      z.literal('svb'),
      z.literal('lvb'),
      z.literal('dvb'),
      z.literal('vmin'),
      z.literal('svmin'),
      z.literal('lvmin'),
      z.literal('dvmin'),
      z.literal('vmax'),
      z.literal('svmax'),
      z.literal('lvmax'),
      z.literal('dvmax'),
    ])
    .nullable(),
);
export type SpecifyDimensionUnitValue = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyDimensionUnitValueSchema, [false]>
>;
export type SpecifyDimensionUnitValueWithAlias = z.infer<
  ReturnTypeWithArgs<typeof makeSpecifyDimensionUnitValueSchema, [true]>
>;

export const specifyDimensionUnitDefinition = createDesignTokenDefinition({
  type: specifyDimensionUnitTypeName,
  aliasableValueZodSchema: makeSpecifyDimensionUnitValueSchema(true),
  resolvedValueZodSchema: makeSpecifyDimensionUnitValueSchema(false),
});
