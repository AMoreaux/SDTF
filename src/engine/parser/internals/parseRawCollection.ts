import { AnalyzedSDTFNode } from './AnalyzedSDTFNode.js';
import {
  specifyCollectionPropertiesSchema,
  SpecifyDesignTokenCollectionProperties,
  treeNodeNameSchema,
} from '../../../definitions/index.js';
import { TreePath } from '../../state/path/TreePath.js';

export type AnalyzedCollection = AnalyzedSDTFNode &
  SpecifyDesignTokenCollectionProperties & {
    allowedModes: Array<string>;
  };

export function parseRawCollection(
  path: TreePath,
  rawCollection: SpecifyDesignTokenCollectionProperties,
): AnalyzedCollection {
  const { $description, $extensions, $collection } = specifyCollectionPropertiesSchema.parse(
    rawCollection,
    { path: path.toArray() },
  );

  const extractedName = path.tail();
  const name = treeNodeNameSchema.parse(extractedName, { path: path.toArray() });

  return {
    path,
    name,
    $description: $description,
    $extensions: $extensions,
    $collection: $collection,
    allowedModes: $collection.$modes,
  };
}
