import { z } from 'zod';
import {
  SpecifyModeAndValueLevelAliasSignature,
  SpecifyTopLevelAliasSignature,
  SpecifyTopLevelAliasSignatureSchema,
  specifyTopLevelAliasSignatureSchema,
} from './designTokenAlias.js';
import { treeNodeCommonPropertiesSchema, TreeNodeExtensions } from './designTokenTree.js';
import { specifyDesignTokenValueModeSchema } from './designTokenMode.js';

export function matchIsDesignTokenSignature(
  maybeToken: unknown,
): maybeToken is SpecifyDesignTokenSignature {
  if (
    typeof maybeToken === 'object' &&
    maybeToken !== null &&
    !Array.isArray(maybeToken) &&
    '$value' in maybeToken &&
    (maybeToken as { $value: unknown }).$value !== undefined
  ) {
    return true;
  }
  return false;
}

export type SpecifyDesignTokenValueWithMode<
  Value = unknown,
  Mode extends string = string,
  WithModes extends boolean = true,
  WithAliases extends boolean = true,
> = WithAliases extends true
  ? WithModes extends true
    ? { [mode in Mode]: Value } | SpecifyTopLevelAliasSignature
    : Value
  : WithModes extends true
  ? { [mode in Mode]: Value }
  : Value;

export type SpecifyDesignTokenSignature<
  Type extends string = string,
  Value extends unknown = unknown,
  Mode extends string = string,
  WithModes extends boolean = true,
  WithAliases extends boolean = true,
> = {
  $type: Type;
  $value: SpecifyDesignTokenValueWithMode<Value, Mode, WithModes, WithAliases>;
  $description?: string;
  $extensions?: TreeNodeExtensions;
};

// Local replicates of ReturnType<typeof makeSpecifyDesignTokenSchema>
export type ZodDesignTokenSignature<
  Type extends string,
  Value extends z.Schema,
  WithAliases extends boolean = true,
> = z.ZodObject<
  {
    $type: z.ZodLiteral<Type>;
    $value: WithAliases extends true
      ? z.ZodUnion<[SpecifyTopLevelAliasSignatureSchema, z.ZodRecord<z.ZodString, Value>]>
      : z.ZodRecord<z.ZodEffects<z.ZodString>, Value>;
    $description: z.ZodOptional<z.ZodString>;
    $extensions: z.ZodOptional<
      z.ZodRecord<
        z.ZodString,
        z.ZodUnion<
          [
            z.ZodString,
            z.ZodNumber,
            z.ZodBoolean,
            z.ZodNull,
            z.ZodRecord<z.ZodString, z.ZodAny>,
            z.ZodArray<z.ZodAny, 'many'>,
          ]
        >
      >
    >;
  },
  'strict'
>;

export function makeSpecifyDesignTokenSchema<
  Type extends string,
  Value extends z.Schema,
  WithAliases extends boolean,
>(
  typeName: Type,
  valueSchema: Value,
  withAliases: WithAliases,
): ZodDesignTokenSignature<Type, Value, WithAliases> {
  return z
    .object({
      $type: z.literal(typeName),
      $value: withAliases
        ? z.union([
            specifyTopLevelAliasSignatureSchema,
            z.record(specifyDesignTokenValueModeSchema, valueSchema),
          ])
        : z.record(specifyDesignTokenValueModeSchema, valueSchema),
    })
    .merge(treeNodeCommonPropertiesSchema)
    .strict() as ZodDesignTokenSignature<Type, Value, WithAliases>;
}

export const specifyGenericDesignTokenSignatureSchema = z
  .object({
    $type: z.string({
      invalid_type_error: 'Expected a string for $type',
      required_error: 'Expected a string for $type',
    }),
    $value: z.unknown({
      required_error: 'Expected a defined value for $value',
    }),
  })
  .merge(treeNodeCommonPropertiesSchema)
  .strict();

/**
 * @deprecated - Not flexible enough, use `specifyGenericDesignTokenSignatureSchema` instead
 */
export function validateSpecifyGenericDesignTokenSignature(value: unknown) {
  return specifyGenericDesignTokenSignatureSchema.parse(value);
}
