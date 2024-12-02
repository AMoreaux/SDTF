import { describe, it, expect } from 'vitest';

import { SDTF_PATH_SEPARATOR, SDTFError } from '../../../../src/index.js';

import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('TreePath', () => {
  describe.concurrent('static empty', () => {
    it('should create an empty TreePath', () => {
      const treePath = TreePath.empty();

      expect(treePath.toArray()).toStrictEqual([]);
      expect(treePath.toString()).toStrictEqual('');
    });
  });
  describe.concurrent('static fromJsonValuePath', () => {
    it('should create a TreePath from a JSON value path with string items', () => {
      const jsonValuePath = ['path1', 'path2'];
      const treePath = TreePath.fromJsonValuePath(jsonValuePath);

      expect(treePath.toArray()).toStrictEqual(jsonValuePath);
      expect(treePath.toString()).toStrictEqual(jsonValuePath.join(SDTF_PATH_SEPARATOR));
    });
    it('should throw an error when JSON value path contains non-string items', () => {
      const jsonValuePath = ['path1', 2];

      expect(() => TreePath.fromJsonValuePath(jsonValuePath)).toThrow(SDTFError);
    });
  });
  describe.concurrent('static fromString', () => {
    it('should create a TreePath from a string representation', () => {
      const stringPath = 'path1.path2';
      const treePath = TreePath.fromString(stringPath);

      expect(treePath.toArray()).toStrictEqual(stringPath.split(SDTF_PATH_SEPARATOR));
      expect(treePath.toString()).toStrictEqual(stringPath);
    });
    it('should create an empty TreePath from an empty string', () => {
      const stringPath = '';
      const treePath = TreePath.fromString(stringPath);

      expect(treePath.toArray()).toStrictEqual([]);
      expect(treePath.toString()).toStrictEqual('');
    });
  });
  describe.concurrent('constructor', () => {
    it('should create a TreePath with valid string array', () => {
      const path = ['path1', 'path2'];
      const treePath = new TreePath(path);

      expect(treePath.toArray()).toStrictEqual(path);
      expect(treePath.toString()).toStrictEqual(path.join(SDTF_PATH_SEPARATOR));
    });
    it('should throw an error with invalid path', () => {
      const path = ['path1', 2];

      expect(
        () =>
          new TreePath(
            // @ts-expect-error
            path,
          ),
      ).toThrow(SDTFError);
    });
  });
  describe.concurrent('get isRoot', () => {
    it('should return true for root level TreePath', () => {
      const treePath = TreePath.empty();

      expect(treePath.isRoot).toBe(true);
    });
    it('should return false for non-root level TreePath', () => {
      const path = ['path1'];
      const treePath = new TreePath(path);

      expect(treePath.isRoot).toBe(false);
    });
  });
  describe.concurrent('update', () => {
    it('should update the TreePath with valid string array', () => {
      const path = ['path1', 'path2'];
      const newPath = ['path3', 'path4'];
      const treePath = new TreePath(path);

      treePath.update(newPath);

      expect(treePath.toArray()).toStrictEqual(newPath);
      expect(treePath.toString()).toStrictEqual(newPath.join(SDTF_PATH_SEPARATOR));
    });
    it('should throw an error with invalid path', () => {
      const path = ['path1', 'path2'];
      const newPath = ['path3', 2];
      const treePath = new TreePath(path);

      expect(() =>
        treePath.update(
          // @ts-expect-error
          newPath,
        ),
      ).toThrow(SDTFError);
    });
  });
  describe.concurrent('prepend', () => {
    it('should prepend an item to the TreePath', () => {
      const path = ['path1', 'path2'];
      const item = 'path0';
      const treePath = new TreePath(path);

      treePath.prepend(item);

      expect(treePath.toArray()).toStrictEqual(['path0', 'path1', 'path2']);
    });
    it('should throw an error when prepending a non-string item', () => {
      const path = ['path1', 'path2'];
      const item = 2;
      const treePath = new TreePath(path);

      expect(() =>
        treePath.prepend(
          // @ts-expect-error
          item,
        ),
      ).toThrow(SDTFError);
    });
  });
  describe.concurrent('append', () => {
    it('should append an item to the TreePath', () => {
      const path = ['path1', 'path2'];
      const item = 'path3';
      const treePath = new TreePath(path);

      treePath.append(item);

      expect(treePath.toArray()).toStrictEqual(['path1', 'path2', 'path3']);
    });
    it('should throw an error when appending a non-string item', () => {
      const path = ['path1', 'path2'];
      const item = 3;
      const treePath = new TreePath(path);

      expect(() =>
        treePath.append(
          // @ts-expect-error
          item,
        ),
      ).toThrow(SDTFError);
    });
  });
  describe.concurrent('removeLeft', () => {
    it('should remove the root from the TreePath', () => {
      const path = ['path1', 'path2', 'path3'];
      const treePath = new TreePath(path);

      treePath.removeLeft(1);

      expect(treePath.toArray()).toStrictEqual(['path2', 'path3']);
    });
    it('should empty the TreePath when removing root with index out of range', () => {
      const path = ['path1', 'path2', 'path3'];
      const treePath = new TreePath(path);

      treePath.removeLeft(3);

      expect(treePath.toArray()).toStrictEqual([]);
    });
  });
  describe.concurrent('removeRight', () => {
    it('should remove the suffix from the TreePath', () => {
      const path = ['path1', 'path2', 'path3'];
      const treePath = new TreePath(path);

      treePath.removeRight(1);

      expect(treePath.toArray()).toStrictEqual(['path1', 'path2']);
    });
    it('should empty the TreePath when removing suffix with index out of range', () => {
      const path = ['path1', 'path2', 'path3'];
      const treePath = new TreePath(path);

      treePath.removeRight(3);

      expect(treePath.toArray()).toStrictEqual([]);
    });
  });
  describe.concurrent('replaceAt', () => {
    it('should replace an item at a specific index in TreePath', () => {
      const path = ['path1', 'path2'];
      const replacer = 'path3';
      const treePath = new TreePath(path);

      treePath.replaceAt(1, replacer);

      expect(treePath.toArray()).toEqual(['path1', 'path3']);
    });
    it('should throw an error when replacing with a non-string item', () => {
      const path = ['path1', 'path2'];
      const replacer = 3;
      const treePath = new TreePath(path);

      expect(() =>
        treePath.replaceAt(
          1,
          //@ts-expect-error
          replacer,
        ),
      ).toThrow(SDTFError);
    });
  });
  describe.concurrent('clone', () => {
    it('should create a clone of the TreePath', () => {
      const path = ['path1', 'path2'];
      const treePath = new TreePath(path);

      const clonedTreePath = treePath.clone();

      expect(clonedTreePath.toArray()).toEqual(treePath.toArray());
      expect(clonedTreePath).not.toBe(treePath);

      treePath.append('path3');

      expect(clonedTreePath.toArray()).not.toEqual(treePath.toArray());
    });
  });
  describe.concurrent('merge', () => {
    it('should merge two TreePaths', () => {
      const path1 = ['path1', 'path2'];
      const path2 = ['path3', 'path4'];
      const treePath1 = new TreePath(path1);
      const treePath2 = new TreePath(path2);

      const mergedTreePath = treePath1.merge(treePath2);

      expect(mergedTreePath.toArray()).toEqual([...path1, ...path2]);
    });
    it('should return the other TreePath when merging with an empty TreePath', () => {
      const path = ['path1', 'path2'];
      const treePath = new TreePath(path);
      const emptyTreePath = TreePath.empty();

      const mergedTreePath = emptyTreePath.merge(treePath);

      expect(mergedTreePath.toArray()).toEqual(treePath.toArray());
    });
    it('should prevent the merged TreePath from being modified when the original TreePath is empty', () => {
      const path = ['path1', 'path2'];
      const treePath = new TreePath(path);
      const emptyTreePath = TreePath.empty();

      const mergedTreePath = emptyTreePath.merge(treePath);

      treePath.append('path3');

      expect(mergedTreePath.toArray()).not.toEqual(treePath.toArray());
    });
  });
  describe.concurrent('slice', () => {
    it('should return a sliced TreePath', () => {
      const path = ['path1', 'path2', 'path3'];
      const treePath = new TreePath(path);

      const slicedTreePath = treePath.slice(1, 3);

      expect(slicedTreePath.toArray()).toEqual(['path2', 'path3']);
    });
    it('should return an empty TreePath when slicing outside the range', () => {
      const path = ['path1', 'path2', 'path3'];
      const treePath = new TreePath(path);

      const slicedTreePath = treePath.slice(3, 5);

      expect(slicedTreePath.toArray()).toEqual([]);
    });
  });
  describe.concurrent('makeParentPath', () => {
    it('should return the parent path of TreePath', () => {
      const path = ['path1', 'path2', 'path3'];
      const treePath = new TreePath(path);

      const parentPath = treePath.makeParentPath();

      expect(parentPath.toArray()).toEqual(['path1', 'path2']);
    });
    it('should return an empty TreePath when original TreePath has only one item', () => {
      const path = ['path1'];
      const treePath = new TreePath(path);

      const parentPath = treePath.makeParentPath();

      expect(parentPath.toArray()).toEqual([]);
    });
  });
});
