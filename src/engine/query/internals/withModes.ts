import { z } from 'zod';

export const modesSelectorSchema = z
  .object({
    include: z.array(z.string()).optional(),
    exclude: z.array(z.string()).optional(),
  })
  .optional()
  .refine(
    value => {
      if (!value) return true;
      return value.include !== undefined || value.exclude !== undefined;
    },
    {
      message: 'withModes must include either `include` or `exclude`',
    },
  );
export type ModesSelector = z.infer<typeof modesSelectorSchema>;

export const withModesSchema = z.object({
  withModes: modesSelectorSchema,
});
export type NodeWithModes = z.infer<typeof withModesSchema>;
