import { describe, it, expect } from 'vitest';
import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import { CollectionState } from '../../../src/engine/state/CollectionState.js';

import { createCollectionState } from '../../../src/engine/builder/createCollectionState.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('createCollectionState', () => {
  it('should create a group state', () => {
    const treeState = createTreeStateFromTokenTree({});

    const result = createCollectionState(treeState, {
      path: new TreePath(['brand', 'colors']),
      name: 'colors',
      allowedModes: ['light', 'dark'],
      $description: 'A collection of colors',
      $extensions: {},
      $collection: { $modes: ['light', 'dark'] },
    });

    expect(result).toBeInstanceOf(CollectionState);
    expect(result.path).toEqual(new TreePath(['brand', 'colors']));
    expect(result.path.toString()).toEqual('brand.colors');
    expect(result.name).toEqual('colors');
    expect(result.description).toEqual('A collection of colors');
    expect(result.extensions).toEqual({});
    expect(result.allowedModes).toEqual(['light', 'dark']);
  });
});
