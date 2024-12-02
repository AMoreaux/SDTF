import { describe, it, expect } from 'vitest';

import { createTreeStateFromTokenTree } from '../../../_utils/createTreeStateFromTokenTree.js';
import { TokenState } from '../../../../src/engine/state/TokenState.js';
import { GroupState } from '../../../../src/engine/state/GroupState.js';
import { CollectionState } from '../../../../src/engine/state/CollectionState.js';

import { QueryContext } from '../../../../src/engine/query/internals/QueryContext.js';
import {
  createCollectionStateParams,
  createGroupStateParams,
  createTokenStateParams,
} from '../../../_utils/createStateParams.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('QueryContext', () => {
  describe.concurrent('add', () => {
    it('should add a node token node', () => {
      const treeState = createTreeStateFromTokenTree({});
      const queryContext = new QueryContext();

      queryContext.add(
        new TokenState(
          treeState,
          createTokenStateParams(new TreePath(['token']), {
            type: 'string',
            isTopLevelAlias: false,
            primitiveParts: [
              {
                value: 'foo',
              },
            ],
            isFullyResolvable: true,
            modesResolvability: [['default', true]],
          }),
        ),
      );

      expect(queryContext.nodeStates[0].toJSON()).toEqual({
        $type: 'string',
        $value: { default: 'foo' },
      });
      expect(queryContext.nodeTypesSet.size).toBe(1);
      expect(queryContext.nodeTypesSet.has('token')).toBe(true);
    });
    it('should add a collection node', () => {
      const treeState = createTreeStateFromTokenTree({});
      const queryContext = new QueryContext();

      queryContext.add(
        new CollectionState(
          treeState,
          createCollectionStateParams(new TreePath(['collection']), ['light', 'dark']),
        ),
      );

      expect(queryContext.nodeStates[0].toJSON()).toEqual({
        $collection: { $modes: ['light', 'dark'] },
      });
      expect(queryContext.nodeTypesSet.size).toBe(1);
      expect(queryContext.nodeTypesSet.has('collection')).toBe(true);
    });
    it('should add a group node', () => {
      const treeState = createTreeStateFromTokenTree({});
      const queryContext = new QueryContext();

      queryContext.add(
        new GroupState(
          treeState,
          createGroupStateParams(new TreePath(['group']), {
            $description: 'a group',
          }),
        ),
      );

      expect(queryContext.nodeStates[0].toJSON()).toEqual({
        $description: 'a group',
      });
      expect(queryContext.nodeTypesSet.size).toBe(1);
      expect(queryContext.nodeTypesSet.has('group')).toBe(true);
    });
    it('should add all type of nodes', () => {
      const treeState = createTreeStateFromTokenTree({});
      const queryContext = new QueryContext();

      queryContext
        .add(
          new TokenState(
            treeState,
            createTokenStateParams(new TreePath(['token']), {
              type: 'string',
              isTopLevelAlias: false,
              primitiveParts: [
                {
                  value: 'foo',
                },
              ],
              isFullyResolvable: true,
              modesResolvability: [['default', true]],
            }),
          ),
        )
        .add(
          new CollectionState(
            treeState,
            createCollectionStateParams(new TreePath(['collection']), ['light', 'dark']),
          ),
        )
        .add(
          new GroupState(
            treeState,
            createGroupStateParams(new TreePath(['group']), {
              $description: 'a group',
            }),
          ),
        );

      expect(queryContext.nodeStates[0].toJSON()).toEqual({
        $type: 'string',
        $value: { default: 'foo' },
      });
      expect(queryContext.nodeStates[1].toJSON()).toEqual({
        $collection: { $modes: ['light', 'dark'] },
      });
      expect(queryContext.nodeStates[2].toJSON()).toEqual({
        $description: 'a group',
      });
      expect(queryContext.nodeTypesSet.size).toBe(3);
      expect(queryContext.nodeTypesSet.has('token')).toBe(true);
      expect(queryContext.nodeTypesSet.has('collection')).toBe(true);
      expect(queryContext.nodeTypesSet.has('group')).toBe(true);
    });
  });
});
