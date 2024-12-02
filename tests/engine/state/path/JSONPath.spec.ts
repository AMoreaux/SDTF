import { describe, it, expect } from 'vitest';
import { JSONPath } from '../../../../src/engine/state/path/JSONPath.js';

describe.concurrent('JSONPath', () => {
  describe.concurrent('constructor', () => {
    it('should initialize with given path and string', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.toArray()).toEqual(path);
      expect(jsonPath.toString()).toEqual(string);
    });
    it('should handle empty path and string', () => {
      const path: Array<string | number> = [];
      const string = '';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.toArray()).toEqual(path);
      expect(jsonPath.toString()).toEqual(string);
    });
  });
  describe.concurrent('GET length', () => {
    it('should return the correct length', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.length).toEqual(2);
    });
    it('should return zero for empty path', () => {
      const path: Array<string | number> = [];
      const string = '';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.length).toEqual(0);
    });
  });
  describe.concurrent('isRootOf', () => {
    it('should return true if the path is root of the other path', () => {
      const path1 = new JSONPath(['path1', 'path2'], 'path1/path2');
      const path2 = new JSONPath(['path1', 'path2', 'path3'], 'path1/path2/path3');

      expect(path1.isRootOf(path2)).toBe(true);
    });
    it('should return false if the path is not root of the other path', () => {
      const path1 = new JSONPath(['path1', 'path2'], 'path1/path2');
      const path2 = new JSONPath(['path3', 'path4'], 'path3/path4');

      expect(path1.isRootOf(path2)).toBe(false);
    });
    it('should return true if both paths are identical', () => {
      const path1 = new JSONPath(['path1', 'path2'], 'path1/path2');
      const path2 = new JSONPath(['path1', 'path2'], 'path1/path2');

      expect(path1.isRootOf(path2)).toBe(true);
    });
    it('should return false if the other path is shorter', () => {
      const path1 = new JSONPath(['path1', 'path2', 'path3'], 'path1/path2/path3');
      const path2 = new JSONPath(['path1', 'path2'], 'path1/path2');

      expect(path1.isRootOf(path2)).toBe(false);
    });
  });
  describe.concurrent('isEqual', () => {
    it('should return true if paths are identical', () => {
      const path1 = new JSONPath(['path1', 'path2'], 'path1/path2');
      const path2 = new JSONPath(['path1', 'path2'], 'path1/path2');

      expect(path1.isEqual(path2)).toBe(true);
    });
    it('should return false if paths are not identical', () => {
      const path1 = new JSONPath(['path1', 'path2'], 'path1/path2');
      const path2 = new JSONPath(['path3', 'path4'], 'path3/path4');

      expect(path1.isEqual(path2)).toBe(false);
    });
  });
  describe.concurrent('isNotEqual', () => {
    it('should return false if paths are identical', () => {
      const path1 = new JSONPath(['path1', 'path2'], 'path1/path2');
      const path2 = new JSONPath(['path1', 'path2'], 'path1/path2');

      expect(path1.isNotEqual(path2)).toBe(false);
    });
    it('should return true if paths are not identical', () => {
      const path1 = new JSONPath(['path1', 'path2'], 'path1/path2');
      const path2 = new JSONPath(['path3', 'path4'], 'path3/path4');

      expect(path1.isNotEqual(path2)).toBe(true);
    });
  });
  describe.concurrent('update', () => {
    it('should update the path and string', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);

      const newPath = ['newPath1', 'newPath2'];
      const newString = 'newPath1/newPath2';

      jsonPath.update(newPath, newString);

      expect(jsonPath.toArray()).toEqual(newPath);
      expect(jsonPath.toString()).toEqual(newString);
    });
  });
  describe.concurrent('pop', () => {
    it('should remove the last item and return it', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);

      const poppedItem = jsonPath.pop();

      expect(poppedItem).toEqual('path2');
      expect(jsonPath.toArray()).toEqual(['path1']);
      expect(jsonPath.toString()).toEqual('path1');
    });
    it('should remove the only item and return it', () => {
      const path = ['path1'];
      const string = 'path1';

      const jsonPath = new JSONPath(path, string);

      const poppedItem = jsonPath.pop();

      expect(poppedItem).toEqual('path1');
      expect(jsonPath.toArray()).toEqual([]);
      expect(jsonPath.toString()).toEqual('');
    });
    it('should return undefined and not change the path for empty path', () => {
      const path: Array<string | number> = [];
      const string = '';

      const jsonPath = new JSONPath(path, string);

      const poppedItem = jsonPath.pop();

      expect(poppedItem).toBeUndefined();
      expect(jsonPath.toArray()).toEqual([]);
      expect(jsonPath.toString()).toEqual('');
    });
  });
  describe.concurrent('prepend', () => {
    it('should prepend item to the path and update the string', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);
      jsonPath.prepend('newPath');

      expect(jsonPath.toArray()).toEqual(['newPath', 'path1', 'path2']);
      expect(jsonPath.toString()).toEqual('newPath.path1.path2');
    });
  });
  describe.concurrent('append', () => {
    it('should append item to the path and update the string', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);
      jsonPath.append('newPath');

      expect(jsonPath.toArray()).toEqual(['path1', 'path2', 'newPath']);
      expect(jsonPath.toString()).toEqual('path1.path2.newPath');
    });
  });
  describe.concurrent('at', () => {
    it('should return the item at the given index', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.at(1)).toEqual('path2');
    });
    it('should return undefined for out of bounds index', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.at(3)).toBeUndefined();
    });
  });
  describe.concurrent('head', () => {
    it('should return the first item of the path', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.head()).toEqual('path1');
    });
    it('should return undefined for empty path', () => {
      const path: Array<string | number> = [];
      const string = '';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.head()).toBeUndefined();
    });
  });
  describe.concurrent('tail', () => {
    it('should return the last item of the path', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.tail()).toEqual('path2');
    });
    it('should return undefined for empty path', () => {
      const path: Array<string | number> = [];
      const string = '';

      const jsonPath = new JSONPath(path, string);

      expect(jsonPath.tail()).toBeUndefined();
    });
  });
  describe.concurrent('removeAt', () => {
    it('should remove item at the given index', () => {
      const path = ['path1', 'path2', 'path3'];
      const string = 'path1/path2/path3';

      const jsonPath = new JSONPath(path, string);
      jsonPath.removeAt(1);

      expect(jsonPath.toArray()).toEqual(['path1', 'path3']);
      expect(jsonPath.toString()).toEqual('path1.path3');
    });
    it('should not change the path for out of bounds index', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);
      jsonPath.removeAt(3);

      expect(jsonPath.toArray()).toEqual(['path1', 'path2']);
      expect(jsonPath.toString()).toEqual('path1.path2');
    });
  });
  describe.concurrent('replaceAt', () => {
    it('should replace item at the given index', () => {
      const path = ['path1', 'path2', 'path3'];
      const string = 'path1.path2.path3';

      const jsonPath = new JSONPath(path, string);
      jsonPath.replaceAt(1, 'newPath');

      expect(jsonPath.toArray()).toEqual(['path1', 'newPath', 'path3']);
      expect(jsonPath.toString()).toEqual('path1.newPath.path3');
    });
    it('should not change the path for out of bounds index', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);
      jsonPath.replaceAt(3, 'newPath');

      expect(jsonPath.toArray()).toEqual(['path1', 'path2']);
      expect(jsonPath.toString()).toEqual('path1.path2');
    });
  });
  describe.concurrent('removeLeft', () => {
    it('should remove items from the root until the given index', () => {
      const path = ['path1', 'path2', 'path3'];
      const string = 'path1.path2.path3';

      const jsonPath = new JSONPath(path, string);
      jsonPath.removeLeft(2);

      expect(jsonPath.toArray()).toEqual(['path3']);
      expect(jsonPath.toString()).toEqual('path3');
    });
    it('should empty the path for out of bounds index', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);
      jsonPath.removeLeft(3);

      expect(jsonPath.toArray()).toEqual([]);
      expect(jsonPath.toString()).toEqual('');
    });
  });
  describe.concurrent('removeRight', () => {
    it('should remove items from the end until the given index', () => {
      const path = ['path1', 'path2', 'path3'];
      const string = 'path1.path2.path3';

      const jsonPath = new JSONPath(path, string);
      jsonPath.removeRight(2);

      expect(jsonPath.toArray()).toEqual(['path1']);
      expect(jsonPath.toString()).toEqual('path1');
    });
    it('should empty the path for out of bounds index', () => {
      const path = ['path1', 'path2'];
      const string = 'path1.path2';

      const jsonPath = new JSONPath(path, string);
      jsonPath.removeRight(3);

      expect(jsonPath.toArray()).toEqual([]);
      expect(jsonPath.toString()).toEqual('');
    });
  });
  describe.concurrent('trimStartWith', () => {
    it('should remove the start of the path that matches the given path', () => {
      const path = new JSONPath(['path1', 'path2', 'path3'], 'path1.path2.path3');
      const trimPath = new JSONPath(['path1', 'path2'], 'path1.path2');

      path.trimStartWith(trimPath);

      expect(path.toArray()).toEqual(['path3']);
      expect(path.toString()).toEqual('path3');
    });
    it('should empty the path if the given path is the same as the path', () => {
      const path = new JSONPath(['path1', 'path2'], 'path1.path2');
      const trimPath = new JSONPath(['path1', 'path2'], 'path1.path2');

      path.trimStartWith(trimPath);

      expect(path.toArray()).toEqual([]);
      expect(path.toString()).toEqual('');
    });
    it('should not change the path if it does not start with the given path', () => {
      const path = new JSONPath(['path1', 'path2'], 'path1.path2');
      const trimPath = new JSONPath(['path3', 'path4'], 'path3.path4');

      path.trimStartWith(trimPath);

      expect(path.toArray()).toEqual(['path1', 'path2']);
      expect(path.toString()).toEqual('path1.path2');
    });
  });
  describe.concurrent('concat', () => {
    it('should append the given elements to the path', () => {
      const path = new JSONPath(['path1', 'path2'], 'path1.path2');
      const elements = ['path3', 'path4'];

      path.concat(elements);

      expect(path.toArray()).toEqual(['path1', 'path2', 'path3', 'path4']);
      expect(path.toString()).toEqual('path1.path2.path3.path4');
    });
  });
  describe.concurrent('toString', () => {
    it('should return the string representation of the path', () => {
      const path = new JSONPath(['path1', 'path2'], 'path1.path2');

      expect(path.toString()).toEqual('path1.path2');
    });
  });
  describe.concurrent('toJSON', () => {
    it('should return the array representation of the path', () => {
      const path = new JSONPath(['path1', 'path2'], 'path1.path2');

      expect(path.toJSON()).toEqual(['path1', 'path2']);
    });
  });
  describe.concurrent('toArray', () => {
    it('should return the array representation of the path', () => {
      const path = new JSONPath(['path1', 'path2'], 'path1.path2');

      expect(path.toArray()).toEqual(['path1', 'path2']);
    });
  });

  it('should clear the content', () => {
    const path = new JSONPath(['path1', 'path2'], 'path1.path2');

    expect(path.toArray()).toEqual(['path1', 'path2']);
    expect(path.toString()).toBe('path1.path2');

    path.clear();
    expect(path.toArray()).toEqual([]);
    expect(path.toString()).toBe('');
  });
});
