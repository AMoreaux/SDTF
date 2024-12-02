import { JSONObject, JSONValuePath } from '../../../utils/JSONDefinitions.js';
import {
  matchIsDesignTokenSignature,
  matchIsSpecifyCollection,
  SpecifyDesignTokenCollectionProperties,
  SpecifyDesignTokenGroupProperties,
  SpecifyDesignTokenSignature,
} from '../../../definitions/index.js';
import { traverseJSONValue } from '../../../utils/traverseJSONValue.js';
import { getArrayTail } from '../../../utils/getArrayTail.js';

export function traverseTokenTree(
  tokenTree: JSONObject,
  {
    onToken,
    onCollection,
    onGroup,
  }: {
    onToken: (path: JSONValuePath, rawToken: SpecifyDesignTokenSignature) => void;
    onCollection: (
      path: JSONValuePath,
      collectionProperties: SpecifyDesignTokenCollectionProperties,
    ) => void;
    onGroup: (path: JSONValuePath, groupProperties: SpecifyDesignTokenGroupProperties) => void;
  },
) {
  traverseJSONValue(tokenTree, (value, path) => {
    if (matchIsDesignTokenSignature(value)) {
      onToken(path, value);
      return false;
    }
    if (matchIsSpecifyCollection(value)) {
      const { $collection, $description, $extensions } = value;
      onCollection(path, { $collection, $description, $extensions });
      return true;
    }
    if (path.length === 0) {
      // Skipping root group
      return true;
    }
    if (getArrayTail(path) === '$collection') {
      // Skipping the Collection settings object: { $collection: { $modes: [...] } }
      return false;
    }
    if (getArrayTail(path) === '$extensions') {
      // Skipping the $extensions object
      return false;
    }
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      onGroup(path, value);
      return true;
    }
    return true;
  });
}
