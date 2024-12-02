import { describe, it, expect } from 'vitest';

import { SDTFError } from '../../../../src/index.js';

import { ValuePath } from '../../../../src/engine/state/path/ValuePath.js';

describe.concurrent('ValuePath', () => {
  describe.concurrent('static empty', () => {
    it('should create an empty ValuePath', () => {
      const valuePath = ValuePath.empty();

      expect(valuePath.toArray()).toEqual([]);
      expect(valuePath.toString()).toEqual('');
    });
  });
  describe.concurrent('constructor', () => {
    it('should create a ValuePath with given array and string', () => {
      const path = ['path1', 2];
      const string = 'path1.2';

      const valuePath = new ValuePath(path, string);

      expect(valuePath.toArray()).toStrictEqual(path);
      expect(valuePath.toString()).toStrictEqual(string);
    });
    it('should create a ValuePath with given array and generate string', () => {
      const path = ['path1', 2];

      const valuePath = new ValuePath(path);

      expect(valuePath.toArray()).toStrictEqual(path);
      expect(valuePath.toString()).toStrictEqual('path1.2');
    });
    it('EDGE CASE - should allow an arbitrary string to be passed', () => {
      const path = ['path1', 2];
      const string = 'arbitraryString';

      const valuePath = new ValuePath(path, string);

      expect(valuePath.toString()).toStrictEqual(string);
    });
    it('should throw an error if path is not an array', () => {
      const path = 'invalidPath';

      expect(
        () =>
          new ValuePath(
            // @ts-expect-error
            path,
          ),
      ).toThrow(SDTFError);
    });
    it('should throw an error if path item is not a string or number', () => {
      const path = ['path1', {}];

      expect(
        () =>
          new ValuePath(
            // @ts-expect-error
            path,
          ),
      ).toThrow(SDTFError);
    });
  });
  describe.concurrent('get isModeLevel', () => {
    it('should return true when ValuePath is empty', () => {
      const path: Array<string | number> = [];
      const valuePath = new ValuePath(path);

      expect(valuePath.isModeLevel).toBe(true);
    });
    it('should return false when ValuePath is not empty', () => {
      const path = ['path1', 'path2'];
      const valuePath = new ValuePath(path);

      expect(valuePath.isModeLevel).toBe(false);
    });
  });
  describe.concurrent('update', () => {
    it('should update the path of ValuePath with mixed path items', () => {
      const path = ['path1', 1];
      const newPath = ['path3', 2];
      const valuePath = new ValuePath(path);

      valuePath.update(newPath);

      expect(valuePath.toArray()).toStrictEqual(newPath);
      expect(valuePath.toString()).toStrictEqual('path3.2');
    });
    it('should update the path of ValuePath with number path items', () => {
      const path = [1, 2];
      const newPath = [3, 4];
      const valuePath = new ValuePath(path);

      valuePath.update(newPath);

      expect(valuePath.toArray()).toStrictEqual(newPath);
      expect(valuePath.toString()).toStrictEqual('3.4');
    });
  });
  describe.concurrent('prepend', () => {
    it('should prepend an item to the path of ValuePath with string path items', () => {
      const path = ['path1', 'path2'];
      const item = 'path0';
      const valuePath = new ValuePath(path);

      valuePath.prepend(item);

      expect(valuePath.toArray()).toStrictEqual(['path0', 'path1', 'path2']);
    });
    it('should prepend an item to the path of ValuePath with number path items', () => {
      const path = [1, 2];
      const item = 0;
      const valuePath = new ValuePath(path);

      valuePath.prepend(item);

      expect(valuePath.toArray()).toStrictEqual([0, 1, 2]);
    });
    it('should prepend an item to the path of ValuePath with empty path', () => {
      const path: Array<string | number> = [];
      const item = 'path0';
      const valuePath = new ValuePath(path);

      valuePath.prepend(item);

      expect(valuePath.toArray()).toStrictEqual([item]);
    });
  });
  describe.concurrent('append', () => {
    it('should append an item to the path of ValuePath with string path items', () => {
      const path = ['path1', 'path2'];
      const item = 'path3';
      const valuePath = new ValuePath(path);

      valuePath.append(item);

      expect(valuePath.toArray()).toStrictEqual(['path1', 'path2', 'path3']);
    });
    it('should append an item to the path of ValuePath with number path items', () => {
      const path = [1, 2];
      const item = 3;
      const valuePath = new ValuePath(path);

      valuePath.append(item);

      expect(valuePath.toArray()).toStrictEqual([1, 2, 3]);
    });
    it('should append an item to the path of ValuePath with empty path', () => {
      const path: Array<string | number> = [];
      const item = 'path0';
      const valuePath = new ValuePath(path);

      valuePath.append(item);

      expect(valuePath.toArray()).toStrictEqual([item]);
    });
  });
  describe.concurrent('replaceAt', () => {
    it('should replace an item at a specific index in ValuePath with string path items', () => {
      const path = ['path1', 'path2'];
      const replacer = 'path3';
      const valuePath = new ValuePath(path);

      valuePath.replaceAt(1, replacer);

      expect(valuePath.toArray()).toEqual(['path1', 'path3']);
    });
    it('should replace an item at a specific index in ValuePath with number path items', () => {
      const path = [1, 2];
      const replacer = 3;
      const valuePath = new ValuePath(path);

      valuePath.replaceAt(1, replacer);

      expect(valuePath.toArray()).toEqual([1, 3]);
    });
  });
  describe.concurrent('removeLeft', () => {
    it('should remove the root from ValuePath with string path items', () => {
      const path = ['path1', 'path2', 'path3'];
      const valuePath = new ValuePath(path);

      valuePath.removeLeft(2);

      expect(valuePath.toArray()).toEqual(['path3']);
    });
    it('should remove the root from ValuePath with number path items', () => {
      const path = [1, 2, 3];
      const valuePath = new ValuePath(path);

      valuePath.removeLeft(2);

      expect(valuePath.toArray()).toEqual([3]);
    });
  });
  describe.concurrent('removeRight', () => {
    it('should remove the suffix from ValuePath with string path items', () => {
      const path = ['path1', 'path2', 'path3'];
      const valuePath = new ValuePath(path);

      valuePath.removeRight(2);

      expect(valuePath.toArray()).toEqual(['path1']);
    });
    it('should remove the suffix from ValuePath with number path items', () => {
      const path = [1, 2, 3];
      const valuePath = new ValuePath(path);

      valuePath.removeRight(2);

      expect(valuePath.toArray()).toEqual([1]);
    });
  });
  describe.concurrent('clone', () => {
    it('should create a clone of ValuePath with mixed path items', () => {
      const path = ['path1', 2];
      const string = 'path1.2';

      const valuePath = new ValuePath(path, string);
      const clonedValuePath = valuePath.clone();

      expect(clonedValuePath.toArray()).toStrictEqual(valuePath.toArray());
      expect(clonedValuePath.toString()).toStrictEqual(valuePath.toString());
    });
    it('should not affect the original ValuePath when modifying the clone', () => {
      const path = ['path1', 2];
      const string = 'path1.2';

      const valuePath = new ValuePath(path, string);
      const clonedValuePath = valuePath.clone();

      clonedValuePath.append('path3');

      expect(clonedValuePath.toArray()).not.toStrictEqual(valuePath.toArray());
      expect(clonedValuePath.toString()).not.toStrictEqual(valuePath.toString());
    });
  });
  describe.concurrent('merge', () => {
    it('should merge two ValuePaths when original ValuePath is empty', () => {
      const path1: Array<string | number> = [];
      const path2 = ['path1', 2];
      const valuePath1 = new ValuePath(path1);
      const valuePath2 = new ValuePath(path2);

      const mergedValuePath = valuePath1.merge(valuePath2);

      expect(mergedValuePath.toArray()).toEqual(valuePath2.toArray());
      expect(mergedValuePath.toString()).toEqual(valuePath2.toString());
    });
    it('should merge two ValuePaths when original ValuePath is not empty', () => {
      const path1 = ['path1', 2];
      const path2 = ['path3', 4];
      const valuePath1 = new ValuePath(path1);
      const valuePath2 = new ValuePath(path2);

      const mergedValuePath = valuePath1.merge(valuePath2);

      expect(mergedValuePath.toArray()).toEqual([...path1, ...path2]);
      expect(mergedValuePath.toString()).toEqual(
        `${valuePath1.toString()}.${valuePath2.toString()}`,
      );
    });
    it('should prevent the merged ValuePath from being modified when the original ValuePath is empty', () => {
      const path1: Array<string | number> = [];
      const path2 = ['path1', 2];
      const valuePath1 = new ValuePath(path1);
      const valuePath2 = new ValuePath(path2);

      const mergedValuePath = valuePath1.merge(valuePath2);

      valuePath2.append('path4');

      expect(valuePath2.toArray()).toStrictEqual(['path1', 2, 'path4']);

      mergedValuePath.append('path3');

      expect(mergedValuePath.toArray()).toStrictEqual(['path1', 2, 'path3']);
    });
  });
  describe.concurrent('makeParentPath', () => {
    it('should return the parent path of ValuePath with string path items', () => {
      const path = ['path1', 'path2', 'path3'];
      const valuePath = new ValuePath(path);

      const parentPath = valuePath.makeParentPath();

      expect(parentPath.toArray()).toEqual(['path1', 'path2']);
    });
    it('should return the parent path of ValuePath with number path items', () => {
      const path = [1, 2, 3];
      const valuePath = new ValuePath(path);

      const parentPath = valuePath.makeParentPath();

      expect(parentPath.toArray()).toEqual([1, 2]);
    });
    it('should return an empty ValuePath when original ValuePath has only one item', () => {
      const path = ['path1'];
      const valuePath = new ValuePath(path);

      const parentPath = valuePath.makeParentPath();

      expect(parentPath.toArray()).toEqual([]);
    });
  });
  describe.concurrent('slice', () => {
    it('should return a sliced ValuePath with string path items', () => {
      const path = ['path1', 'path2', 'path3'];
      const valuePath = new ValuePath(path);

      const slicedValuePath = valuePath.slice(1, 3);

      expect(slicedValuePath.toArray()).toEqual(['path2', 'path3']);
    });
    it('should return a sliced ValuePath with number path items', () => {
      const path = [1, 2, 3];
      const valuePath = new ValuePath(path);

      const slicedValuePath = valuePath.slice(1, 3);

      expect(slicedValuePath.toArray()).toEqual([2, 3]);
    });
    it('should return an empty ValuePath when slicing outside the range', () => {
      const path = ['path1', 'path2', 'path3'];
      const valuePath = new ValuePath(path);

      const slicedValuePath = valuePath.slice(3, 5);

      expect(slicedValuePath.toArray()).toEqual([]);
    });
  });
});
