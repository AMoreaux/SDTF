import { SDTFError } from '../../errors/index.js';
import { TreePath } from '../state/path/TreePath.js';

export function setInSDTFTree(mutableRecord: Record<string, any>, path: TreePath, value: unknown) {
  if (path.length === 0) {
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      Object.keys(mutableRecord).forEach(key => {
        Reflect.deleteProperty(mutableRecord, key);
      });
      Object.entries(value).forEach(([key, value]) => {
        Reflect.set(mutableRecord, key, value);
      });
    } else {
      const isArray = Array.isArray(value);
      throw new SDTFError(
        'SDTF_INTERNAL_DESIGN_ERROR',
        `Cannot set value of type "${isArray ? 'array' : typeof value}" to root of object`,
      );
    }
  }

  for (const [i, key] of path.toArray().entries()) {
    if (Reflect.has(mutableRecord, key) === false) {
      Reflect.set(mutableRecord, key, {});
    }
    if (i === path.length - 1) {
      Reflect.set(mutableRecord, key, value);
    }
    mutableRecord = Reflect.get(mutableRecord, key);
  }
}
