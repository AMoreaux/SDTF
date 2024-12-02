import { z } from 'zod';
import { TreePath } from '../../engine/state/path/TreePath.js';

/* ------------------------------------------
   $alias string value
--------------------------------------------- */
export const specifyAliasStringValueSchema = z
  .string()
  .min(1)
  .refine(value => {
    // a regex to match a "." separated string where no part is empty
    const regex = /^((?!\.)(?!.*\.\.)(?!.*\.$)[^.]+\.)*((?!\.)(?!.*\.\.)(?!.*\.$)[^.]+)$/;
    return regex.test(value);
  });
export type SpecifyAliasStringValue = z.infer<typeof specifyAliasStringValueSchema>;

/* ------------------------------------------
   Top level alias
--------------------------------------------- */
export const specifyTopLevelAliasSignatureSchema = z
  .object({
    $alias: specifyAliasStringValueSchema,
  })
  .strict();

export type SpecifyTopLevelAliasSignature = z.infer<typeof specifyTopLevelAliasSignatureSchema>;

export type SpecifyTopLevelAliasSignatureSchema = typeof specifyTopLevelAliasSignatureSchema;

export type WithTopLevelAlias<T> = T | SpecifyTopLevelAliasSignature;

export function matchIsTopLevelAliasSignature(
  value: unknown,
): value is SpecifyTopLevelAliasSignature {
  if (
    value !== null &&
    !Array.isArray(value) &&
    typeof value === 'object' &&
    '$alias' in value &&
    !('$mode' in value)
  ) {
    return (
      specifyAliasStringValueSchema.safeParse((value as { $alias: string }).$alias).success ?? false
    );
  }
  return false;
}

/* ------------------------------------------
   Mode and Value level alias
--------------------------------------------- */
export const specifyModeAndValueLevelAliasSignatureSchema = z
  .object({
    $alias: specifyAliasStringValueSchema,
    $mode: z.string(),
  })
  .strict();

export type SpecifyModeAndValueLevelAliasSignature<Mode extends string = string> = {
  $alias: string;
  $mode: Mode;
};

export type SpecifyModeAndValueLevelAliasSignatureSchema =
  typeof specifyModeAndValueLevelAliasSignatureSchema;

export type WithModeAndValueLevelAlias<T, Mode extends string = string> =
  | T
  | SpecifyModeAndValueLevelAliasSignature<Mode>;

export function matchIsModeAndValueLevelAliasSignature(
  value: unknown,
): value is SpecifyModeAndValueLevelAliasSignature {
  if (
    value !== null &&
    !Array.isArray(value) &&
    typeof value === 'object' &&
    '$alias' in value &&
    '$mode' in value &&
    typeof (value as { $mode: unknown }).$mode === 'string'
  ) {
    return (
      specifyAliasStringValueSchema.safeParse((value as { $alias: string }).$alias).success ?? false
    );
  }
  return false;
}

/* ------------------------------------------
   Any alias
--------------------------------------------- */
export type SpecifyDesignTokenAliasSignature<Mode extends string = string> =
  | SpecifyModeAndValueLevelAliasSignature<Mode>
  | SpecifyTopLevelAliasSignature;

export function matchIsDesignTokenAliasSignature(
  value: unknown,
): value is SpecifyDesignTokenAliasSignature {
  if (value !== null && !Array.isArray(value) && typeof value === 'object' && '$alias' in value) {
    return (
      specifyAliasStringValueSchema.safeParse((value as { $alias: string }).$alias).success ?? false
    );
  }
  return false;
}

export function stripDesignTokenAliasValue(rawAlias: SpecifyDesignTokenAliasSignature) {
  const alias = rawAlias.$alias;
  let isTopLevelAlias = false;
  let mode;
  if (matchIsModeAndValueLevelAliasSignature(rawAlias)) {
    mode = rawAlias.$mode;
  } else {
    isTopLevelAlias = true;
  }
  const splitAlias = TreePath.fromString(alias);
  return {
    isTopLevelAlias,
    alias,
    mode,
    currentPath: splitAlias,
    designTokenName: splitAlias.tail(),
  };
}
