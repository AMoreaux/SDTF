import { AnalyzedSDTFNode } from './AnalyzedSDTFNode.js';
import {
  SpecifyDesignTokenGroupProperties,
  specifyGroupPropertiesSchema,
  treeNodeNameSchema,
} from '../../../definitions/index.js';
import { TreePath } from '../../state/path/TreePath.js';

export type AnalyzedGroup = AnalyzedSDTFNode & SpecifyDesignTokenGroupProperties;

export function parseRawGroup(
  path: TreePath,
  rawGroup: SpecifyDesignTokenGroupProperties,
): AnalyzedGroup {
  const { $description, $extensions } = specifyGroupPropertiesSchema.parse(rawGroup, {
    path: path.toArray(),
  });

  const extractedName = path.tail();
  const name = treeNodeNameSchema.parse(extractedName, { path: path.toArray() });

  return {
    path,
    name,
    $description: $description,
    $extensions: $extensions,
  };
}
