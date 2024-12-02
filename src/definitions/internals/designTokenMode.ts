import { z } from 'zod';

export const SDTF_DEFAULT_MODE = 'default';
export type SpecifyDesignTokenDefaultMode = typeof SDTF_DEFAULT_MODE;

export const specifyDesignTokenValueModeSchema = z
  .string({
    invalid_type_error: '$mode must be a string',
    required_error: '$mode is required',
  })
  .min(1, '$mode must be a non-empty string')
  .refine(
    value => {
      return !value.startsWith('$');
    },
    {
      message: '$mode cannot start with a "$"',
    },
  );

/**
 * @deprecated - Not flexible enough, use `specifyDesignTokenValueModeSchema` instead
 * @param mode
 */
export function validateSpecifyDesignTokenValueMode(mode: unknown): SpecifyDesignTokenValueMode {
  return specifyDesignTokenValueModeSchema.parse(mode);
}

export type SpecifyDesignTokenValueMode = z.infer<typeof specifyDesignTokenValueModeSchema>;
