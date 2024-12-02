import { deepSetJSONValue } from '../../utils/deepSetJSONValue.js';
import { ValuePath } from '../state/path/ValuePath.js';

export function createValueToTraverseFromPrefix(prefixValuePath: ValuePath, nextValue: any) {
  const prefixPath = prefixValuePath.toArray();

  let valueToTraverse;
  if (prefixPath.length === 0) {
    valueToTraverse = nextValue;
  } else {
    const host = typeof prefixPath[0] === 'number' ? [] : {};
    deepSetJSONValue(host, prefixPath, nextValue);
    valueToTraverse = host;
  }

  return valueToTraverse;
}
