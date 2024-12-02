import { describe, it, expect } from 'vitest';

import { TreeNodesState } from '../../../src/engine/state/TreeNodesState.js';

describe.concurrent('TreeNodesState', () => {
  describe.concurrent('constructor', () => {
    it('should create a new instance', () => {
      const state = new TreeNodesState();
      expect(state.tokens).toBeDefined();
      expect(state.groups).toBeDefined();
      expect(state.collections).toBeDefined();
    });
  });
  describe.concurrent('clear', () => {
    it('should clear all nodes', () => {
      const state = new TreeNodesState();
      state.tokens.add({ stringPath: '1', name: 'token' } as any);
      state.groups.add({ stringPath: '2', name: 'group' } as any);
      state.collections.add({ stringPath: '3', name: 'collection' } as any);
      expect(Array.from(state.tokens)).toHaveLength(1);
      expect(Array.from(state.groups)).toHaveLength(1);
      expect(Array.from(state.collections)).toHaveLength(1);

      state.clear();
      expect(Array.from(state.tokens)).toHaveLength(0);
      expect(Array.from(state.groups)).toHaveLength(0);
      expect(Array.from(state.collections)).toHaveLength(0);
    });
  });
});
