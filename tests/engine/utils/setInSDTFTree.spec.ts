import { describe, it, expect } from 'vitest';

import { setInSDTFTree } from '../../../src/engine/utils/setInSDTFTree.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('setInSDTFTree', () => {
  it('should set a value in an empty object', () => {
    const mutableRecord = {};
    setInSDTFTree(mutableRecord, new TreePath(['a', 'b', 'c']), 'd');
    expect(mutableRecord).toStrictEqual({ a: { b: { c: 'd' } } });
  });
  it('should set a value in an existing object', () => {
    const mutableRecord = { a: { b: { c: 'd' } } };
    setInSDTFTree(mutableRecord, new TreePath(['a', 'b', 'e']), 'f');
    expect(mutableRecord).toStrictEqual({ a: { b: { c: 'd', e: 'f' } } });
  });
  it('should add a value in an array', () => {
    const mutableRecord = { a: [1, 2] };
    setInSDTFTree(mutableRecord, new TreePath(['a', '2']), 3);
    expect(mutableRecord).toStrictEqual({ a: [1, 2, 3] });
  });
  it('should update a value in an array', () => {
    const mutableRecord = { a: [1, 2] };
    setInSDTFTree(mutableRecord, new TreePath(['a', '1']), 3);
    expect(mutableRecord).toStrictEqual({ a: [1, 3] });
  });
  it('should replace the mutable record if path is `[]` and value an object', () => {
    const mutableRecord = { a: { b: { c: 'd' } } };
    setInSDTFTree(mutableRecord, new TreePath([]), { someObject: true });
    expect(mutableRecord).toStrictEqual({ someObject: true });
  });
  it('should fail replacing the mutable record if path is `[]` and value is not an object', () => {
    const mutableRecord = {};

    expect(() => setInSDTFTree(mutableRecord, new TreePath([]), [])).toThrow(
      'Cannot set value of type "array" to root of object',
    );
    expect(() => setInSDTFTree(mutableRecord, new TreePath([]), 'a string')).toThrow(
      'Cannot set value of type "string" to root of object',
    );
    expect(() => setInSDTFTree(mutableRecord, new TreePath([]), 1)).toThrow(
      'Cannot set value of type "number" to root of object',
    );
  });
});
