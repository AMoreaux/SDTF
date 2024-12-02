import { describe, expect, it } from 'vitest';

import { TokenValuePaths } from '../../../../src/engine/state/statefulValue/TokenValuePaths.js';

describe.concurrent('ValueBranchPaths', () => {
  describe.concurrent('addLeaf', () => {
    it('should add a leaf', () => {
      const valueBranchPaths = new TokenValuePaths();

      valueBranchPaths.addLeaf(['a', 'b', 'c']);

      const result = valueBranchPaths.computeLeafParentPaths();

      expect(result).toEqual([['a', 'b'], ['a']]);
    });
    it('should fail if path is empty', () => {
      const valueBranchPaths = new TokenValuePaths();

      expect(() => valueBranchPaths.addLeaf([])).toThrow(
        'TokenValuePath leaf path must be of length 1 or greater',
      );
    });
  });
  describe.concurrent('computeLeafParentPaths', () => {
    it('should handle a single path', () => {
      const valueBranchPaths = new TokenValuePaths();

      valueBranchPaths.addLeaf(['a', 'b', 'c']);

      const result = valueBranchPaths.computeLeafParentPaths();

      expect(result).toEqual([['a', 'b'], ['a']]);
    });
    it('should handle multiple paths', () => {
      const valueBranchPaths = new TokenValuePaths();

      valueBranchPaths.addLeaf(['a', 'b']);
      valueBranchPaths.addLeaf(['z', 'y']);

      const result = valueBranchPaths.computeLeafParentPaths();

      expect(result).toEqual([['z'], ['a']]);
    });
    it('should handle multiple paths with same branch', () => {
      const valueBranchPaths = new TokenValuePaths();

      valueBranchPaths.addLeaf(['a', 'b', 'a']);
      valueBranchPaths.addLeaf(['a', 'b', 'c']);

      const result = valueBranchPaths.computeLeafParentPaths();

      expect(result).toEqual([['a', 'b'], ['a']]);
    });
    it('should handle multiple paths with same branch + 1', () => {
      const valueBranchPaths = new TokenValuePaths();

      valueBranchPaths.addLeaf(['a', 'b', 'c', 'd']);
      valueBranchPaths.addLeaf(['a', 'b', 'a']);

      const result = valueBranchPaths.computeLeafParentPaths();

      expect(result).toEqual([['a', 'b', 'c'], ['a', 'b'], ['a']]);
    });
  });
});
