import { z } from 'zod';
import { shallowJSONLiteralSchema } from '../../utils/shallowJSONLiteralSchema.js';
import { PrimitivesWithBasicRecordAndArray } from '../../utils/typeUtils.js';
import { TreePath } from '../../engine/state/path/TreePath.js';
import { SDTF_PATH_SEPARATOR } from './designTokenTreeConstants.js';

/* ------------------------------------------
   TreePath management
--------------------------------------------- */
export const treePathSchema = z.instanceof(TreePath);

/* ------------------------------------------
   TreeNode name validation
--------------------------------------------- */
export const treeNodeNameSchema = z
  .string()
  .min(1, {
    message: 'Token or Group name must be at least 1 character long.',
  })
  .refine(value => !value.includes(SDTF_PATH_SEPARATOR), {
    message: "Token or Group name cannot contain the '.' (dot) character.",
  });

/**
 * @deprecated - Not flexible enough, use `treeNodeNameSchema` instead
 */
export function validateTreeNodeName(tokenOrGroupName: string) {
  return treeNodeNameSchema.parse(tokenOrGroupName);
}

/* ------------------------------------------
   Tree node common properties
--------------------------------------------- */
export const treeNodeDescriptionSchema = z.string().optional();
export type TreeNodeDescription = z.infer<typeof treeNodeDescriptionSchema>;
export function validateTreeNodeDescription(description: unknown) {
  return treeNodeDescriptionSchema.parse(description);
}

export const treeNodeExtensionsSchema = z.record(z.string(), shallowJSONLiteralSchema).optional();
export type TreeNodeExtensions = z.infer<typeof treeNodeExtensionsSchema>;
export function validateTreeNodeExtensions(extensions: unknown) {
  return treeNodeExtensionsSchema.parse(extensions);
}

export const treeNodeCommonPropertiesSchema = z.object({
  $description: treeNodeDescriptionSchema,
  $extensions: treeNodeExtensionsSchema,
});
/**
 * @deprecated - Not flexible enough, use `treeNodeCommonPropertiesSchema` instead
 */
export function validateTreeNodeCommonProperties(commonProperties: unknown) {
  return treeNodeCommonPropertiesSchema.parse(commonProperties);
}
/* ------------------------------------------
   Tree root node validation
--------------------------------------------- */
export type SpecifyRawDesignTokenTree = Record<string, PrimitivesWithBasicRecordAndArray>;

const rootNodeSchema = z.record(z.string(), shallowJSONLiteralSchema, {
  invalid_type_error: 'tokenTree root node must be a JSON object.',
});
export function validateDesignTokenTreeRootNode(rootNode: unknown) {
  return rootNodeSchema.parse(rootNode) as unknown as SpecifyRawDesignTokenTree;
}
