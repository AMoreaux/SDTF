import { describe, it, expect } from 'vitest';

import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import { SpecifyDesignTokenFormat } from '../../../src/index.js';

import { TreeNodeState } from '../../../src/engine/state/TreeNodeState.js';
import { createTreeNodeStateParams } from '../../_utils/createStateParams.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('TreeNodeState', () => {
  describe.concurrent('constructor', () => {
    it('should create a tree node state', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']), {
        $description: 'description',
        $extensions: { extended: 'yes' },
      });

      const state = new TreeNodeState(treeState, params);

      expect(state.name).toEqual('b');
      expect(state.path).toEqual(new TreePath(['a', 'b']));
      expect(state.path.toString()).toEqual('a.b');
      expect(state.description).toEqual('description');
      expect(state.extensions).toEqual({ extended: 'yes' });
      expect(state.parentPath).toEqual(new TreePath(['a']));
      expect(state.parentStringPath).toEqual('a');
    });
    it('should fail if trying to assign private properties', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a']));

      const state = new TreeNodeState(treeState, params);

      expect(() => {
        // @ts-expect-error - Private property
        state.name = 'b';
      }).toThrow('Cannot set property name of #<TreeNodeState> which has only a getter');

      expect(() => {
        // @ts-expect-error - Private property
        state.path = ['a', 'b'];
      }).toThrow('Cannot set property path of #<TreeNodeState> which has only a getter');

      expect(() => {
        // @ts-expect-error - Private property
        state.description = 'description';
      }).toThrow('Cannot set property description of #<TreeNodeState> which has only a getter');

      expect(() => {
        // @ts-expect-error - Private property
        state.extensions = { extended: 'yes' };
      }).toThrow('Cannot set property extensions of #<TreeNodeState> which has only a getter');
    });
  });
  describe.concurrent('get stringPath', () => {
    it('returns the string path of the node', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const node = new TreeNodeState(treeState, params);
      expect(node.stringPath).toEqual('a.b');
    });
  });
  describe.concurrent('parentPath', () => {
    it('returns the parent path of the node', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b', 'c']));

      const node = new TreeNodeState(treeState, params);
      expect(node.parentPath).toEqual(new TreePath(['a', 'b']));
    });

    it('returns an empty array if the node has no parent', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a']));

      const node = new TreeNodeState(treeState, params);
      expect(node.parentPath).toEqual(TreePath.empty());
    });
  });
  describe.concurrent('parentStringPath', () => {
    it('returns the parent string path of the node', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b', 'c']));

      const node = new TreeNodeState(treeState, params);
      expect(node.parentStringPath).toEqual('a.b');
    });

    it('returns an empty string if the node has no parent', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a']));

      const node = new TreeNodeState(treeState, params);
      expect(node.parentStringPath).toEqual('');
    });
  });
  describe.concurrent('rename', () => {
    it('should rename the node', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      state.rename('c');

      expect(state.name).toEqual('c');
      expect(state.path).toEqual(new TreePath(['a', 'c']));
      expect(state.path.toString()).toEqual('a.c');
    });
    it('should do nothing if trying to rename to the same name', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      state.rename('b');

      expect(state.name).toEqual('b');
      expect(state.path).toEqual(new TreePath(['a', 'b']));
      expect(state.path.toString()).toEqual('a.b');
    });
    it('should throw an error when the new name is already taken', () => {
      const treeState = createTreeStateFromTokenTree({
        aNode: {},
      });
      const params = createTreeNodeStateParams(new TreePath(['a']));

      const state = new TreeNodeState(treeState, params);

      expect(() => state.rename('aNode')).toThrow(`Path "aNode" is already taken.`);
    });
  });
  describe.concurrent('setPath', () => {
    it('should update the location of the node in the path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        a: {
          b: { $type: 'string', $value: { default: 'a string' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      state.setPath(new TreePath(['b', 'b']));

      expect(state.name).toEqual('b');
      expect(state.path).toEqual(new TreePath(['b', 'b']));
      expect(state.path.toString()).toEqual('b.b');
    });
    it('should update the name in the path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        a: {
          b: { $type: 'string', $value: { default: 'a string' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      state.setPath(new TreePath(['a', 'c']));

      expect(state.name).toEqual('c');
      expect(state.path).toEqual(new TreePath(['a', 'c']));
      expect(state.path.toString()).toEqual('a.c');
    });
    it('should move the node to the root', () => {
      const tokens: SpecifyDesignTokenFormat = {
        a: {
          b: { $type: 'string', $value: { default: 'a string' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      state.setPath(new TreePath(['b']));

      expect(state.name).toEqual('b');
      expect(state.path).toEqual(new TreePath(['b']));
      expect(state.path.toString()).toEqual('b');
    });
    it('should fail if the new path is already taken', () => {
      const tokens: SpecifyDesignTokenFormat = {
        a: {
          b: { $type: 'string', $value: { default: 'a string' } },
          c: { $type: 'string', $value: { default: 'a string' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      expect(() => {
        state.setPath(new TreePath(['a', 'c']));
      }).toThrow(`Path "a.c" is already taken.`);
    });
    it('should fail if the new name is invalid', () => {
      const tokens: SpecifyDesignTokenFormat = {
        a: {
          b: { $type: 'string', $value: { default: 'a string' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      expect(() => {
        state.setPath(new TreePath(['a', 'an.Invalid.name']));
      }).toThrow(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain the '.' (dot) character.",
    "path": [
      "a",
      "b"
    ]
  }
]`);
    });
  });
  describe.concurrent('updatePathItem', () => {
    it('should update the path at index 0', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      state.updatePathItem(0, 'c');

      expect(state.name).toEqual('b');
      expect(state.path).toEqual(new TreePath(['c', 'b']));
      expect(state.path.toString()).toEqual('c.b');
    });
    it('should update the path at index 1', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b', 'c']));

      const state = new TreeNodeState(treeState, params);

      state.updatePathItem(1, 'x');

      expect(state.name).toEqual('c');
      expect(state.path).toEqual(new TreePath(['a', 'x', 'c']));
      expect(state.path.toString()).toEqual('a.x.c');
    });
    it('should fail when trying to update the last index of the path', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b', 'c']));

      const state = new TreeNodeState(treeState, params);

      expect(() => state.updatePathItem(2, 'x')).toThrow(
        `Cannot update the last index of the path.`,
      );
    });
  });
  describe.concurrent('updateDescription', () => {
    it('should update the description', () => {
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));
      const treeState = createTreeStateFromTokenTree({});
      const state = new TreeNodeState(treeState, params);

      state.updateDescription('description');

      expect(state.description).toEqual('description');
    });
    it('should reset the description to undefined', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']), {
        $description: 'description',
      });

      const state = new TreeNodeState(treeState, params);

      state.updateDescription(undefined);

      expect(state.description).toEqual(undefined);
    });
    it('should fail when the description is invalid', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      expect(() =>
        state.updateDescription(
          // @ts-expect-error - Invalid type
          123,
        ),
      ).toThrow(`[
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "number",
    "path": [],
    "message": "Expected string, received number"
  }
]`);
    });
  });
  describe.concurrent('updateExtensions', () => {
    it('should update the extensions', () => {
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));
      const treeState = createTreeStateFromTokenTree({});
      const state = new TreeNodeState(treeState, params);

      state.updateExtensions({ extended: 'yes' });

      expect(state.extensions).toEqual({ extended: 'yes' });
    });
    it('should reset the extensions to undefined', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']), {
        $extensions: { extended: 'yes' },
      });

      const state = new TreeNodeState(treeState, params);

      state.updateExtensions(undefined);

      expect(state.extensions).toEqual(undefined);
    });
    it('should fail when the extensions are invalid', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));

      const state = new TreeNodeState(treeState, params);

      expect(() =>
        state.updateExtensions(
          // @ts-expect-error - Invalid type
          123,
        ),
      ).toThrow(`[
  {
    "code": "invalid_type",
    "expected": "object",
    "received": "number",
    "path": [],
    "message": "Expected object, received number"
  }
]`);
    });
    it('should copy the original object passed in', () => {
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']));
      const treeState = createTreeStateFromTokenTree({});
      const state = new TreeNodeState(treeState, params);

      const extensions = { extended: 'yes' };
      state.updateExtensions(extensions);

      extensions.extended = 'no';

      expect(state.extensions).toEqual({ extended: 'yes' });
    });
  });
  describe.concurrent('getCommonJSON', () => {
    it('should return the common JSON', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']), {});

      const state = new TreeNodeState(treeState, params);

      expect(state.getCommonJSON()).toEqual({});
    });
    it('should return the common JSON with description and extensions', () => {
      const treeState = createTreeStateFromTokenTree({});
      const params = createTreeNodeStateParams(new TreePath(['a', 'b']), {
        $description: 'description',
        $extensions: { extended: 'yes' },
      });

      const state = new TreeNodeState(treeState, params);

      expect(state.getCommonJSON()).toEqual({
        $description: 'description',
        $extensions: { extended: 'yes' },
      });
    });
  });
});
