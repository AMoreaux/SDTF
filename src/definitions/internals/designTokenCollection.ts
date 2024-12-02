import { z } from 'zod';
import { treeNodeCommonPropertiesSchema } from './designTokenTree.js';

import { specifyDesignTokenValueModeSchema } from './designTokenMode.js';

const collectionSettingsSchema = z
  .object({
    $modes: z.array(specifyDesignTokenValueModeSchema).nonempty(),
  })
  .strict();

export type SpecifyCollectionSettings = z.infer<typeof collectionSettingsSchema>;

export const specifyCollectionPropertiesSchema = z
  .object({
    $collection: collectionSettingsSchema,
  })
  .merge(treeNodeCommonPropertiesSchema);

export type SpecifyDesignTokenCollectionProperties = z.infer<
  typeof specifyCollectionPropertiesSchema
>;

export function matchIsSpecifyCollection(
  maybeCollection: unknown,
): maybeCollection is SpecifyDesignTokenCollectionProperties {
  if (
    !Array.isArray(maybeCollection) &&
    typeof maybeCollection === 'object' &&
    maybeCollection !== null &&
    '$collection' in maybeCollection &&
    typeof (maybeCollection as { $collection: unknown }).$collection === 'object'
  ) {
    return true;
  }
  return false;
}
