import { describe, it, expect } from 'vitest';
import { SpecifyDesignTokenFormat } from '../../src/index.js';
import { createTreeStateFromTokenTree } from './createTreeStateFromTokenTree.js';

describe.concurrent('createTreeStateFromTokenTree', () => {
  it('should create a tree state from a token tree', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aGroup: {
        aString: { $type: 'string', $value: { default: 'a string' } },
      },
    };

    const treeState = createTreeStateFromTokenTree(tokenTree);

    expect(treeState.renderJSONTree()).toStrictEqual(tokenTree);
    expect(treeState.listViews()).toStrictEqual([]);
  });
  it('should create a tree state from a token tree with views', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aGroup: {
        aString: { $type: 'string', $value: { default: 'a string' } },
      },
    };

    const metadata = {
      activeViewName: 'aView',
      views: [
        {
          name: 'aView',
          query: { where: { token: '.*', select: true as const } },
        },
      ],
    };

    const treeState = createTreeStateFromTokenTree(tokenTree, metadata);

    expect(treeState.renderJSONTree()).toStrictEqual(tokenTree);
    expect(treeState.listViews()).toStrictEqual([
      {
        isActive: true,
        name: 'aView',
        query: {
          where: {
            select: true,
            token: '.*',
          },
        },
      },
    ]);
    expect(treeState.getActiveView()).toStrictEqual(metadata.views[0]);
  });
});
