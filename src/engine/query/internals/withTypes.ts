import { z } from 'zod';

import { specifyDesignTokenTypeNameSchema } from '../../../definitions/designTokenDefinitions.js';

export const tokenTypesSelectorSchema = z
  .object({
    include: z.array(specifyDesignTokenTypeNameSchema).optional(),
    exclude: z.array(specifyDesignTokenTypeNameSchema).optional(),
  })
  .optional()
  .refine(
    value => {
      if (!value) return true;
      return value.include !== undefined || value.exclude !== undefined;
    },
    {
      message: 'withTypes must include either `include` or `exclude`',
    },
  );
export type TokenTypesSelector = z.infer<typeof tokenTypesSelectorSchema>;

export const withTypesSchema = z.object({
  withTypes: tokenTypesSelectorSchema,
});

export type NodeWithTypes = z.infer<typeof withTypesSchema>;
