import { z } from 'zod';

import type { SpecifyDesignTokenFormat } from '../definitions/index.js';
import { SerializedView, serializedViewSchema } from './state/ViewState.js';

export const sdtfEngineSerializedMetadataSchema = z
  .object({
    activeViewName: z.string().nullable(),
    views: z.array(serializedViewSchema),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.views.length === 0 && value.activeViewName !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'activeViewName must be null when views is empty',
        path: ['activeViewName'],
      });
    }
    const accViewNames = new Set<string>();
    for (const view of value.views) {
      if (accViewNames.has(view.name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Duplicate view name: "${view.name}"`,
          path: ['views'],
        });
      }
      accViewNames.add(view.name);
    }

    if (
      value.activeViewName !== null &&
      accViewNames.size > 0 &&
      !accViewNames.has(value.activeViewName)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `activeViewName "${value.activeViewName}" must be null or one of the view names`,
        path: ['activeViewName'],
      });
    }

    return value;
  });

export type SDTFEngineSerializedMetadata = {
  activeViewName: string | null;
  views: Array<SerializedView>;
};

export type SDTFEngineSerializedState = {
  tokenTree: SpecifyDesignTokenFormat;
  metadata: SDTFEngineSerializedMetadata;
};
