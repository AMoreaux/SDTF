import { describe, it, expect } from 'vitest';

import { SpecifyDesignTokenFormat } from '../../../src/index.js';
import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import { ViewState } from '../../../src/engine/state/ViewState.js';

import { ViewsState } from '../../../src/engine/state/ViewsState.js';

describe.concurrent('ViewsState', () => {
  describe.concurrent('register', () => {
    it('should register a view', () => {
      const viewsState = new ViewsState();
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      viewsState.register(
        'view1',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      const view = viewsState.get('view1');
      if (view === undefined) throw new Error('View not found');

      expect(view).instanceof(ViewState);
      expect(view.nodes.tokens.size).toBe(1);
    });
  });
  describe.concurrent('updateQuery', () => {
    it('should update a view', () => {
      const viewsState = new ViewsState();
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
        aNumber: {
          $type: 'number',
          $value: { default: 42 },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      viewsState.register(
        'view1',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      const viewBefore = viewsState.get('view1');
      if (viewBefore === undefined) throw new Error('View not found');

      expect(viewBefore.nodes.tokens.size).toBe(2);

      viewsState.updateQuery(
        'view1',
        {
          where: { token: 'aNumber', select: true },
        },
        treeState,
      );

      const viewAfter = viewsState.get('view1');
      if (viewAfter === undefined) throw new Error('View not found');

      expect(viewAfter.nodes.tokens.size).toBe(1);
    });
  });
  describe.concurrent('has', () => {
    it('should return true if view exists', () => {
      const viewsState = new ViewsState();
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      viewsState.register(
        'view1',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      expect(viewsState.has('view1')).toBe(true);
    });
    it('should return false if view does not exist', () => {
      const viewsState = new ViewsState();
      expect(viewsState.has('view1')).toBe(false);
    });
  });
  describe.concurrent('get', () => {
    it('should return the view', () => {
      const viewsState = new ViewsState();
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      viewsState.register(
        'view1',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      const view = viewsState.get('view1');
      if (view === undefined) throw new Error('View not found');

      expect(view).instanceof(ViewState);
      expect(view.nodes.tokens.size).toBe(1);
    });
    it('should return undefined if view does not exist', () => {
      const viewsState = new ViewsState();
      expect(viewsState.get('view1')).toBe(undefined);
    });
  });
  describe.concurrent('forEach', () => {
    it('should iterate over views', () => {
      const viewsState = new ViewsState();
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      viewsState.register(
        'view1',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      viewsState.register(
        'view2',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      let count = 0;
      viewsState.forEach(() => {
        count++;
      });

      expect(count).toBe(2);
    });
  });
  describe.concurrent('values', () => {
    it('should return an array of views', () => {
      const viewsState = new ViewsState();
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      viewsState.register(
        'view1',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      viewsState.register(
        'view2',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      const values = viewsState.values();
      expect(values).toHaveLength(2);
    });
  });
  describe.concurrent('clear', () => {
    it('should clear all views', () => {
      const viewsState = new ViewsState();
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      viewsState.register(
        'view1',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      viewsState.clear();

      expect(viewsState.values()).toHaveLength(0);
    });
  });
  describe.concurrent('serialize', () => {
    it('should serialize the views', () => {
      const viewsState = new ViewsState();
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      viewsState.register(
        'view1',
        {
          where: { token: '.*', select: true },
        },
        treeState,
      );

      const serialized = viewsState.serialize();

      expect(serialized).toEqual([
        {
          name: 'view1',
          query: {
            where: { token: '.*', select: true },
          },
        },
      ]);
    });
  });
});
