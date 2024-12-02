import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { createSDTFEngine, SpecifyDesignTokenFormat } from '../../../src/index.js';
import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';

import { GroupState } from '../../../src/engine/state/GroupState.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('GroupState', () => {
  describe.concurrent('constructor', () => {
    it('should create a GroupState', () => {
      const state = new GroupState(createTreeStateFromTokenTree({}), {
        path: new TreePath(['foo']),
        name: 'foo',
        $description: 'A group',
        $extensions: { foo: 'bar' },
      });

      expect(state).toBeInstanceOf(GroupState);
      expect(state.name).toBe('foo');
      expect(state.description).toBe('A group');
      expect(state.extensions).toEqual({ foo: 'bar' });
    });
  });
  describe.concurrent('getGroupChildren', () => {
    it('should return the groups at depth 1 within the group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aNestedGroup: {
            $description: 'A nested group',
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      const groupsInGroup = maybeGroupState.getGroupChildren();

      expect(groupsInGroup[0].name).toEqual('aNestedGroup');
    });
  });
  describe.concurrent('getAllGroupChildren', () => {
    it('should return all the groups within the group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aNestedGroup: {
            $description: 'A nested group',
            aNestedGroupInside: {},
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      const groupsInGroup = maybeGroupState.getAllGroupChildren();

      expect(groupsInGroup[0].name).toEqual('aNestedGroup');
      expect(groupsInGroup[1].name).toEqual('aNestedGroupInside');
    });
  });
  describe.concurrent('getTokenChildren', () => {
    it('should return the tokens at depth 1 within the group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aToken: {
            $type: 'string',
            $value: { default: 'aString' },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      const tokensInGroup = maybeGroupState.getTokenChildren();

      expect(tokensInGroup[0].name).toEqual('aToken');
    });
  });
  describe.concurrent('getCollectionChildren', () => {
    it('should return the collections at depth 1 within the group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      const collectionsInGroup = maybeGroupState.getCollectionChildren();

      expect(collectionsInGroup[0].name).toEqual('aCollection');
    });
  });
  describe.concurrent('getAllCollectionChildren', () => {
    it('should return all the collections within the group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aNestedGroup: {
            aCollection: {
              $collection: { $modes: ['default'] },
            },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      const collectionsInGroup = maybeGroupState.getAllCollectionChildren();

      expect(collectionsInGroup[0].name).toEqual('aCollection');
    });
  });
  describe.concurrent('getAllTokenChildren', () => {
    it('should return the tokens at any depth within the group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: {
            $type: 'string',
            $value: {
              default: 'aString',
            },
          },
          aGroupInside: {
            anotherString: {
              $type: 'string',
              $value: {
                default: 'anotherString',
              },
            },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      const tokenStates = maybeGroupState.getAllTokenChildren();
      expect(tokenStates[0].name).toEqual('aString');
      expect(tokenStates[1].name).toEqual('anotherString');
    });
  });
  describe.concurrent('rename', () => {
    it('should rename the group and update all its children path and aliasReferences', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aNestedGroup: {},
          aNestedString: { $type: 'string', $value: { default: 'aString' } },
          aNestedCollection: {
            $collection: { $modes: ['default'] },
            aTokenInCollection: { $type: 'string', $value: { $alias: 'aGroup.aNestedString' } },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeTokenState = sdtfEngine.query.getTokenState(
        new TreePath(['aGroup', 'aNestedString']),
      );
      if (!maybeTokenState) throw new Error('Expected token to be resolved');

      maybeTokenState.rename('updatedString');

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));
      if (!maybeGroupState) throw new Error('Expected groupResult to be resolved');

      const newGroupName = 'updatedGroup';
      maybeGroupState.rename(newGroupName);

      expect(maybeGroupState.name).toEqual(newGroupName);

      sdtfEngine.query.getChildrenOf(new TreePath([newGroupName])).forEach(child => {
        if (child.path.length === 2) {
          expect(child.path).toEqual(new TreePath([newGroupName, child.name]));
        } else {
          expect(child.path).toEqual(new TreePath([newGroupName, 'aNestedCollection', child.name]));
        }
      });

      const aliasReferences = sdtfEngine.query.getAliasReferencesFrom({
        treePath: new TreePath([newGroupName, 'aNestedCollection', 'aTokenInCollection']),
      });

      expect(aliasReferences).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath([newGroupName, 'aNestedCollection', 'aTokenInCollection']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: {
            treePath: new TreePath([newGroupName, 'updatedString']),
            mode: null,
          },
        },
      ]);
    });
    it('should do nothing if the new name is the same as the current name', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {},
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));
      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      const newName = 'aGroup';

      const hasBeenRenamed = maybeGroupState.rename(newName);

      expect(hasBeenRenamed).toBe(false);

      const found = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));
      if (!found) throw new Error('Expected result to be resolved');

      expect(found.name).toEqual(newName);
    });
  });
  describe.concurrent('getJSONProperties', () => {
    it('should return the JSON properties of the group', () => {
      const groupProperties = {
        $description: 'A group',
        $extensions: { foo: 'bar' },
      };

      const state = new GroupState(createTreeStateFromTokenTree({}), {
        path: new TreePath(['foo']),
        name: 'foo',
        ...groupProperties,
      });

      expect(state.getJSONProperties()).toEqual(groupProperties);
    });
  });
  describe.concurrent('toJSON', () => {
    it('should return a JSON compatible group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          $description: 'A group',
          $extensions: { foo: 'bar' },
          aToken: {
            $type: 'string',
            $value: { default: 'aString' },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      expect(maybeGroupState.toJSON()).toEqual(tokens.aGroup);
    });
  });
  describe.concurrent('move', () => {
    it('should move a group at the root level', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aNestedGroup: {
            $description: 'A nested group',
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(
        new TreePath(['aGroup', 'aNestedGroup']),
      );

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      maybeGroupState.move(new TreePath([]));

      expect(maybeGroupState.path.length).toEqual(1);
      expect(maybeGroupState.path.toString()).toEqual('aNestedGroup');
    });
    it('should move the group to a new path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {},
        bGroup: {},
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      maybeGroupState.move(new TreePath(['bGroup']));

      expect(maybeGroupState.path.length).toEqual(2);
      expect(maybeGroupState.path.toString()).toEqual('bGroup.aGroup');
    });
    it("should fail when the target group doesn't exist", () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {},
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      expect(() => maybeGroupState.move(new TreePath(['cGroup']))).toThrow(
        'Node "cGroup" does not exist.',
      );
    });
    it('should fail to move a group if the target path is a token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {},
        color: {
          $type: 'color',
          $value: {
            default: {
              model: 'hex',
              hex: '#000000',
              alpha: 1,
            },
          },
        },
      };
      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      expect(() => maybeGroupState.move(new TreePath(['color']))).toThrow(
        'Node "color" is a token. Target a group, a collection or the root node "[]"',
      );
    });
    it('should fail to move a group in itself', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aNestedGroup: {
            $description: 'A nested group',
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      expect(() => maybeGroupState.move(new TreePath(['aGroup', 'aNestedGroup']))).toThrow(
        'Node "aGroup.aNestedGroup" is a child of the current group "aGroup".',
      );
    });
    it('should fail to move a group including a collection in a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
          },
        },
        bCollection: {
          $collection: { $modes: ['default'] },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      expect(() => maybeGroupState.move(new TreePath(['bCollection']))).toThrow(
        'Node "aGroup" include a collection "aGroup.aCollection" that cannot be moved to another collection "bCollection".',
      );
    });
    it('should fail to move a group including a collection to a node that have a collection in parents', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
          },
        },
        bCollection: {
          $collection: { $modes: ['default'] },
          bGroup: {},
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      expect(() => maybeGroupState.move(new TreePath(['bCollection', 'bGroup']))).toThrow(
        'Node "aGroup" include a collection "aGroup.aCollection" that cannot be moved to another collection "bCollection".',
      );
    });
    it('should move a group at the root level including his tokens', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aNestedGroup: {
            aToken: {
              $type: 'color',
              $value: {
                default: {
                  model: 'hex',
                  hex: '#000000',
                  alpha: 1,
                },
              },
            },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(
        new TreePath(['aGroup', 'aNestedGroup']),
      );
      const maybeTokenState = sdtfEngine.query.getTokenState(
        new TreePath(['aGroup', 'aNestedGroup', 'aToken']),
      );

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      maybeGroupState.move(new TreePath([]));

      expect(maybeGroupState.path.length).toEqual(1);
      expect(maybeGroupState.path.toString()).toEqual('aNestedGroup');

      if (!maybeTokenState) throw new Error('Expected token to be resolved');

      expect(maybeTokenState.path.toString()).toEqual('aNestedGroup.aToken');
    });
    it('should move a group at the root level including his tokens an compute again aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aNestedGroup: {
            aToken: {
              $type: 'color',
              $value: {
                default: {
                  model: 'hex',
                  hex: '#000000',
                  alpha: 1,
                },
              },
            },
          },
        },
        bToken: {
          $type: 'color',
          $value: {
            $alias: 'aGroup.aNestedGroup.aToken',
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeGroupState = sdtfEngine.query.getGroupState(
        new TreePath(['aGroup', 'aNestedGroup']),
      );
      const aToken = sdtfEngine.query.getTokenState(
        new TreePath(['aGroup', 'aNestedGroup', 'aToken']),
      );
      const bToken = sdtfEngine.query.getTokenState(new TreePath(['bToken']));

      if (!maybeGroupState) throw new Error('Expected result to be resolved');

      maybeGroupState.move(new TreePath([]));

      expect(maybeGroupState.path.length).toEqual(1);
      expect(maybeGroupState.path.toString()).toEqual('aNestedGroup');

      if (!aToken) throw new Error('Expected token to be resolved');
      expect(aToken.path.toString()).toEqual('aNestedGroup.aToken');

      if (!bToken) throw new Error('Expected token to be resolved');
      expect(bToken.value).toEqual({
        $alias: 'aNestedGroup.aToken',
      });
    });
    it('should move a group including a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
          },
        },
        bGroup: {},
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const aGroup = sdtfEngine.query.getGroupState(new TreePath(['aGroup']));
      const aCollection = sdtfEngine.query.getCollectionState(
        new TreePath(['aGroup', 'aCollection']),
      );

      if (!aGroup) throw new Error('Expected result to be resolved');

      aGroup.move(new TreePath(['bGroup']));

      expect(aGroup.path.length).toEqual(2);
      expect(aGroup.path.toString()).toEqual('bGroup.aGroup');

      if (!aCollection) throw new Error('Expected token to be resolved');
      expect(aCollection.path.toString()).toEqual('bGroup.aGroup.aCollection');
    });
  });
  describe.concurrent('toGroupStateParams', () => {
    it('should return the group state params', () => {
      const state = new GroupState(createTreeStateFromTokenTree({}), {
        path: new TreePath(['root', 'foo']),
        name: 'foo',
        $description: 'A group',
        $extensions: { foo: 'bar' },
      });

      expect(state.toGroupStateParams()).toEqual({
        path: new TreePath(['root', 'foo']),
        name: 'foo',
        $description: 'A group',
        $extensions: { foo: 'bar' },
      });
    });
  });
  describe.concurrent('toAnalyzedGroup', () => {
    it('should return the analyzed group', () => {
      const state = new GroupState(createTreeStateFromTokenTree({}), {
        path: new TreePath(['root', 'foo']),
        name: 'foo',
        $description: 'A group',
        $extensions: { foo: 'bar' },
      });

      expect(state.toAnalyzedGroup()).toEqual({
        path: new TreePath(['root', 'foo']),
        name: 'foo',
        $description: 'A group',
        $extensions: { foo: 'bar' },
      });
    });
  });
});
