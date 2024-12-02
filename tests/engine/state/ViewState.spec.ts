import { describe, it, expect } from 'vitest';

import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import { createGroupStateParams } from '../../_utils/createStateParams.js';
import {
  GroupState,
  SDTFQuery,
  SpecifyDesignTokenFormat,
  TreeNodesState,
} from '../../../src/index.js';

import { ViewState } from '../../../src/engine/state/ViewState.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('ViewState', () => {
  describe.concurrent('constructor', () => {
    it('should create a new ViewState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {},
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const name = 'test';
      const query: SDTFQuery = { where: { group: '.*', select: true } };

      const nodesState = new TreeNodesState();
      nodesState.groups.add(
        new GroupState(treeState, createGroupStateParams(new TreePath(['aGroup']))),
      );

      const viewState = new ViewState(name, query, nodesState);

      expect(viewState.name).toBe(name);
      expect(viewState.query).toBe(query);
      expect(viewState.nodes.tokens.size).toBe(0);
      expect(viewState.nodes.groups.size).toBe(1);
      expect(viewState.nodes.collections.size).toBe(0);
    });
  });
});
