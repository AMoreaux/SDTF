import { z } from 'zod';

import { treeNodeCommonPropertiesSchema } from './designTokenTree.js';

export const specifyGroupPropertiesSchema = treeNodeCommonPropertiesSchema;
export type SpecifyDesignTokenGroupProperties = z.infer<typeof specifyGroupPropertiesSchema>;

/**
 * @deprecated - Not flexible enough, use `specifyGroupPropertiesSchema` instead
 */
export function validateSpecifyDesignTokenGroupProperties(value: unknown) {
  return specifyGroupPropertiesSchema.parse(value);
}
