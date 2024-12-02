import { describe, it, expect } from 'vitest';
import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import { GroupState } from '../../../src/engine/state/GroupState.js';

import { createGroupState } from '../../../src/engine/builder/createGroupState.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('createGroupState', () => {
  it('should create a group state', () => {
    const treeState = createTreeStateFromTokenTree({});

    const result = createGroupState(treeState, {
      path: new TreePath(['brand', 'colors']),
      name: 'colors',
      $description: 'A collection of colors',
      $extensions: {},
    });

    expect(result).toBeInstanceOf(GroupState);
    expect(result.path).toEqual(new TreePath(['brand', 'colors']));
    expect(result.path.toString()).toEqual('brand.colors');
    expect(result.name).toEqual('colors');
    expect(result.description).toEqual('A collection of colors');
    expect(result.extensions).toEqual({});
  });
});
