import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Expect, Equal } from '../../_utils.js';
import { createSDTFEngine, SpecifyDesignTokenFormat } from '../../../src/index.js';
import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';

import { CollectionState } from '../../../src/engine/state/CollectionState.js';
import { createCollectionStateParams } from '../../_utils/createStateParams.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('CollectionState', () => {
  describe.concurrent('constructor', () => {
    it('should create a CollectionState with $modes', () => {
      const result = new CollectionState(
        createTreeStateFromTokenTree({}),
        createCollectionStateParams(new TreePath(['base']), ['light', 'dark'], {
          $description: 'A collection',
          $extensions: { extension: true },
        }),
      );

      expect(result.allowedModes).toEqual(['light', 'dark']);
      expect(result.innerAllowedModes).toEqual(['light', 'dark']);
      expect(result.description).toBe('A collection');
      expect(result.extensions).toStrictEqual({ extension: true });
    });
  });
  describe.concurrent('getAllowedModes', () => {
    it('should get the initial allowed modes from the collection', () => {
      const treeState = createTreeStateFromTokenTree({});

      const state = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), [
          'light',
          'dark',
          'highContrast',
        ]),
      );

      expect(state.getAllowedModes()).toEqual(['light', 'dark', 'highContrast']);
    });
  });
  describe.concurrent('resolveAllowedModes', () => {
    it('should resolve the allowed modes from the collection', () => {
      const treeState = createTreeStateFromTokenTree({});

      const state = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), [
          'light',
          'dark',
          'highContrast',
        ]),
      );

      expect(state.resolveAllowedModes()).toEqual(['light', 'dark', 'highContrast']);

      type R = Expect<
        Equal<ReturnType<typeof state.resolveAllowedModes>, [string, ...Array<string>]>
      >;
    });
  });
  describe.concurrent('getCollectionSettings', () => {
    it('should return the collection settings of a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {};
      const treeState = createTreeStateFromTokenTree(tokens);

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small', 'medium']),
      );

      expect(collectionState.getCollectionSettings()).toStrictEqual({
        $modes: ['small', 'medium'],
      });

      const collectionStateWithDefaultMode = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small', 'medium']),
      );

      expect(collectionStateWithDefaultMode.getCollectionSettings()).toStrictEqual({
        $modes: ['small', 'medium'],
      });
    });
  });
  describe.concurrent('getGroupChildren', () => {
    it('should return the groups at depth 1 within the collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'medium'] },
          aGroup: {
            $description: 'A group',
            aNestedGroup: {},
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      const groups = maybeCollectionState.getGroupChildren();
      expect(groups).toHaveLength(1);
      expect(groups[0].name).toEqual('aGroup');
    });
  });
  describe.concurrent('getAllGroupChildren', () => {
    it('should return all the groups within the collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'medium'] },
          aGroup: {
            $description: 'A group',
            aNestedGroup: {},
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      const groups = maybeCollectionState.getAllGroupChildren();
      expect(groups).toHaveLength(2);
      expect(groups[0].name).toEqual('aGroup');
      expect(groups[1].name).toEqual('aNestedGroup');
    });
  });
  describe.concurrent('getTokenChildren', () => {
    it('should return the tokens at depth 1 within the collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'medium'] },
          aString: {
            $type: 'string',
            $value: {
              small: 'small',
              medium: 'medium',
            },
          },
          aGroup: {
            anotherString: {
              $type: 'string',
              $value: {
                small: 'small',
                medium: 'medium',
              },
            },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      const tokenStates = maybeCollectionState.getTokenChildren();
      expect(tokenStates).toHaveLength(1);
      expect(tokenStates[0].name).toEqual('aString');
    });
  });
  describe.concurrent('getAllTokenChildren', () => {
    it('should return the tokens at any depth within the collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'medium'] },
          aString: {
            $type: 'string',
            $value: {
              small: 'small',
              medium: 'medium',
            },
          },
          aGroup: {
            anotherString: {
              $type: 'string',
              $value: {
                small: 'small',
                medium: 'medium',
              },
            },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      const tokenStates = maybeCollectionState.getAllTokenChildren();
      expect(tokenStates).toHaveLength(2);
      expect(tokenStates[0].name).toEqual('aString');
      expect(tokenStates[1].name).toEqual('anotherString');
    });
  });

  describe.concurrent('rename', () => {
    it('should rename the group and update all its children path and aliasReferences', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
          aNestedGroup: {
            aTokenInGroup: { $type: 'string', $value: { $alias: 'aCollection.aString' } },
          },
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeTokenState = sdtfEngine.query.getTokenState(
        new TreePath(['aCollection', 'aNestedGroup', 'aTokenInGroup']),
      );
      if (!maybeTokenState) throw new Error('Expected token to be resolved');

      const hasBeenRenamed = maybeTokenState.rename('updatedString');

      expect(hasBeenRenamed).toBe(true);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );
      if (!maybeCollectionState) throw new Error('Expected collectionResult to be resolved');

      const newCollectionName = 'updatedCollection';
      maybeCollectionState.rename(newCollectionName);

      expect(maybeCollectionState.name).toEqual(newCollectionName);

      sdtfEngine.query.getChildrenOf(new TreePath([newCollectionName])).forEach(child => {
        if (child.path.length === 2) {
          expect(child.path).toEqual(new TreePath([newCollectionName, child.name]));
        } else {
          expect(child.path).toEqual(new TreePath([newCollectionName, 'aNestedGroup', child.name]));
        }
      });

      const aliasReferences = sdtfEngine.query.getAliasReferencesFrom({
        treePath: new TreePath([newCollectionName, 'aNestedGroup', 'updatedString']),
      });

      expect(aliasReferences).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath([newCollectionName, 'aNestedGroup', 'updatedString']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: {
            treePath: new TreePath([newCollectionName, 'aString']),
            mode: null,
          },
        },
      ]);
    });
    it('should do nothing if the new name is the same as the current name', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
          aNestedGroup: {
            aTokenInGroup: { $type: 'string', $value: { $alias: 'aCollection.aString' } },
          },
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );
      if (!maybeCollectionState) throw new Error('Expected collectionResult to be resolved');

      const newCollectionName = 'aCollection';
      const hasBeenRenamed = maybeCollectionState.rename(newCollectionName);

      expect(hasBeenRenamed).toBe(false);

      const maybeFoundCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );
      if (!maybeFoundCollectionState) throw new Error('Expected collectionResult to be resolved');

      expect(maybeFoundCollectionState.name).toEqual(newCollectionName);
    });
  });
  describe.concurrent('renameMode', () => {
    it('should rename a mode of the collection', () => {
      const treeState = createTreeStateFromTokenTree({});

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small', 'medium']),
      );

      collectionState.renameMode('small', 'SMALL');

      expect(collectionState.innerAllowedModes).toEqual(['SMALL', 'medium']);
    });
    it('should rename a mode of the collection and its tokens', () => {
      const sdtfEngine = createSDTFEngine({
        aCollection: {
          $collection: { $modes: ['small', 'medium'] },
          aDimension: {
            $type: 'dimension',
            $value: {
              small: { value: 1, unit: 'px' },
              medium: { value: 2, unit: 'px' },
            },
          },
        },
      });

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );
      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      maybeCollectionState.renameMode('small', 'SMALL');

      expect(maybeCollectionState.innerAllowedModes).toEqual(['SMALL', 'medium']);

      const maybeTokenState = sdtfEngine.query.getTokenState(
        new TreePath(['aCollection', 'aDimension']),
      );
      if (!maybeTokenState) throw new Error('Expected collection to be resolved');

      expect(maybeTokenState.value).toStrictEqual({
        SMALL: { value: 1, unit: 'px' },
        medium: { value: 2, unit: 'px' },
      });
    });
    it('should fail renaming a mode when fromMode does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small', 'medium']),
      );

      expect(() => collectionState.renameMode('large', 'LARGE')).toThrowError(
        'Collection "aCollection" tried to rename mode "large" to "LARGE", but "large" is not in the allowed modes: "small","medium".',
      );
    });
    it('should fail renaming a mode when toMode already exists', () => {
      const treeState = createTreeStateFromTokenTree({});

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small', 'medium']),
      );

      expect(() => collectionState.renameMode('small', 'medium')).toThrowError(
        'Collection "aCollection" tried to rename mode "small" to "medium", but "medium" is already in the allowed modes: "small","medium".',
      );
    });
    it('should fail renaming a mode when toMode starts with $', () => {
      const treeState = createTreeStateFromTokenTree({});

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small', 'medium']),
      );

      expect(() => collectionState.renameMode('small', '$medium'))
        .toThrowErrorMatchingInlineSnapshot(`
          [ZodError: [
            {
              "code": "custom",
              "message": "$mode cannot start with a \\\"$\\\"",
              "path": [
                "aCollection"
              ]
            }
          ]]
        `);
    });
    it('should fail renaming a mode when toMode is an empty string', () => {
      const treeState = createTreeStateFromTokenTree({});

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small', 'medium']),
      );

      expect(() => collectionState.renameMode('small', '')).toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "too_small",
            "minimum": 1,
            "type": "string",
            "inclusive": true,
            "exact": false,
            "message": "$mode must be a non-empty string",
            "path": [
              "aCollection"
            ]
          }
        ]]
      `);
    });
  });
  describe.concurrent('deleteMode', () => {
    it('should delete a mode of the collection', () => {
      const treeState = createTreeStateFromTokenTree({});

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small', 'medium']),
      );

      collectionState.deleteMode('small');

      expect(collectionState.innerAllowedModes).toEqual(['medium']);
    });
    it('should delete a mode of the collection and its tokens', () => {
      const tokens: SpecifyDesignTokenFormat = {
        base: {
          $type: 'dimension',
          $value: { small: { value: 2, unit: 'px' } },
        },
        aCollection: {
          $collection: { $modes: ['small', 'medium', 'large'] },
          aDimension: {
            $type: 'dimension',
            $value: {
              small: { $alias: 'base', $mode: 'small' },
              medium: { value: 4, unit: 'px' },
              large: { $alias: 'base', $mode: 'large' }, // unresolvable
            },
          },
        },
      };
      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );
      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      maybeCollectionState.deleteMode('small');

      expect(maybeCollectionState.innerAllowedModes).toEqual(['medium', 'large']);

      const tokenState = sdtfEngine.query.getTokenState(
        new TreePath(['aCollection', 'aDimension']),
      );
      if (!tokenState) throw new Error('Expected collection to be resolved');

      expect(tokenState.value).toStrictEqual({
        medium: { value: 4, unit: 'px' },
        large: { $alias: 'base', $mode: 'large' },
      });
    });
    it('should fail deleting a mode when mode does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small', 'medium']),
      );

      expect(() => collectionState.deleteMode('large')).toThrowError(
        'Collection "aCollection" tried to delete mode "large", but "large" is not in the allowed modes: "small","medium".',
      );
    });
    it('should fail deleting a the last mode of a collection', () => {
      const treeState = createTreeStateFromTokenTree({});

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['aCollection']), ['small']),
      );

      expect(() => collectionState.deleteMode('small')).toThrowError(
        'Collection "aCollection" tried to delete mode "small", but it is the last mode of the collection.',
      );
    });
  });
  describe.concurrent('getJSONProperties', () => {
    it('should return the JSON properties of a declared collection with an implicit defaultMode', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'medium'] },
          $description: 'A collection',
          $extensions: { dope: true },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      expect(maybeCollectionState.getJSONProperties()).toEqual(tokens.aCollection);
    });
  });
  describe.concurrent('toJSON', () => {
    it('should return a JSON compatible collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'medium'] },
          $description: 'A collection',
          $extensions: { dope: true },
          aString: {
            $type: 'string',
            $value: { small: 'small', medium: 'medium' },
          },
          aGroup: {
            $description: 'A group',
            aNestedGroup: {},
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      expect(maybeCollectionState.toJSON()).toEqual(tokens.aCollection);
    });
  });
  describe.concurrent('move', () => {
    it('should move a collection at the root level', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aGroup', 'aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected result to be resolved');

      maybeCollectionState.move(TreePath.empty());

      expect(maybeCollectionState.path.length).toEqual(1);
      expect(maybeCollectionState.path.toString()).toEqual('aCollection');
    });
    it('should move a collection to a new path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
          aGroup: {},
          aString: {
            $type: 'string',
            $value: { default: 'aString' },
          },
        },
        bGroup: {},
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected result to be resolved');

      maybeCollectionState.move(new TreePath(['bGroup']));

      expect(maybeCollectionState.path.length).toEqual(2);
      expect(maybeCollectionState.path.toString()).toEqual('bGroup.aCollection');

      expect(maybeCollectionState.getAllChildren()).toHaveLength(2);
    });
    it("should fail when the target doesn't exist", () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected result to be resolved');

      expect(() => maybeCollectionState.move(new TreePath(['aGroup']))).toThrow(
        'Node "aGroup" does not exist.',
      );
    });
    it('should fail to move a collection if the target path is a token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
        },
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

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected result to be resolved');

      expect(() => maybeCollectionState.move(new TreePath(['color']))).toThrow(
        'Node "color" is a token. Target a group or the root node "[]"',
      );
    });
    it('should fail to move a collection in itself', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
          aGroup: {},
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected result to be resolved');

      expect(() => maybeCollectionState.move(new TreePath(['aCollection', 'aGroup']))).toThrow(
        'Node "aCollection.aGroup" is a child of the current node "aCollection".',
      );
    });
    it('should fail to move a collection in a collection', () => {
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

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aGroup', 'aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected result to be resolved');

      expect(() => maybeCollectionState.move(new TreePath(['bCollection']))).toThrow(
        'Node "bCollection" is a collection. Target a group or the root node "[]".',
      );
    });
    it('should fail to move a collection to a node that have a collection as parents', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
        },
        bCollection: {
          $collection: { $modes: ['default'] },
          bGroup: {},
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aCollection']),
      );

      if (!maybeCollectionState) throw new Error('Expected result to be resolved');

      expect(() => maybeCollectionState.move(new TreePath(['bCollection', 'bGroup']))).toThrow(
        'Nesting collection is not allowed. Node "bCollection.bGroup" include a collection as parents at path "bCollection".',
      );
    });
    it('should move a collection at the root level including his children', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
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
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aGroup', 'aCollection']),
      );
      const maybeTokenState = sdtfEngine.query.getTokenState(
        new TreePath(['aGroup', 'aCollection', 'aNestedGroup', 'aToken']),
      );
      const maybeGroupState = sdtfEngine.query.getGroupState(
        new TreePath(['aGroup', 'aCollection', 'aNestedGroup']),
      );

      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      maybeCollectionState.move(new TreePath([]));

      expect(maybeCollectionState.path.length).toEqual(1);
      expect(maybeCollectionState.path.toString()).toEqual('aCollection');

      if (!maybeTokenState) throw new Error('Expected token to be resolved');
      expect(maybeTokenState.path.toString()).toEqual('aCollection.aNestedGroup.aToken');

      if (!maybeGroupState) throw new Error('Expected group to be resolved');
      expect(maybeGroupState.path.toString()).toEqual('aCollection.aNestedGroup');
    });
    it('should move a collection at the root level including his children compute again aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
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
        },
        bToken: {
          $type: 'color',
          $value: {
            $alias: 'aGroup.aCollection.aNestedGroup.aToken',
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aGroup', 'aCollection']),
      );
      const maybeGroupState = sdtfEngine.query.getGroupState(
        new TreePath(['aGroup', 'aCollection', 'aNestedGroup']),
      );
      const maybeATokenState = sdtfEngine.query.getTokenState(
        new TreePath(['aGroup', 'aCollection', 'aNestedGroup', 'aToken']),
      );
      const maybeBTokenState = sdtfEngine.query.getTokenState(new TreePath(['bToken']));

      if (!maybeCollectionState) throw new Error('Expected collection to be resolved');

      maybeCollectionState.move(TreePath.empty());

      expect(maybeCollectionState.path.length).toEqual(1);
      expect(maybeCollectionState.path.toString()).toEqual('aCollection');

      if (!maybeGroupState) throw new Error('Expected group to be resolved');
      expect(maybeGroupState.path.toString()).toEqual('aCollection.aNestedGroup');

      if (!maybeATokenState) throw new Error('Expected token to be resolved');
      expect(maybeATokenState.path.toString()).toEqual('aCollection.aNestedGroup.aToken');

      if (!maybeBTokenState) throw new Error('Expected token to be resolved');
      expect(maybeBTokenState.value).toEqual({
        $alias: 'aCollection.aNestedGroup.aToken',
      });
    });
  });
  describe.concurrent('toCollectionStateParams', () => {
    it('should return the collection state params of a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aGroup', 'aCollection']),
      );
      if (!maybeCollectionState) throw new Error('Expected collectionResult to be resolved');

      const result = maybeCollectionState.toCollectionStateParams();

      expect(result).toStrictEqual({
        path: new TreePath(['aGroup', 'aCollection']),
        name: 'aCollection',
        $description: undefined,
        $extensions: undefined,
        allowedModes: ['default'],
      });
    });
  });
  describe.concurrent('toAnalyzedCollection', () => {
    it('should return the analyzed collection of a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
          },
        },
      };

      const sdtfEngine = createSDTFEngine(tokens);

      const maybeCollectionState = sdtfEngine.query.getCollectionState(
        new TreePath(['aGroup', 'aCollection']),
      );
      if (!maybeCollectionState) throw new Error('Expected collectionResult to be resolved');

      const result = maybeCollectionState.toAnalyzedCollection();

      expect(result).toStrictEqual({
        path: new TreePath(['aGroup', 'aCollection']),
        name: 'aCollection',
        $description: undefined,
        $extensions: undefined,
        $collection: { $modes: ['default'] },
        allowedModes: ['default'],
      });
    });
  });
});
