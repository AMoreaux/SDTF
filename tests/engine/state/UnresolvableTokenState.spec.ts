import { describe, it, expect } from 'vitest';
import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import { UnresolvableTokenState } from '../../../src/engine/state/UnresolvableTokenState.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('UnresolvableTokenState', () => {
  describe.concurrent('constructor', () => {
    it('should create a new UnresolvableTokenState', () => {
      const treeState = createTreeStateFromTokenTree({});
      const state = new UnresolvableTokenState(treeState, new TreePath(['foo']), 'reason');

      expect(state).toBeInstanceOf(UnresolvableTokenState);
      expect(state.path).toEqual(new TreePath(['foo']));
      expect(state.reason).toEqual('reason');
    });
  });
  describe.concurrent('getCommonJSON', () => {
    it('should override the getCommonJSON method by returning an unresolvable alias signature', () => {
      const treeState = createTreeStateFromTokenTree({});
      const state = new UnresolvableTokenState(treeState, new TreePath(['foo', 'bar']), 'reason');

      const result = state.getCommonJSON();
      expect(result).toEqual({
        $alias: 'foo.bar',
      });
    });
  });
  describe.concurrent('toJSON', () => {
    it('should return null as the JSON representation', () => {
      const treeState = createTreeStateFromTokenTree({});
      const state = new UnresolvableTokenState(treeState, new TreePath(['foo', 'bar']), 'reason');

      const result = state.toJSON();
      expect(result).toBeNull();
    });
  });
});
