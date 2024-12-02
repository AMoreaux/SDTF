import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { GroupState, SDTFQuery, SpecifyDesignTokenFormat } from '../../../src/index.js';
import { TokenState } from '../../../src/engine/state/TokenState.js';
import { CollectionState } from '../../../src/engine/state/CollectionState.js';
import {
  AliasReference,
  StatefulAliasReference,
} from '../../../src/engine/state/AliasReferenceSet.js';

import { TreeState } from '../../../src/engine/state/TreeState.js';
import { SerializedView } from '../../../src/engine/state/ViewState.js';
import { SDTFEngineSerializedMetadata } from '../../../src/engine/SDTFEngineSerializedState.js';
import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import {
  createCollectionStateParams,
  createGroupStateParams,
  createTokenStateParams,
} from '../../_utils/createStateParams.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('TreeState', () => {
  describe.concurrent('constructor', () => {
    it('should create a new TreeState of all node types', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aCollection: {
          $collection: { $modes: ['small', 'large'] },
          aGroupInCollection: {
            $description: 'A group in a collection',
            aStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
          },
        },
        aGroup: {
          $description: 'A group',
          aStringInGroup: {
            $type: 'string',
            $value: { default: 'aStringInGroup' },
          },
          anAliasedString: {
            $type: 'string',
            $value: { $alias: 'aString' },
          },
          aCollection: {
            $collection: { $modes: ['small', 'large'] },
            aGroupInCollection: {
              $description: 'A group in a collection',
              aStringInCollection: {
                $type: 'string',
                $value: { small: 'a small value', large: 'a large value' },
              },
            },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(treeState).toBeInstanceOf(TreeState);

      expect(treeState.getAllGroupStates()).toHaveLength(3);
      expect(treeState.getAllCollectionStates()).toHaveLength(2);
      expect(treeState.getAllTokenStates()).toHaveLength(5);
    });
    it('should fail creating a new TreeState with circular alias dependencies', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { $alias: 'anotherString' },
        },
        anotherString: {
          $type: 'string',
          $value: { $alias: 'aString' },
        },
      };

      expect(() => {
        createTreeStateFromTokenTree(tokens);
      }).toThrow('A circular alias reference was found in initial token tree.');
    });
    it('should load views on start up', () => {
      const tokens: SpecifyDesignTokenFormat = {};
      const views: Array<SerializedView> = [
        {
          name: 'strings only',
          query: {
            where: { token: '.*', withTypes: { include: ['string'] }, select: true },
          },
        },
        {
          name: 'booleans only',
          query: {
            where: { token: '.*', withTypes: { include: ['boolean'] }, select: true },
          },
        },
      ];

      const metadata: SDTFEngineSerializedMetadata = {
        activeViewName: null,
        views,
      };

      const treeState = createTreeStateFromTokenTree(tokens, metadata);

      expect(treeState.listViews()).toStrictEqual(
        views.map(view => ({ ...view, isActive: false })),
      );
      expect(treeState.getActiveView()).toBe(null);
    });
    it('should load views and active view on start up', () => {
      const tokens: SpecifyDesignTokenFormat = {};
      const views: Array<SerializedView> = [
        {
          name: 'strings only',
          query: {
            where: { token: '.*', withTypes: { include: ['string'] }, select: true },
          },
        },
        {
          name: 'booleans only',
          query: {
            where: { token: '.*', withTypes: { include: ['boolean'] }, select: true },
          },
        },
      ];

      const metadata: SDTFEngineSerializedMetadata = {
        activeViewName: 'strings only',
        views,
      };

      const treeState = createTreeStateFromTokenTree(tokens, metadata);

      expect(treeState.listViews()).toStrictEqual(
        views.map((view, i) => ({ ...view, isActive: i === 0 ? true : false })),
      );
      expect((treeState.getActiveView() as any).name).toBe('strings only');
    });
  });

  describe.concurrent('reset', () => {
    it('should reset the tree', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
        aGroup: {},
        aCollection: { $collection: { $modes: ['aMode'] } },
      });

      treeState.reset();

      expect(treeState.getAllNodeStates()).toEqual([]);
      expect(treeState.getAllAliasReferences()).toEqual([]);
    });
  });

  describe.concurrent('listViews', () => {
    it('should list all registered views', () => {
      const tokens: SpecifyDesignTokenFormat = {};

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });
      treeState.registerView('booleans only', {
        where: { token: '.*', withTypes: { include: ['boolean'] }, select: true },
      });

      expect(treeState.listViews()).toStrictEqual([
        {
          name: 'strings only',
          query: {
            where: { token: '.*', withTypes: { include: ['string'] }, select: true },
          },
          isActive: false,
        },
        {
          name: 'booleans only',
          query: {
            where: { token: '.*', withTypes: { include: ['boolean'] }, select: true },
          },
          isActive: false,
        },
      ]);
    });
  });
  describe.concurrent('getActiveView', () => {
    it('should return the active view by self activating register', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const activeView = treeState.getActiveView();
      if (activeView === null) throw new Error('activeView is null');
      expect(activeView.name).toBe('strings only');
      expect(activeView.query).toStrictEqual({
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });
    });
    it('should return the active view by register and set active view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });
      treeState.setActiveView('strings only');

      const activeView = treeState.getActiveView();
      if (activeView === null) throw new Error('activeView is null');
      expect(activeView.name).toBe('strings only');
      expect(activeView.query).toStrictEqual({
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });
    });
    it('should return null when no views is selected', () => {
      const tokens: SpecifyDesignTokenFormat = {};

      const treeState = createTreeStateFromTokenTree(tokens);

      const activeView = treeState.getActiveView();
      expect(activeView).toBe(null);
    });
  });
  describe.concurrent('registerView', () => {
    it('should register a self activating view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const activeView = treeState.getActiveView();
      if (activeView === null) throw new Error('activeView is null');
      expect(activeView.name).toBe('strings only');
      expect(activeView.query).toStrictEqual({
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });
    });
    it('should register a view without self activating', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });

      expect(treeState.getActiveView()).toBe(null);

      treeState.setActiveView('strings only');

      expect((treeState.getActiveView() as any).name).toBe('strings only');
    });
    it('should register a view with a continuous query result', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const tokenStates = treeState.getAllTokenStates();

      expect(tokenStates).toHaveLength(1);
      expect(tokenStates[0].type).toBe('string');
    });
    it('should register a view with a non continuous query result', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'large'] },
          aGroupInCollection: {
            $description: 'A group in a collection',
            aStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
          },
        },
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: {
            token: '.*',
            withTypes: { include: ['string'] },
            select: true,
          },
        },
        true,
      );

      const tokenStates = treeState.getAllTokenStates();
      const groupStates = treeState.getAllGroupStates();
      const collectionsStates = treeState.getAllCollectionStates();

      expect(tokenStates).toHaveLength(2);
      expect(tokenStates[0].name).toBe('aStringInCollection');
      expect(tokenStates[1].name).toBe('aString');

      expect(groupStates).toHaveLength(0);
      expect(collectionsStates).toHaveLength(0);
    });
    it('should register a view with a empty result query', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { collection: '.*', select: true },
        },
        true,
      );

      const collectionStates = treeState.getAllCollectionStates();
      expect(collectionStates).toHaveLength(0);
    });
  });
  describe.concurrent('setActiveView', () => {
    it('should set an already registered view as active', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      expect((treeState.getActiveView() as any).name).toBe('strings only');

      treeState.registerView(
        'booleans only',
        {
          where: { token: '.*', withTypes: { include: ['boolean'] }, select: true },
        },
        true,
      );

      expect((treeState.getActiveView() as any).name).toBe('booleans only');

      treeState.setActiveView('strings only');

      expect((treeState.getActiveView() as any).name).toBe('strings only');
    });
    it('should reset the global view when invoked with null', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      expect((treeState.getActiveView() as any).name).toBe('strings only');

      treeState.setActiveView(null);

      expect(treeState.getActiveView()).toBe(null);
    });
    it('should fail when the view does not exist', () => {
      const tokens: SpecifyDesignTokenFormat = {};

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(() => {
        treeState.setActiveView('strings only');
      }).toThrow('View "strings only" does not exist.');
    });
  });
  describe.concurrent('disableViews', () => {
    it('should get back to the global view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aNumber: {
          $type: 'number',
          $value: { default: 1 },
          $description: 'A number',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      treeState.disableViews();

      expect(treeState.getAllTokenStates()).toHaveLength(2);
      expect(treeState.getActiveView()).toBe(null);
    });
  });
  describe.concurrent('withViewNodesState', () => {
    it('should call a function with a given registered view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aNumber: { $type: 'number', $value: { default: 1 } },
        aBoolean: { $type: 'boolean', $value: { default: true } },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });

      const result = treeState.withViewNodesState('strings only', nodes => {
        return nodes.tokens.all;
      });
      expect(result).toHaveLength(1);
    });
    it('should call a function with the contextual view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aNumber: { $type: 'number', $value: { default: 1 } },
        aBoolean: { $type: 'boolean', $value: { default: true } },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const result = treeState.withViewNodesState(undefined, nodes => {
        return nodes.tokens.all;
      });
      expect(result).toHaveLength(1);
    });
    it('should call a function with the global state', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aNumber: { $type: 'number', $value: { default: 1 } },
        aBoolean: { $type: 'boolean', $value: { default: true } },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const result = treeState.withViewNodesState(null, nodes => {
        return nodes.tokens.all;
      });
      expect(result).toHaveLength(3);
    });
    it('should fail when the view does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.withViewNodesState('strings only', () => {});
      }).toThrow('View "strings only" does not exist.');
    });
  });

  describe.concurrent('addAliasReference', () => {
    it('should register a resolvable alias', () => {
      const reference: AliasReference = {
        from: {
          treePath: new TreePath(['aGroup', 'aStringAlias']),
          valuePath: new ValuePath(['default']),
          mode: null,
        },
        to: {
          treePath: new TreePath(['aGroup', 'aString']),
          mode: null,
        },
        isResolvable: true,
      };

      const treeState = createTreeStateFromTokenTree({});
      treeState.addAliasReference(reference);

      expect(
        //  @ts-expect-error - private property
        Array.from(treeState.aliasReferences),
      ).toHaveLength(1);

      expect(
        //  @ts-expect-error - private property
        Array.from(treeState.aliasReferences)[0],
      ).toEqual(reference);
    });
    it('should register a unresolvable alias', () => {
      const reference: AliasReference = {
        from: {
          treePath: new TreePath(['aGroup', 'aStringAlias']),
          valuePath: new ValuePath(['default']),
          mode: null,
        },
        to: {
          treePath: new TreePath(['aGroup', 'aString']),
          mode: null,
        },
        isResolvable: false,
        reason: 'The alias is not resolvable',
      };

      const treeState = createTreeStateFromTokenTree({});
      treeState.addAliasReference(reference);

      expect(
        //  @ts-expect-error - private property
        Array.from(treeState.aliasReferences),
      ).toHaveLength(1);

      expect(
        //  @ts-expect-error - private property
        Array.from(treeState.aliasReferences)[0],
      ).toEqual(reference);
    });
    it('should fail registering an alias reference twice', () => {
      const reference: AliasReference = {
        from: {
          treePath: new TreePath(['aGroup', 'aStringAlias']),
          valuePath: new ValuePath(['default']),
          mode: null,
        },
        to: {
          treePath: new TreePath(['aGroup', 'aString']),
          mode: null,
        },
        isResolvable: true,
      };

      const treeState = createTreeStateFromTokenTree({});
      treeState.addAliasReference(reference);

      expect(() => {
        treeState.addAliasReference(reference);
      }).toThrow('Reference to "default" is circular.');
    });
  });
  describe.concurrent('updateAliasReference', () => {
    it('should update an alias reference', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: { $type: 'string', $value: { $alias: 'aString' } },
      });

      const referencesBeforeUpdate = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });
      expect(referencesBeforeUpdate).toHaveLength(1);

      const { from } = referencesBeforeUpdate[0];
      const updatedPayload = {
        from,
        to: {
          treePath: new TreePath(['invalid']),
          mode: null,
        },
        isResolvable: false,
        reason: 'The alias is not resolvable anymore',
      };
      treeState.updateAliasReference(referencesBeforeUpdate[0].from, updatedPayload);

      const referencesAfterUpdate = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });
      expect(referencesAfterUpdate).toHaveLength(1);
      expect(referencesAfterUpdate[0]).toEqual(updatedPayload);
    });
  });
  describe.concurrent('upsertAliasReference', () => {
    it('should register a new alias reference', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: { $type: 'string', $value: { default: 'anotherString' } },
      });

      const referencesBeforeUpdate = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });
      expect(referencesBeforeUpdate).toHaveLength(0);

      const updatedPayload: AliasReference = {
        isResolvable: true,
        from: {
          treePath: new TreePath(['aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: { treePath: new TreePath(['aString']), mode: null },
      };
      treeState.upsertAliasReference(updatedPayload);

      const referencesAfterUpdate = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });
      expect(referencesAfterUpdate).toHaveLength(1);
      expect(referencesAfterUpdate[0]).toEqual(updatedPayload);
    });
    it('should update an alias reference', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: { $type: 'string', $value: { $alias: 'aString' } },
      });

      const referencesBeforeUpdate = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });
      expect(referencesBeforeUpdate).toHaveLength(1);

      const { from } = referencesBeforeUpdate[0];
      const updatedPayload = {
        from,
        to: {
          treePath: new TreePath(['invalid']),
          mode: null,
        },
        isResolvable: false,
        reason: 'The alias is not resolvable anymore',
      };
      treeState.upsertAliasReference(updatedPayload);

      const referencesAfterUpdate = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });
      expect(referencesAfterUpdate).toHaveLength(1);
      expect(referencesAfterUpdate[0]).toEqual(updatedPayload);
    });
  });
  describe.concurrent('getAliasReference', () => {
    it('should return an alias reference', () => {
      const reference: AliasReference = {
        from: {
          treePath: new TreePath(['aGroup', 'aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['aGroup', 'aString']),
          mode: null,
        },
        isResolvable: true,
      };

      const treeState = createTreeStateFromTokenTree({});
      treeState.addAliasReference(reference);

      expect(
        treeState.getAliasReference({
          treePath: new TreePath(['aGroup', 'aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        }),
      ).toEqual(reference);
    });
    it('should return undefined if the alias reference does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(
        treeState.getAliasReference({
          treePath: new TreePath(['aGroup', 'aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        }),
      ).toEqual(undefined);
    });
  });
  describe.concurrent('getAliasReferencesTo', () => {
    it('should return all alias references to a tree path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aString' },
        },
        anotherStringAlias: {
          $type: 'string',
          $value: { $alias: 'aString' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getAliasReferencesTo({
          treePath: new TreePath(['aString']),
        }),
      ).toEqual([
        {
          isResolvable: true,
          from: {
            mode: null,
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
          },
          to: { mode: null, treePath: new TreePath(['aString']) },
        },
        {
          isResolvable: true,
          from: {
            mode: null,
            treePath: new TreePath(['anotherStringAlias']),
            valuePath: new ValuePath([]),
          },
          to: { mode: null, treePath: new TreePath(['aString']) },
        },
      ]);
    });
  });
  describe.concurrent('getAliasReferencesFrom', () => {
    it('should return all alias references from a tree path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimensionUnit: {
          $type: 'dimensionUnit',
          $value: { default: 'px' },
        },
        aNumber: {
          $type: 'number',
          $value: { default: 1 },
        },
        aDimension: {
          $type: 'dimension',
          $value: {
            base: {
              value: { $alias: 'aNumber', $mode: 'default' },
              unit: { $alias: 'aDimensionUnit', $mode: 'default' },
            },
          },
        },
        aCompositeDimension: {
          $type: 'dimension',
          $value: {
            base: { $alias: 'aDimension', $mode: 'base' },
            alt: {
              value: { $alias: 'anUndefinedNumber', $mode: 'default' },
              unit: { $alias: 'aDimensionUnit', $mode: 'default' },
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const references = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aCompositeDimension']),
      });

      expect(references).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aCompositeDimension']),
            mode: 'base',
            valuePath: new ValuePath([]),
          },
          to: {
            mode: 'base',
            treePath: new TreePath(['aDimension']),
          },
        },
        {
          isResolvable: false,
          from: {
            treePath: new TreePath(['aCompositeDimension']),
            mode: 'alt',
            valuePath: new ValuePath(['value']),
          },
          reason: 'Token "anUndefinedNumber" does not exist',
          to: {
            mode: 'default',
            treePath: new TreePath(['anUndefinedNumber']),
          },
        },
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aCompositeDimension']),
            mode: 'alt',
            valuePath: new ValuePath(['unit']),
          },
          to: {
            mode: 'default',
            treePath: new TreePath(['aDimensionUnit']),
          },
        },
      ]);
    });
  });
  describe.concurrent('getStatefulAliasReference', () => {
    it('should return a resolved stateful alias reference', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: {
            $type: 'string',
            $value: { default: 'a string' },
          },
          aStringAlias: {
            $type: 'string',
            $value: { $alias: 'aGroup.aString' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const result = treeState.getStatefulAliasReference({
        treePath: new TreePath(['aGroup', 'aStringAlias']),
        valuePath: new ValuePath([]),
        mode: null,
      });

      const reference: StatefulAliasReference = {
        status: 'resolved',
        from: {
          treePath: new TreePath(['aGroup', 'aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['aGroup', 'aString']),
          mode: null,
        },
        tokenState: treeState.getTokenState(new TreePath(['aGroup', 'aString'])) as any,
      };

      expect(result).toEqual(reference);
    });
    it('should return an unresolvable stateful alias if the alias reference does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(
        treeState.getStatefulAliasReference({
          treePath: new TreePath(['aGroup', 'aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        }),
      ).toEqual({
        status: 'unresolvable',
        from: {
          treePath: new TreePath(['aGroup', 'aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath([]),
          mode: null,
        },
        unresolvableTokenState: expect.anything(),
      });
    });
    it('should return a resolved stateful alias reference despite the token not being in the active view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aStringRef: {
          $type: 'string',
          $value: { default: 'a string' },
        },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aStringRef' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aStringRef only',
        {
          where: { token: 'aStringRef', select: true },
        },
        true,
      );

      const result = treeState.getStatefulAliasReference({
        treePath: new TreePath(['aStringAlias']),
        valuePath: new ValuePath([]),
        mode: null,
      });

      const reference: StatefulAliasReference = {
        status: 'resolved',
        from: {
          treePath: new TreePath(['aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: {
          treePath: new TreePath(['aStringRef']),
          mode: null,
        },
        tokenState: treeState.getTokenState(new TreePath(['aStringRef'])) as any,
      };

      expect(result).toEqual(reference);
    });
  });
  describe.concurrent('getStatefulAliasReferencesTo', () => {
    it('should return all stateful alias references to a tree path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aString' },
        },
        anotherStringAlias: {
          $type: 'string',
          $value: { default: { $alias: 'aString', $mode: 'default' } },
        },
        anUnresolvableStringAlias: {
          $type: 'string',
          $value: { $alias: 'aNonExistentString' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getStatefulAliasReferencesTo({
          treePath: new TreePath(['aString']),
        }),
      ).toEqual([
        {
          status: 'resolved',
          from: {
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: { treePath: new TreePath(['aString']), mode: null },
          tokenState: expect.anything(),
        },
        {
          status: 'resolved',
          from: {
            treePath: new TreePath(['anotherStringAlias']),
            valuePath: new ValuePath([]),
            mode: 'default',
          },
          to: { treePath: new TreePath(['aString']), mode: 'default' },
          tokenState: expect.anything(),
        },
      ]);

      expect(
        treeState.getStatefulAliasReferencesTo({
          treePath: new TreePath(['aNonExistentString']),
        }),
      ).toEqual([
        {
          status: 'unresolvable',
          from: {
            treePath: new TreePath(['anUnresolvableStringAlias']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: { treePath: new TreePath(['aNonExistentString']), mode: null },
          unresolvableTokenState: expect.anything(),
        },
      ]);
    });
    it('should throw if the reference does not point to an existing token', () => {
      const treeState = createTreeStateFromTokenTree({});

      treeState.addAliasReference({
        isResolvable: true,
        from: {
          treePath: new TreePath(['aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: { treePath: new TreePath(['aString']), mode: null },
      });

      expect(() =>
        treeState.getStatefulAliasReferencesTo({
          treePath: new TreePath(['aString']),
        }),
      ).toThrowError('Could not find token "aStringAlias".');
    });
    it('should return all stateful alias references to a tree path despite the token not being in the active view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aStringRef: {
          $type: 'string',
          $value: { default: 'a string' },
        },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aStringRef' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'nothing',
        {
          where: { token: 'noneMatching', select: true },
        },
        true,
      );

      expect(
        treeState.getStatefulAliasReferencesTo({
          treePath: new TreePath(['aStringRef']),
        }),
      ).toEqual([
        {
          status: 'resolved',
          from: {
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: { treePath: new TreePath(['aStringRef']), mode: null },
          tokenState: expect.anything(),
        },
      ]);
    });
  });
  describe.concurrent('getStatefulAliasReferencesFrom', () => {
    it('should return all stateful alias references from a tree path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimensionUnit: {
          $type: 'dimensionUnit',
          $value: { default: 'px' },
        },
        aNumber: {
          $type: 'number',
          $value: { default: 1 },
        },
        aDimension: {
          $type: 'dimension',
          $value: {
            base: {
              value: { $alias: 'aNumber', $mode: 'default' },
              unit: { $alias: 'aDimensionUnit', $mode: 'default' },
            },
          },
        },
        aCompositeDimension: {
          $type: 'dimension',
          $value: {
            base: { $alias: 'aDimension', $mode: 'base' },
            alt: {
              value: { $alias: 'anUndefinedNumber', $mode: 'default' },
              unit: { $alias: 'aDimensionUnit', $mode: 'default' },
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getStatefulAliasReferencesFrom({
          treePath: new TreePath(['aCompositeDimension']),
        }),
      ).toEqual([
        {
          status: 'resolved',
          from: {
            treePath: new TreePath(['aCompositeDimension']),
            valuePath: new ValuePath([]),
            mode: 'base',
          },
          to: { treePath: new TreePath(['aDimension']), mode: 'base' },
          tokenState: expect.anything(),
        },
        {
          status: 'unresolvable',
          from: {
            treePath: new TreePath(['aCompositeDimension']),
            valuePath: new ValuePath(['value']),
            mode: 'alt',
          },
          to: { treePath: new TreePath(['anUndefinedNumber']), mode: 'default' },
          unresolvableTokenState: expect.anything(),
        },
        {
          status: 'resolved',
          from: {
            treePath: new TreePath(['aCompositeDimension']),
            valuePath: new ValuePath(['unit']),
            mode: 'alt',
          },
          to: { treePath: new TreePath(['aDimensionUnit']), mode: 'default' },
          tokenState: expect.anything(),
        },
      ]);
    });
    it('should throw if the reference does not point to an existing token', () => {
      const treeState = createTreeStateFromTokenTree({});

      treeState.addAliasReference({
        isResolvable: true,
        from: {
          treePath: new TreePath(['aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: { treePath: new TreePath(['aString']), mode: null },
      });

      expect(() =>
        treeState.getStatefulAliasReferencesFrom({
          treePath: new TreePath(['aStringAlias']),
        }),
      ).toThrowError('Could not find token "aString".');
    });
    it('should return all stateful alias references from a tree path despite the token not being in the active view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aStringRef: {
          $type: 'string',
          $value: { default: 'a string' },
        },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aStringRef' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'nothing',
        {
          where: { token: 'noneMatching', select: true },
        },
        true,
      );

      expect(
        treeState.getStatefulAliasReferencesFrom({
          treePath: new TreePath(['aStringAlias']),
        }),
      ).toEqual([
        {
          status: 'resolved',
          from: {
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: { treePath: new TreePath(['aStringRef']), mode: null },
          tokenState: expect.anything(),
        },
      ]);
    });
  });
  describe.concurrent('deleteOneAliasReference', () => {
    it('should delete one alias reference', () => {
      const treeState = createTreeStateFromTokenTree({});

      treeState.addAliasReference({
        isResolvable: true,
        from: {
          treePath: new TreePath(['aStringAlias']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: { treePath: new TreePath(['aString']), mode: null },
      });

      treeState.deleteOneAliasReference({
        treePath: new TreePath(['aStringAlias']),
        valuePath: new ValuePath([]),
        mode: null,
      });

      expect(
        treeState.getAliasReferencesFrom({ treePath: new TreePath(['aStringAlias']) }),
      ).toEqual([]);
    });
  });

  describe.concurrent('isAvailablePath', () => {
    it('should return true if the path is available', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(treeState.isAvailablePath(new TreePath(['foo']))).toBe(true);
    });
    it('should return false if the path is not available', () => {
      const treeState = createTreeStateFromTokenTree({
        foo: {
          $type: 'string',
          $value: { default: 'aString' },
        },
      });

      expect(treeState.isAvailablePath(new TreePath(['foo']))).toBe(false);
    });
  });
  describe.concurrent('isExistingParentPath', () => {
    it('should return true if the parent path exists', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      expect(treeState.isExistingParentPath(new TreePath(['aGroup', 'foo']))).toBe(true);
    });
    it('should return true if the parent is the root', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(treeState.isExistingParentPath(new TreePath(['foo']))).toBe(true);
    });
    it('should return true if the parent is the root and the node already exists', () => {
      const treeState = createTreeStateFromTokenTree({
        foo: {},
      });

      expect(treeState.isExistingParentPath(new TreePath(['foo']))).toBe(true);
    });
    it('should return false if the parent path does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(treeState.isExistingParentPath(new TreePath(['aGroup', 'foo']))).toBe(false);
    });
  });
  describe.concurrent('updateChildrenPaths', () => {
    it('should update the paths of all finalNodes at the given index', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
          aNestedGroup: {
            aStringInGroup: { $type: 'string', $value: { $alias: 'aGroup.aString' } },
          },
          aCollection: {
            $collection: { $modes: ['default'] },
            aStringInCollection: { $type: 'string', $value: { $alias: 'aGroup.aString' } },
          },
          anAddedString: {
            $type: 'string',
            $value: { $alias: 'aGroup.aString' },
          },
        },
      });

      treeState.updateChildrenPaths(new TreePath(['aGroup']), 'anUpdatedGroup');

      const nodes = treeState.getChildrenOf(new TreePath(['anUpdatedGroup']));
      expect(nodes).toHaveLength(6);

      nodes.forEach(node => {
        if (node.path.length > 2) {
          if (node.path.toArray().includes('aCollection')) {
            expect(node.path).toEqual(new TreePath(['anUpdatedGroup', 'aCollection', node.name]));
            expect(node.path.toString()).toEqual('anUpdatedGroup.aCollection.' + node.name);
          } else {
            expect(node.path).toEqual(new TreePath(['anUpdatedGroup', 'aNestedGroup', node.name]));
            expect(node.path.toString()).toEqual('anUpdatedGroup.aNestedGroup.' + node.name);
          }
        } else {
          expect(node.path).toEqual(new TreePath(['anUpdatedGroup', node.name]));
          expect(node.path.toString()).toEqual('anUpdatedGroup.' + node.name);
        }
      });

      const aliasReferences = treeState.getAliasReferencesTo({
        treePath: new TreePath(['anUpdatedGroup', 'aString']),
      });
      expect(aliasReferences).toHaveLength(3);

      expect.assertions(15);
    });
    it('should update the paths of all finalNodes at the given index despite an active view being applied', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
          aNestedGroup: {
            aStringInGroup: { $type: 'string', $value: { $alias: 'aGroup.aString' } },
          },
          aCollection: {
            $collection: { $modes: ['default'] },
            aStringInCollection: { $type: 'string', $value: { $alias: 'aGroup.aString' } },
          },
        },
      });

      treeState.registerView(
        'aGroup only',
        {
          where: { collection: 'aGroup', select: true },
        },
        true,
      );

      treeState.updateChildrenPaths(new TreePath(['aGroup']), 'anUpdatedGroup');

      expect(treeState.toJSON()).toStrictEqual({
        aGroup: {},
        anUpdatedGroup: {
          aCollection: {
            $collection: {
              $modes: ['default'],
            },
            aStringInCollection: {
              $type: 'string',
              $value: {
                $alias: 'anUpdatedGroup.aString',
              },
            },
          },
          aNestedGroup: {
            aStringInGroup: {
              $type: 'string',
              $value: {
                $alias: 'anUpdatedGroup.aString',
              },
            },
          },
          aString: {
            $type: 'string',
            $value: {
              default: 'aString',
            },
          },
        },
      });
    });
  });
  describe.concurrent('addCollection', () => {
    it('should add a collection to the tree', () => {
      const treeState = createTreeStateFromTokenTree({});

      treeState.addCollection(new TreePath(['aCollection']), {
        $collection: { $modes: ['aMode'] },
      });

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState).toBeInstanceOf(CollectionState);
      expect(maybeCollectionState.path).toEqual(new TreePath(['aCollection']));
    });
    it('should add a collection to the tree and update the view', () => {
      const treeState = createTreeStateFromTokenTree({});

      treeState.registerView(
        'aCollection only',
        {
          where: { collection: 'aCollection', select: true },
        },
        true,
      );

      treeState.addCollection(new TreePath(['aCollection']), {
        $collection: { $modes: ['aMode'] },
      });

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState).toBeInstanceOf(CollectionState);
      expect(maybeCollectionState.path).toEqual(new TreePath(['aCollection']));

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aCollection only');
    });
    it('should fail when the path is already taken by another node', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: { $collection: { $modes: ['aMode'] } },
      });

      expect(() => {
        treeState.addCollection(new TreePath(['aCollection']), {
          $collection: { $modes: ['aMode'] },
        });
      }).toThrow('Path "aCollection" is already used.');
    });
    it('should fail when the parent path does not exist', () => {
      expect(() => {
        const treeState = createTreeStateFromTokenTree({});

        treeState.addCollection(new TreePath(['aGroup', 'aCollection']), {
          $collection: { $modes: ['aMode'] },
        });
      }).toThrow('Parent path for "aGroup.aCollection" does not exist.');

      expect(() => {
        const treeState = createTreeStateFromTokenTree({
          aCollection: {},
        });

        treeState.addCollection(new TreePath(['aGroup', 'undefined one', 'anotherCollection']), {
          $collection: { $modes: ['aMode'] },
        });
      }).toThrow('Parent path for "aGroup.undefined one.anotherCollection" does not exist.');
    });
    it('should fail when trying to nest a collection within a collection', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: { $collection: { $modes: ['aMode'] } },
      });

      expect(() => {
        treeState.addCollection(new TreePath(['aCollection', 'anotherCollection']), {
          $collection: { $modes: ['aMode'] },
        });
      }).toThrow(
        'Collection "aCollection.anotherCollection" is nested in collection "aCollection".',
      );
    });
  });
  describe.concurrent('renameCollection', () => {
    it('should rename a collection and its children', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['aMode'] },
          aColor: {
            $type: 'color',
            $value: { aMode: { model: 'hex', hex: '#ffffff', alpha: 1 } },
          },
        },
      });

      treeState.renameCollection(new TreePath(['aCollection']), 'aCollectionRenamed');

      const maybeCollectionState = treeState.getCollectionState(
        new TreePath(['aCollectionRenamed']),
      );
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState.path).toEqual(new TreePath(['aCollectionRenamed']));

      const maybeTokenState = treeState.getTokenState(
        new TreePath(['aCollectionRenamed', 'aColor']),
      );
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState.path).toEqual(new TreePath(['aCollectionRenamed', 'aColor']));
    });
    it('should rename a collection and update the view', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['aMode'] },
          aColor: {
            $type: 'color',
            $value: { aMode: { model: 'hex', hex: '#ffffff', alpha: 1 } },
          },
        },
      });

      treeState.registerView(
        'aCollectionRenamed only',
        {
          where: { collection: 'aCollectionRenamed', select: true },
        },
        true,
      );

      treeState.renameCollection(new TreePath(['aCollection']), 'aCollectionRenamed');

      const maybeCollectionState = treeState.getCollectionState(
        new TreePath(['aCollectionRenamed']),
      );
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState.name).toEqual('aCollectionRenamed');

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aCollectionRenamed only');
    });
    it('should fail when the path does not exist', () => {
      expect(() => {
        const treeState = createTreeStateFromTokenTree({});

        treeState.renameCollection(new TreePath(['aCollection']), 'aCollectionRenamed');
      }).toThrow('Collection "aCollection" does not exist.');
    });
    it('should fail when the new path is already taken by another node', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: { $collection: { $modes: ['aMode'] } },
        aCollectionRenamed: { $collection: { $modes: ['aMode'] } },
      });

      expect(() => {
        treeState.renameCollection(new TreePath(['aCollection']), 'aCollectionRenamed');
      }).toThrow('Path "aCollectionRenamed" is already taken.');
    });
  });
  describe.concurrent('updateCollectionDescription', () => {
    it('should update the description of a collection', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: { $collection: { $modes: ['aMode'] } },
      });

      treeState.updateCollectionDescription(new TreePath(['aCollection']), 'aDescription');

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState.description).toBe('aDescription');
    });
    it('should update the description of a collection and update the view', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: { $collection: { $modes: ['aMode'] } },
      });

      treeState.registerView(
        'aDescription only',
        {
          where: {
            collection: {
              name: '.*',
              description: 'aDescription',
            },
            select: true,
          },
        },
        true,
      );

      treeState.updateCollectionDescription(new TreePath(['aCollection']), 'aDescription');

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState.description).toBe('aDescription');

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aDescription only');
    });
    it('should fail when the collection does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.updateCollectionDescription(new TreePath(['aCollection']), 'aDescription');
      }).toThrow('Collection "aCollection" does not exist.');
    });
  });
  describe.concurrent('updateCollectionExtensions', () => {
    it('should update the extensions of a collection', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: { $collection: { $modes: ['aMode'] } },
      });

      treeState.updateCollectionExtensions(new TreePath(['aCollection']), { extended: true });

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState.extensions).toEqual({ extended: true });
    });
    it('should fail when the collection does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.updateCollectionExtensions(new TreePath(['aCollection']), { extended: true });
      }).toThrow('Collection "aCollection" does not exist.');
    });
  });
  describe.concurrent('renameCollectionMode', () => {
    it('should rename a collection mode and its children', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['light', 'dark'] },
          aColor: {
            $type: 'color',
            $value: {
              light: { model: 'hex', hex: '#ffffff', alpha: 1 },
              dark: { model: 'hex', hex: '#000000', alpha: 1 },
            },
          },
        },
      });

      treeState.renameCollectionMode(new TreePath(['aCollection']), 'light', 'LIGHT');

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState.allowedModes).toEqual(['LIGHT', 'dark']);

      const maybeTokenState = treeState.getTokenState(new TreePath(['aCollection', 'aColor']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState.modes).toEqual(['dark', 'LIGHT']);
    });
    it('should rename a collection mode and update the view', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['light', 'dark'] },
          aColor: {
            $type: 'color',
            $value: {
              light: { model: 'hex', hex: '#ffffff', alpha: 1 },
              dark: { model: 'hex', hex: '#000000', alpha: 1 },
            },
          },
        },
      });

      treeState.registerView(
        'LIGHT mode only',
        {
          where: { collection: '.*', withModes: { include: ['LIGHT'] }, select: true },
        },
        true,
      );

      treeState.renameCollectionMode(new TreePath(['aCollection']), 'light', 'LIGHT');

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState.allowedModes).toEqual(['LIGHT', 'dark']);

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('LIGHT mode only');
    });
    it('should fail when the collection does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.renameCollectionMode(new TreePath(['aCollection']), 'light', 'LIGHT');
      }).toThrow('Collection "aCollection" does not exist.');
    });
  });
  describe.concurrent('deleteCollectionMode', () => {
    it('should delete a collection mode and its children', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['light', 'dark'] },
          aColor: {
            $type: 'color',
            $value: {
              light: { model: 'hex', hex: '#ffffff', alpha: 1 },
              dark: { model: 'hex', hex: '#000000', alpha: 1 },
            },
          },
        },
      });

      treeState.deleteCollectionMode(new TreePath(['aCollection']), 'light');

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      if (!maybeCollectionState) {
        throw new Error('Collection is unresolvable');
      }
      expect(maybeCollectionState.allowedModes).toEqual(['dark']);

      const maybeTokenState = treeState.getTokenState(new TreePath(['aCollection', 'aColor']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState.modes).toEqual(['dark']);
    });
    it('should delete a collection mode and update the view', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['light', 'dark'] },
          aColor: {
            $type: 'color',
            $value: {
              light: { model: 'hex', hex: '#ffffff', alpha: 1 },
              dark: { model: 'hex', hex: '#000000', alpha: 1 },
            },
          },
        },
      });

      treeState.registerView(
        'dark mode only',
        {
          where: { collection: '.*', withModes: { include: ['dark'] }, select: true },
        },
        true,
      );

      treeState.deleteCollectionMode(new TreePath(['aCollection']), 'dark');

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      expect(maybeCollectionState).toBe(undefined);

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('dark mode only');
    });
    it('should fail when the collection does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.deleteCollectionMode(new TreePath(['aCollection']), 'light');
      }).toThrow('Collection "aCollection" does not exist.');
    });
  });
  describe.concurrent('deleteCollection', () => {
    it('should delete a collection', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['aMode'] },
          aString: { $type: 'string', $value: { aMode: 'aString' } },
          aStringAlias: {
            $type: 'string',
            $value: { $alias: 'aCollection.aString' },
          },
          aGroup: {
            $description: 'a nested group',
          },
        },
      });

      treeState.deleteCollection(new TreePath(['aCollection']));

      const result = treeState.getAllNodeStates();
      expect(result).toHaveLength(0);

      expect(
        // @ts-expect-error - private property
        Array.from(treeState.aliasReferences),
      ).toEqual([]);
    });
    it('should delete a collection, delete the alias references from it and unlink alias references to it', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['aMode'] },
          aString: { $type: 'string', $value: { aMode: 'aString' } },
          aStringAlias: {
            $type: 'string',
            $value: { $alias: 'aCollection.aString' },
          },
        },
        aStringAlias: { $type: 'string', $value: { $alias: 'aCollection.aStringAlias' } },
      });

      treeState.deleteCollection(new TreePath(['aCollection']));

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection']));
      expect(maybeCollectionState).toBe(undefined);

      const fromAliasReferences = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aCollection', 'aStringAlias']),
      });
      expect(fromAliasReferences).toEqual([]);

      const toAliasReferences = treeState.getAliasReferencesTo({
        treePath: new TreePath(['aCollection', 'aStringAlias']),
      });
      expect(toAliasReferences).toHaveLength(1);
      expect(toAliasReferences[0].isResolvable).toBe(false);
    });
    it('should delete a collection and its children and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['aMode'] },
            aString: { $type: 'string', $value: { aMode: 'aString' } },
          },
          aStringInGroup: { $type: 'string', $value: { $alias: 'aGroup.aCollection.aString' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aGroup',
        {
          where: { group: 'aGroup', select: { children: true } },
        },
        true,
      );

      treeState.deleteCollection(new TreePath(['aGroup', 'aCollection']));

      const result = treeState.getAllNodeStates();
      expect(result).toHaveLength(2);

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aGroup');
    });
    it('should fail when the collection does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.deleteCollection(new TreePath(['aCollection']));
      }).toThrow('Collection "aCollection" does not exist.');
    });
  });
  describe.concurrent('moveCollection', () => {
    it('should move a collection', () => {
      const treeState = createTreeStateFromTokenTree({
        bGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
          },
        },
      });

      const maybeCollectionState = treeState.getCollectionState(
        new TreePath(['bGroup', 'aCollection']),
      );

      treeState.moveCollection(new TreePath(['bGroup', 'aCollection']), TreePath.empty());

      if (!maybeCollectionState) throw new Error('Collection state is unresolvable');
      expect(maybeCollectionState.path.toString()).toEqual('aCollection');
    });
    it('should move a collection and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aGroup',
        {
          where: { group: 'aGroup', select: { children: true } },
        },
        true,
      );

      const before = treeState.getAllNodeStates();
      expect(before).toHaveLength(2);

      treeState.moveCollection(new TreePath(['aGroup', 'aCollection']), TreePath.empty());

      const after = treeState.getAllNodeStates();
      expect(after).toHaveLength(1);
      expect(after[0].path).toEqual(new TreePath(['aGroup']));

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aGroup');
    });
    it('should fail when the collection does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.moveCollection(new TreePath(['aCollection']), TreePath.empty());
      }).toThrow('Collection "aCollection" does not exist.');
    });
  });
  describe.concurrent('truncateCollection', () => {
    it('should truncate a collection', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['aMode'] },
          aString: { $type: 'string', $value: { aMode: 'aString' } },
          aNestedGroup: {
            aString: { $type: 'string', $value: { aMode: 'aString' } },
          },
        },
      });

      treeState.truncateCollection(new TreePath(['aCollection']));

      const result = treeState.getAllNodeStates();
      expect(result).toHaveLength(1);
      expect(result[0].path).toEqual(new TreePath(['aCollection']));

      expect(treeState.getAllAliasReferences()).toEqual([]);
    });
    it('should truncate a collection, delete the alias references from it and unlink alias references to it', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection1: {
          $collection: { $modes: ['aMode'] },
          aString: { $type: 'string', $value: { aMode: 'aString' } },
          aStringAlias: {
            $type: 'string',
            $value: { $alias: 'aCollection1.aString' },
          },
        },
        aCollection2: {
          $collection: { $modes: ['aMode'] },
          aString: { $type: 'string', $value: { aMode: 'aString' } },
          anotherStringAlias: {
            $type: 'string',
            $value: { $alias: 'aCollection1.aStringAlias' },
          },
        },
      });

      treeState.truncateCollection(new TreePath(['aCollection1']));

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['aCollection1']));
      expect(maybeCollectionState).toBeInstanceOf(CollectionState);

      const remainingAliasReferences = treeState.getAllAliasReferences();
      expect(remainingAliasReferences).toHaveLength(1);
      expect(remainingAliasReferences).toStrictEqual([
        {
          isResolvable: false,
          reason: 'Token at path "aCollection1.aStringAlias" has been unlinked',
          from: {
            treePath: new TreePath(['aCollection2', 'anotherStringAlias']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: { treePath: new TreePath(['aCollection1', 'aStringAlias']), mode: null },
        },
      ]);
    });
    it('should truncate a collection and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
            aString: { $type: 'string', $value: { default: 'aString' } },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aCollection',
        {
          where: { collection: 'aCollection', select: { children: true } },
        },
        true,
      );

      const before = treeState.getAllNodeStates();
      expect(before).toHaveLength(2);

      treeState.truncateCollection(new TreePath(['aGroup', 'aCollection']));

      const after = treeState.getAllNodeStates();
      expect(after).toHaveLength(1);
      expect(after[0].path).toEqual(new TreePath(['aGroup', 'aCollection']));

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aCollection');
    });
    it('should fail when the collection does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.truncateCollection(new TreePath(['aCollection']));
      }).toThrow('Collection "aCollection" does not exist.');
    });
  });
  describe.concurrent('addGroup', () => {
    it('should add a group to the tree', () => {
      const treeState = createTreeStateFromTokenTree({});

      treeState.addGroup(new TreePath(['aGroup']), {});

      const maybeGroupState = treeState.getGroupState(new TreePath(['aGroup']));
      if (!maybeGroupState) {
        throw new Error('Group is unresolvable');
      }
      expect(maybeGroupState).toBeInstanceOf(GroupState);
      expect(maybeGroupState.path).toEqual(new TreePath(['aGroup']));
    });
    it('should add a group to the tree and update the view', () => {
      const treeState = createTreeStateFromTokenTree({});

      treeState.registerView(
        'aGroup only',
        {
          where: { group: 'aGroup', select: true },
        },
        true,
      );

      treeState.addGroup(new TreePath(['aGroup']), {});

      const maybeGroupState = treeState.getGroupState(new TreePath(['aGroup']));
      if (!maybeGroupState) {
        throw new Error('Group is unresolvable');
      }
      expect(maybeGroupState).toBeInstanceOf(GroupState);
      expect(maybeGroupState.path).toEqual(new TreePath(['aGroup']));

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aGroup only');
    });
    it('should fail when the path is already taken by another node', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      treeState.addGroup(new TreePath(['aGroup', 'aString']), {});

      expect(() => {
        treeState.addGroup(new TreePath(['aGroup', 'aString']), {});
      }).toThrow('Path "aGroup.aString" is already used.');
    });
    it('should fail when the parent path does not exist', () => {
      expect(() => {
        const treeState = createTreeStateFromTokenTree({});

        treeState.addGroup(new TreePath(['aGroup', 'aNestedGroup']), {});
      }).toThrow('Parent path for "aGroup.aNestedGroup" does not exist.');

      expect(() => {
        const treeState = createTreeStateFromTokenTree({
          aGroup: {},
        });

        treeState.addGroup(new TreePath(['aGroup', 'undefined one', 'anotherGroup']), {});
      }).toThrow('Parent path for "aGroup.undefined one.anotherGroup" does not exist.');
    });
  });
  describe.concurrent('renameGroup', () => {
    it('should rename a group', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      treeState.renameGroup(new TreePath(['aGroup']), 'aRenamedGroup');

      const maybeGroupState = treeState.getGroupState(new TreePath(['aRenamedGroup']));
      if (!maybeGroupState) {
        throw new Error('Group is unresolvable');
      }
      expect(maybeGroupState).toBeInstanceOf(GroupState);
      expect(maybeGroupState.path).toEqual(new TreePath(['aRenamedGroup']));
    });
    it('should rename a group and update the view', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      treeState.registerView(
        'aRenamedGroup only',
        {
          where: { group: 'aRenamedGroup', select: true },
        },
        true,
      );

      treeState.renameGroup(new TreePath(['aGroup']), 'aRenamedGroup');

      const maybeGroupState = treeState.getGroupState(new TreePath(['aRenamedGroup']));
      if (!maybeGroupState) {
        throw new Error('Group is unresolvable');
      }
      expect(maybeGroupState).toBeInstanceOf(GroupState);
      expect(maybeGroupState.path).toEqual(new TreePath(['aRenamedGroup']));

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aRenamedGroup only');
    });
    it('should fail when the group does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.renameGroup(new TreePath(['aGroup']), 'aRenamedGroup');
      }).toThrow('Group "aGroup" does not exist.');
    });
    it('should fail when the path is already taken by another node', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
        aRenamedGroup: {},
      });

      expect(() => {
        treeState.renameGroup(new TreePath(['aGroup']), 'aRenamedGroup');
      }).toThrow('Path "aRenamedGroup" is already taken.');
    });
  });
  describe.concurrent('updateGroupDescription', () => {
    it('should update a group description', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      treeState.updateGroupDescription(new TreePath(['aGroup']), 'a description');

      const maybeGroupState = treeState.getGroupState(new TreePath(['aGroup']));
      if (!maybeGroupState) {
        throw new Error('Group is unresolvable');
      }
      expect(maybeGroupState.description).toBe('a description');
    });
    it('should update a group description and update the view', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      treeState.registerView(
        'aDescription only',
        {
          where: { group: { name: '.*', description: 'aDescription' }, select: true },
        },
        true,
      );

      treeState.updateGroupDescription(new TreePath(['aGroup']), 'aDescription');

      const maybeGroupState = treeState.getGroupState(new TreePath(['aGroup']));
      if (!maybeGroupState) {
        throw new Error('Group is unresolvable');
      }
      expect(maybeGroupState.description).toBe('aDescription');

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aDescription only');
    });
    it('should fail when the group does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.updateGroupDescription(new TreePath(['aGroup']), 'a description');
      }).toThrow('Group "aGroup" does not exist.');
    });
  });
  describe.concurrent('updateGroupExtensions', () => {
    it('should update a group extensions', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      treeState.updateGroupExtensions(new TreePath(['aGroup']), { a: 'a' });

      const maybeGroupState = treeState.getGroupState(new TreePath(['aGroup']));
      if (!maybeGroupState) {
        throw new Error('Group is unresolvable');
      }
      expect(maybeGroupState.extensions).toStrictEqual({ a: 'a' });
    });
    it('should fail when the group does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.updateGroupExtensions(new TreePath(['aGroup']), { a: 'a' });
      }).toThrow('Group "aGroup" does not exist.');
    });
  });
  describe.concurrent('deleteGroup', () => {
    it('should delete a group', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aTokenInGroup: { $type: 'string', $value: { default: 'aTokenInGroup' } },
          aNestedGroup: {
            $description: 'a nested group',
          },
          aCollection: { $collection: { $modes: ['aMode'] } },
        },
      });

      treeState.deleteGroup(new TreePath(['aGroup']));

      const result = treeState.getAllNodeStates();
      expect(result).toHaveLength(0);

      expect(
        // @ts-expect-error - private property
        Array.from(treeState.aliasReferences),
      ).toEqual([]);
    });
    it('should delete a group, delete the alias references from it and unlink alias references to it', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup1: {
          aTokenInGroup1: { $type: 'string', $value: { default: 'aTokenInGroup1' } },
          aStringAlias: { $type: 'string', $value: { $alias: 'aGroup1.aTokenInGroup1' } },
        },
        aGroup2: {
          aTokenInGroup2: { $type: 'string', $value: { default: 'aTokenInGroup2' } },
          anotherStringAlias: {
            $type: 'string',
            $value: { $alias: 'aGroup1.aStringAlias' },
          },
        },
      });

      treeState.deleteGroup(new TreePath(['aGroup1']));

      const maybeGroupState = treeState.getGroupState(new TreePath(['aGroup1']));
      expect(maybeGroupState).toBe(undefined);

      const fromAliasReferences = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aGroup1', 'aStringAlias']),
      });
      expect(fromAliasReferences).toEqual([]);

      const toAliasReferences = treeState.getAliasReferencesTo({
        treePath: new TreePath(['aGroup1', 'aStringAlias']),
      });
      expect(toAliasReferences).toHaveLength(1);
      expect(toAliasReferences[0].isResolvable).toBe(false);
    });
    it('should delete a group and its children and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
            aString: { $type: 'string', $value: { default: 'aString' } },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aGroup',
        {
          where: { group: 'aGroup', select: { children: true } },
        },
        true,
      );

      const before = treeState.getAllNodeStates();
      expect(before).toHaveLength(3);

      treeState.deleteGroup(new TreePath(['aGroup']));

      const after = treeState.getAllNodeStates();
      expect(after).toHaveLength(0);

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aGroup');
    });
    it('should fail when the group does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.deleteGroup(new TreePath(['aGroup']));
      }).toThrow('Group "aGroup" does not exist.');
    });
  });
  describe.concurrent('moveGroup', () => {
    it('should move a group', () => {
      const treeState = createTreeStateFromTokenTree({
        bGroup: {
          aGroup: {
            aString: { $type: 'string', $value: { default: 'aString' } },
          },
        },
      });

      const maybeGroupState = treeState.getGroupState(new TreePath(['bGroup', 'aGroup']));

      treeState.moveGroup(new TreePath(['bGroup', 'aGroup']), TreePath.empty());

      if (!maybeGroupState) throw new Error('Group state is unresolvable');
      expect(maybeGroupState.path.toString()).toEqual('aGroup');
    });
    it('should move a group and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aNestedGroup: {
            aStringInGroup: { $type: 'string', $value: { default: 'aStringInGroup' } },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aGroup',
        {
          where: { group: 'aGroup', select: { children: true } },
        },
        true,
      );

      const before = treeState.getAllNodeStates();
      expect(before).toHaveLength(3);

      treeState.moveGroup(new TreePath(['aGroup', 'aNestedGroup']), TreePath.empty());

      const after = treeState.getAllNodeStates();
      expect(after).toHaveLength(1);
      expect(after[0].path).toEqual(new TreePath(['aGroup']));

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aGroup');
    });
    it('should fail when the group does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.moveGroup(new TreePath(['aGroup']), TreePath.empty());
      }).toThrow('Group "aGroup" does not exist.');
    });
  });
  describe.concurrent('truncateGroup', () => {
    it('should truncate a group', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aTokenInGroup: { $type: 'string', $value: { default: 'aTokenInGroup' } },
          aNestedGroup: {
            $description: 'a nested group',
          },
          aCollection: { $collection: { $modes: ['aMode'] } },
        },
      });

      treeState.truncateGroup(new TreePath(['aGroup']));

      const result = treeState.getAllNodeStates();
      expect(result).toHaveLength(1);
      expect(result[0].path).toEqual(new TreePath(['aGroup']));

      expect(treeState.getAllAliasReferences()).toEqual([]);
    });
    it('should truncate a group, delete the alias references from it and unlink alias references to it', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup1: {
          aTokenInGroup1: { $type: 'string', $value: { default: 'aTokenInGroup1' } },
          aStringAlias: { $type: 'string', $value: { $alias: 'aGroup1.aTokenInGroup1' } },
        },
        aGroup2: {
          aTokenInGroup2: { $type: 'string', $value: { default: 'aTokenInGroup2' } },
          anotherStringAlias: {
            $type: 'string',
            $value: { $alias: 'aGroup1.aStringAlias' },
          },
        },
      });

      treeState.truncateGroup(new TreePath(['aGroup1']));

      const maybeGroupState = treeState.getGroupState(new TreePath(['aGroup1']));
      expect(maybeGroupState).toBeInstanceOf(GroupState);

      const remainingAliasReferences = treeState.getAllAliasReferences();
      expect(remainingAliasReferences).toHaveLength(1);
      expect(remainingAliasReferences).toStrictEqual([
        {
          isResolvable: false,
          reason: 'Token at path "aGroup1.aStringAlias" has been unlinked',
          from: {
            treePath: new TreePath(['aGroup2', 'anotherStringAlias']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: { treePath: new TreePath(['aGroup1', 'aStringAlias']), mode: null },
        },
      ]);
    });
    it('should truncate a group and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aCollection: {
            $collection: { $modes: ['default'] },
            aString: { $type: 'string', $value: { default: 'aString' } },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aGroup',
        {
          where: { group: 'aGroup', select: { children: true } },
        },
        true,
      );

      const before = treeState.getAllNodeStates();
      expect(before).toHaveLength(3);

      treeState.truncateGroup(new TreePath(['aGroup']));

      const after = treeState.getAllNodeStates();
      expect(after).toHaveLength(1);
      expect(after[0].path).toEqual(new TreePath(['aGroup']));

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aGroup');
    });
    it('should fail when the group does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.truncateGroup(new TreePath(['aGroup']));
      }).toThrow('Group "aGroup" does not exist.');
    });
  });
  describe.concurrent('addToken', () => {
    it('should add a raw token to the tree root', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      treeState.addToken(new TreePath(['aStringInRoot']), {
        $type: 'string',
        $value: { default: 'aString' },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aStringInRoot']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.path).toEqual(new TreePath(['aStringInRoot']));
    });
    it('should add a raw token to a group in the tree', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      treeState.addToken(new TreePath(['aGroup', 'aStringInGroup']), {
        $type: 'string',
        $value: { default: 'aString' },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aStringInGroup']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.path).toEqual(new TreePath(['aGroup', 'aStringInGroup']));
    });
    it('should add a resolvable top level alias token to a group in the tree', () => {
      const tokenTree: SpecifyDesignTokenFormat = {
        aSourceNumber: { $type: 'number', $value: { custom: 8 } },
        aGroup: {},
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      treeState.addToken(new TreePath(['aGroup', 'aNumber']), {
        $type: 'number',
        $value: { $alias: 'aSourceNumber' },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aNumber']));
      if (!maybeTokenState) throw Error('Expected resolved result');

      expect(maybeTokenState.aliases).toHaveLength(1);
      expect(maybeTokenState.aliases[0]).toStrictEqual({
        status: 'resolved',
        from: {
          treePath: new TreePath(['aGroup', 'aNumber']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: { treePath: new TreePath(['aSourceNumber']), mode: null },
        tokenState: expect.any(Object),
      });
      expect(maybeTokenState.toJSON()).toStrictEqual({
        $type: 'number',
        $value: { $alias: 'aSourceNumber' },
      });
    });
    it('should add an unresolvable top level alias token to a group in the tree', () => {
      const tokenTree: SpecifyDesignTokenFormat = {
        aGroup: {},
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      treeState.addToken(new TreePath(['aGroup', 'aNumber']), {
        $type: 'number',
        $value: { $alias: 'aSourceNumber' },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aNumber']));
      if (!maybeTokenState) throw Error('Expected resolved result');

      expect(maybeTokenState.aliases).toHaveLength(1);
      expect(maybeTokenState.aliases[0]).toStrictEqual({
        status: 'unresolvable',
        from: {
          treePath: new TreePath(['aGroup', 'aNumber']),
          valuePath: new ValuePath([]),
          mode: null,
        },
        to: { treePath: new TreePath(['aSourceNumber']), mode: null },
        unresolvableTokenState: expect.any(Object),
      });

      expect(maybeTokenState.toJSON()).toStrictEqual({
        $type: 'number',
        $value: { $alias: 'aSourceNumber' },
      });
    });
    it('should add a resolvable mode level alias token to a group in the tree', () => {
      const tokenTree: SpecifyDesignTokenFormat = {
        aSourceNumber: { $type: 'number', $value: { custom: 8 } },
        aGroup: {},
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      treeState.addToken(new TreePath(['aGroup', 'aNumber']), {
        $type: 'number',
        $value: { default: { $alias: 'aSourceNumber', $mode: 'custom' } },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aNumber']));
      if (!maybeTokenState) throw Error('Expected resolved result');

      expect(maybeTokenState.aliases).toHaveLength(1);
      expect(maybeTokenState.aliases[0]).toStrictEqual({
        status: 'resolved',
        from: {
          treePath: new TreePath(['aGroup', 'aNumber']),
          valuePath: new ValuePath([]),
          mode: 'default',
        },
        to: { treePath: new TreePath(['aSourceNumber']), mode: 'custom' },
        tokenState: expect.any(Object),
      });

      expect(maybeTokenState.toJSON()).toStrictEqual({
        $type: 'number',
        $value: { default: { $alias: 'aSourceNumber', $mode: 'custom' } },
      });
    });
    it('should add an unresolvable mode level alias token to a group in the tree', () => {
      const tokenTree: SpecifyDesignTokenFormat = {
        aGroup: {},
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      treeState.addToken(new TreePath(['aGroup', 'aNumber']), {
        $type: 'number',
        $value: { default: { $alias: 'aSourceNumber', $mode: 'custom' } },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aNumber']));
      if (!maybeTokenState) throw Error('Expected resolved result');

      expect(maybeTokenState.aliases).toHaveLength(1);
      expect(maybeTokenState.aliases[0]).toStrictEqual({
        status: 'unresolvable',
        from: {
          treePath: new TreePath(['aGroup', 'aNumber']),
          valuePath: new ValuePath([]),
          mode: 'default',
        },
        to: { treePath: new TreePath(['aSourceNumber']), mode: 'custom' },
        unresolvableTokenState: expect.any(Object),
      });

      expect(maybeTokenState.toJSON()).toStrictEqual({
        $type: 'number',
        $value: { default: { $alias: 'aSourceNumber', $mode: 'custom' } },
      });
    });
    it('should add a resolvable value level alias token to a group in the tree', () => {
      const tokenTree: SpecifyDesignTokenFormat = {
        aSourceNumber: { $type: 'number', $value: { custom: 8 } },
        aGroup: {},
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      treeState.addToken(new TreePath(['aGroup', 'aDimension']), {
        $type: 'dimension',
        $value: {
          default: {
            unit: 'px',
            value: { $alias: 'aSourceNumber', $mode: 'custom' },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aDimension']));
      if (!maybeTokenState) throw Error('Expected resolved result');

      expect(maybeTokenState.aliases).toHaveLength(1);
      expect(maybeTokenState.aliases[0]).toStrictEqual({
        status: 'resolved',
        from: {
          treePath: new TreePath(['aGroup', 'aDimension']),
          valuePath: new ValuePath(['value']),
          mode: 'default',
        },
        to: { treePath: new TreePath(['aSourceNumber']), mode: 'custom' },
        tokenState: expect.any(Object),
      });

      expect(maybeTokenState.toJSON()).toStrictEqual({
        $type: 'dimension',
        $value: {
          default: {
            unit: 'px',
            value: { $alias: 'aSourceNumber', $mode: 'custom' },
          },
        },
      });
    });
    it('should add an unresolvable value level alias token to a group in the tree', () => {
      const tokenTree: SpecifyDesignTokenFormat = {
        aGroup: {},
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      treeState.addToken(new TreePath(['aGroup', 'aDimension']), {
        $type: 'dimension',
        $value: {
          default: {
            unit: 'px',
            value: { $alias: 'aSourceNumber', $mode: 'custom' },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aDimension']));
      if (!maybeTokenState) throw Error('Expected resolved result');

      expect(maybeTokenState.aliases).toHaveLength(1);
      expect(maybeTokenState.aliases[0]).toStrictEqual({
        status: 'unresolvable',
        from: {
          treePath: new TreePath(['aGroup', 'aDimension']),
          valuePath: new ValuePath(['value']),
          mode: 'default',
        },
        to: { treePath: new TreePath(['aSourceNumber']), mode: 'custom' },
        unresolvableTokenState: expect.any(Object),
      });

      expect(maybeTokenState.toJSON()).toStrictEqual({
        $type: 'dimension',
        $value: {
          default: {
            unit: 'px',
            value: { $alias: 'aSourceNumber', $mode: 'custom' },
          },
        },
      });
    });
    it('should add a raw token to a collection in the tree', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: { $collection: { $modes: ['aMode'] } },
      });

      treeState.addToken(new TreePath(['aCollection', 'aStringInCollection']), {
        $type: 'string',
        $value: { aMode: 'aString' },
      });

      const maybeTokenState = treeState.getTokenState(
        new TreePath(['aCollection', 'aStringInCollection']),
      );
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.path).toEqual(new TreePath(['aCollection', 'aStringInCollection']));
    });
    it('should add a raw token and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          $description: 'a group',
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aGroup',
        {
          where: { group: 'aGroup', select: { children: true } },
        },
        true,
      );

      treeState.addToken(new TreePath(['aGroup', 'aStringInGroup']), {
        $type: 'string',
        $value: { default: 'aString' },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aStringInGroup']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.path).toEqual(new TreePath(['aGroup', 'aStringInGroup']));

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aGroup');
    });
    it('should fail when the path is already taken by another node', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {},
      });

      treeState.addToken(new TreePath(['aGroup', 'aString']), {
        $type: 'string',
        $value: { default: 'aString' },
      });

      expect(() => {
        treeState.addToken(new TreePath(['aGroup', 'aString']), {
          $type: 'string',
          $value: { default: 'aString' },
        });
      }).toThrow('Path "aGroup.aString" is already used.');
    });
    it('should fail when the parent path does not exist', () => {
      expect(() => {
        const treeState = createTreeStateFromTokenTree({});
        treeState.addToken(new TreePath(['aGroup', 'aString']), {
          $type: 'string',
          $value: { default: 'aString' },
        });
      }).toThrow('Parent path for "aGroup.aString" does not exist.');

      expect(() => {
        const treeState = createTreeStateFromTokenTree({});
        treeState.addToken(new TreePath(['aGroup', 'undefined one', 'aString']), {
          $type: 'string',
          $value: { default: 'aString' },
        });
      }).toThrow('Parent path for "aGroup.undefined one.aString" does not exist.');
    });
    it('should fail when adding an unresolvable top level alias to a collection', () => {
      const tokenTree: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['light', 'dark'] },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokenTree);

      expect(() =>
        treeState.addToken(new TreePath(['aCollection', 'aNumber']), {
          $type: 'number',
          $value: { $alias: 'aSourceNumber' },
        }),
      ).toThrow(
        'Modes of token "aCollection.aNumber" cannot be computed since it points to an unresolvable token but is used in the collection "aCollection" defining modes "light, dark"',
      );
    });
  });
  describe.concurrent('renameToken', () => {
    it('should rename a token', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
      });

      treeState.renameToken(new TreePath(['aString']), 'aRenamedString');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aRenamedString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.path).toEqual(new TreePath(['aRenamedString']));
    });
    it('should rename a token and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aRenamedString only',
        {
          where: { token: 'aRenamedString', select: true },
        },
        true,
      );

      treeState.renameToken(new TreePath(['aGroup', 'aString']), 'aRenamedString');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aRenamedString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.name).toEqual('aRenamedString');

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aRenamedString only');
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.renameToken(new TreePath(['aString']), 'aRenamedString');
      }).toThrow('Token "aString" does not exist.');
    });
    it('should fail when the new name is already taken by another node', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
        aRenamedString: { $type: 'string', $value: { default: 'aRenamedString' } },
      });

      expect(() => {
        treeState.renameToken(new TreePath(['aString']), 'aRenamedString');
      }).toThrow('Path "aRenamedString" is already taken.');
    });
  });
  describe.concurrent('updateTokenDescription', () => {
    it('should update the description of a token', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
      });

      treeState.updateTokenDescription(new TreePath(['aString']), 'aDescription');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.description).toBe('aDescription');
    });
    it('should update the description of a token and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aDescription only',
        {
          where: {
            token: {
              name: '.*',
              description: 'aDescription',
            },
            select: true,
          },
        },
        true,
      );

      treeState.updateTokenDescription(new TreePath(['aGroup', 'aString']), 'aDescription');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.description).toBe('aDescription');

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aDescription only');
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.updateTokenDescription(new TreePath(['aString']), 'aDescription');
      }).toThrow('Token "aString" does not exist.');
    });
  });
  describe.concurrent('updateTokenExtensions', () => {
    it('should update a token extensions', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
      });

      treeState.updateTokenExtensions(new TreePath(['aString']), { a: 'a' });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.extensions).toEqual({ a: 'a' });
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.updateTokenExtensions(new TreePath(['aString']), { a: 'a' });
      }).toThrow('Token "aString" does not exist.');
    });
  });
  describe.concurrent('updateTokenValue', () => {
    it('should update a token value', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
      });

      treeState.updateTokenValue(new TreePath(['aString']), { updated: 'aNewString' });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.value).toEqual({ updated: 'aNewString' });
    });
    it('should update a token value and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'updated mode only',
        {
          where: {
            token: '.*',
            withModes: { include: ['updated'] },
            select: true,
          },
        },
        true,
      );

      treeState.updateTokenValue(new TreePath(['aGroup', 'aString']), { updated: 'aNewString' });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.value).toEqual({ updated: 'aNewString' });

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('updated mode only');
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.updateTokenValue(new TreePath(['aString']), { default: 'aNewString' });
      }).toThrow('Token "aString" does not exist.');
    });
  });
  describe.concurrent('resolveTokenValueAliases', () => {
    it('should resolve a top level alias of a token value', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { $alias: 'aStringAlias' } },
        aStringAlias: { $type: 'string', $value: { default: 'aString' } },
      });

      expect(() => treeState.resolveTokenValueAliases(new TreePath(['aString']))).toThrow(
        "Can't update a value for a top level alias",
      );
    });

    it('should leave unresolvable aliases as is', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { $alias: 'aStringAlias' } },
      });

      treeState.resolveTokenValueAliases(new TreePath(['aString']));

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState.value).toEqual({ $alias: 'aStringAlias' });
    });
  });
  describe.concurrent('updateTokenModeValue', () => {
    it('should update a token mode value', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString', updated: 'aNewString' } },
      });

      treeState.updateTokenModeValue(new TreePath(['aString']), 'updated', 'aNewString');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.value).toEqual({ default: 'aString', updated: 'aNewString' });
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.updateTokenModeValue(new TreePath(['aString']), 'default', 'aNewString');
      }).toThrow('Token "aString" does not exist.');
    });
    it('should fail when the mode does not exist', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString', updated: 'aNewString' } },
      });

      expect(() => {
        treeState.updateTokenModeValue(new TreePath(['aString']), 'undefined', 'aNewString');
      }).toThrow('Mode "undefined" does not exist in token "aString"');
    });
  });
  describe.concurrent('renameTokenMode', () => {
    it('should rename a token mode', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString', initial: 'aNewString' } },
      });

      treeState.renameTokenMode(new TreePath(['aString']), 'initial', 'renamed');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.value).toEqual({ default: 'aString', renamed: 'aNewString' });
    });
    it('should rename a token mode and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: {
            en: 'aString',
            fr: 'anotherString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'a FR mode',
        {
          where: { token: '.*', withModes: { include: ['FR'] }, select: true },
        },
        true,
      );

      treeState.renameTokenMode(new TreePath(['aString']), 'fr', 'FR');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.modes).toEqual(['en', 'FR']);

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('a FR mode');
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.renameTokenMode(new TreePath(['aString']), 'initial', 'renamed');
      }).toThrow('Token "aString" does not exist.');
    });
    it('should fail when the new mode name is not defined in the enclosing collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'large'] },
          aDimension: {
            $type: 'dimension',
            $value: {
              small: { value: 1, unit: 'px' },
              large: { value: 2, unit: 'px' },
            },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenPath = new TreePath(['aCollection', 'aDimension']);

      expect(() => {
        treeState.renameTokenMode(tokenPath, 'small', 'tiny');
      }).toThrow(
        'Mode "tiny" is not allowed in collection "aCollection.aDimension" defining modes: "small", "large".',
      );

      const maybeTokenState = treeState.getTokenState(tokenPath);
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState.value).toEqual((tokens as any).aCollection.aDimension.$value);
    });
  });
  describe.concurrent('createTokenModeValue', () => {
    it('should create a token mode value', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
      });

      treeState.createTokenModeValue(new TreePath(['aString']), 'updated', 'aNewString');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.value).toEqual({ default: 'aString', updated: 'aNewString' });
    });
    it('should create a token mode value and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: {
            en: 'aString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'a fr mode',
        {
          where: { token: '.*', withModes: { include: ['fr'] }, select: true },
        },
        true,
      );

      treeState.createTokenModeValue(new TreePath(['aString']), 'fr', 'anotherString');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.modes).toEqual(['en', 'fr']);

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('a fr mode');
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.createTokenModeValue(new TreePath(['aString']), 'updated', 'aNewString');
      }).toThrow('Token "aString" does not exist.');
    });
    it('should fail when the mode already exists', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString', updated: 'aNewString' } },
      });

      expect(() => {
        treeState.createTokenModeValue(new TreePath(['aString']), 'updated', 'aNewString');
      }).toThrow('Mode "updated" already exists in token "aString"');
    });
  });
  describe.concurrent('deleteTokenModeValue', () => {
    it('should delete a token mode value', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString', toDelete: 'aNewString' } },
      });

      treeState.deleteTokenModeValue(new TreePath(['aString']), 'toDelete');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) {
        throw new Error('Token is unresolvable');
      }
      expect(maybeTokenState).toBeInstanceOf(TokenState);
      expect(maybeTokenState.value).toEqual({ default: 'aString' });
    });
    it('should delete a token mode value and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: {
            en: 'aString',
            fr: 'anotherString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'a fr mode',
        {
          where: { token: '.*', withModes: { include: ['fr'] }, select: true },
        },
        true,
      );

      treeState.deleteTokenModeValue(new TreePath(['aString']), 'fr');

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      expect(maybeTokenState).toBe(undefined);

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('a fr mode');
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.deleteTokenModeValue(new TreePath(['aString']), 'updated');
      }).toThrow('Token "aString" does not exist.');
    });
    it('should fail when the mode does not exist', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString', updated: 'aNewString' } },
      });

      expect(() => {
        treeState.deleteTokenModeValue(new TreePath(['aString']), 'undefined');
      }).toThrow('Mode "undefined" does not exist in token "aString"');
    });
  });
  describe.concurrent('deleteToken', () => {
    it('should delete a token', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
      });

      treeState.deleteToken(new TreePath(['aString']));

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      expect(maybeTokenState).toBe(undefined);
    });
    it('should delete a token, delete the alias references from it and unlink alias references to it', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: { $type: 'string', $value: { $alias: 'aString' } },
        anotherStringAlias: {
          $type: 'string',
          $value: { $alias: 'aStringAlias' },
        },
      });

      treeState.deleteToken(new TreePath(['aStringAlias']));

      const maybeTokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      expect(maybeTokenState).toBe(undefined);

      const fromAliasReferences = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });
      expect(fromAliasReferences).toEqual([]);

      const toAliasReferences = treeState.getAliasReferencesTo({
        treePath: new TreePath(['aStringAlias']),
      });
      expect(toAliasReferences).toHaveLength(1);
      expect(toAliasReferences[0].isResolvable).toBe(false);
      expect(toAliasReferences[0].to.treePath).toEqual(new TreePath(['aStringAlias']));
    });
    it('should delete a token and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aString only',
        {
          where: { token: 'aString', select: true },
        },
        true,
      );

      treeState.deleteToken(new TreePath(['aGroup', 'aString']));

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aString']));
      expect(maybeTokenState).toBe(undefined);

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aString only');
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.deleteToken(new TreePath(['aString']));
      }).toThrow('Token "aString" does not exist.');
    });
  });
  describe.concurrent('moveToken', () => {
    it('should move a token', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aString']));

      treeState.moveToken(new TreePath(['aGroup', 'aString']), TreePath.empty());

      if (!maybeTokenState) throw new Error('Token state is unresolvable');
      expect(maybeTokenState.path.toString()).toEqual('aString');
    });
    it('should move a token and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'aGroup',
        {
          where: { group: 'aGroup', select: { children: true } },
        },
        true,
      );

      const before = treeState.getAllNodeStates();
      expect(before).toHaveLength(2);

      treeState.moveToken(new TreePath(['aGroup', 'aString']), new TreePath([]));

      const after = treeState.getAllNodeStates();
      expect(after).toHaveLength(1);
      expect(after[0].path).toEqual(new TreePath(['aGroup']));

      const view = treeState.getActiveView() as any;
      expect(view.name).toBe('aGroup');
    });
    it('should fail when the token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});

      expect(() => {
        treeState.moveToken(new TreePath(['aString']), new TreePath([]));
      }).toThrow('Token "aString" does not exist.');
    });
  });
  describe.concurrent('renameNode', () => {
    it('should rename a token, collection and a group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aToken: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aGroup: {
          anAlias: {
            $type: 'string',
            $value: {
              $alias: 'aToken',
            },
          },
        },
        aCollection: {
          $collection: {
            $modes: ['default'],
          },
          anAlias: {
            $type: 'string',
            $value: {
              $alias: 'aToken',
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.renameNode(new TreePath(['aToken']), 'notAToken');
      treeState.renameNode(new TreePath(['aGroup']), 'notAGroup');
      treeState.renameNode(new TreePath(['aCollection']), 'notACollection');

      expect(treeState.toJSON()).toEqual({
        notAToken: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        notAGroup: {
          anAlias: {
            $type: 'string',
            $value: {
              $alias: 'notAToken',
            },
          },
        },
        notACollection: {
          $collection: {
            $modes: ['default'],
          },
          anAlias: {
            $type: 'string',
            $value: {
              $alias: 'notAToken',
            },
          },
        },
      });
    });
    it('should rename a token, collection and a group and update the view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
          aGroup: {
            aString: { $type: 'string', $value: { default: 'aString' } },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      // Collection
      treeState.registerView(
        'anUpdatedCollection',
        {
          where: { collection: 'anUpdatedCollection', select: true },
        },
        true,
      );

      treeState.renameNode(new TreePath(['aCollection']), 'anUpdatedCollection');

      const collectionResults = treeState.getAllNodeStates();
      expect(collectionResults).toHaveLength(1);
      expect(collectionResults[0].name).toEqual('anUpdatedCollection');

      expect((treeState.getActiveView() as any).name).toBe('anUpdatedCollection');

      // Group
      treeState.registerView(
        'anUpdatedGroup',
        {
          where: { group: 'anUpdatedGroup', select: true },
        },
        true,
      );

      treeState.renameNode(new TreePath(['anUpdatedCollection', 'aGroup']), 'anUpdatedGroup');

      const groupResults = treeState.getAllNodeStates();
      expect(groupResults).toHaveLength(1);
      expect(groupResults[0].name).toEqual('anUpdatedGroup');

      expect((treeState.getActiveView() as any).name).toBe('anUpdatedGroup');

      // Token
      treeState.registerView(
        'anUpdatedToken',
        {
          where: { token: 'anUpdatedToken', select: true },
        },
        true,
      );

      treeState.renameNode(
        new TreePath(['anUpdatedCollection', 'anUpdatedGroup', 'aString']),
        'anUpdatedToken',
      );

      const tokenResults = treeState.getAllNodeStates();
      expect(tokenResults).toHaveLength(1);
      expect(tokenResults[0].name).toEqual('anUpdatedToken');

      expect((treeState.getActiveView() as any).name).toBe('anUpdatedToken');
    });
    it("should throw an error because node doesn't exists", () => {
      const tokens: SpecifyDesignTokenFormat = {
        aToken: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aGroup: {
          anAlias: {
            $type: 'string',
            $value: {
              $alias: 'aToken',
            },
          },
        },
        aCollection: {
          $collection: {
            $modes: ['default'],
          },
          anAlias: {
            $type: 'string',
            $value: {
              $alias: 'aToken',
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      expect(() => treeState.renameNode(new TreePath(['wrongPath']), 'notAToken')).toThrow();
    });
  });

  describe.concurrent('getTokenState', () => {
    it('should get a token state', () => {
      const treeState = createTreeStateFromTokenTree({
        foo: { $type: 'string', $value: { default: 'aString' } },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['foo']));
      expect(maybeTokenState).toBeInstanceOf(TokenState);
    });
    it('should return an unresolved result with does not exist reason if a token does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});
      const maybeTokenState = treeState.getTokenState(new TreePath(['foo']));
      expect(maybeTokenState).toBe(undefined);
    });
    it('should return an unresolved result when a token does not exist in active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aNumber: { $type: 'number', $value: { default: 1 } },
      });
      const before = treeState.getTokenState(new TreePath(['aNumber']));
      expect(before).toBeInstanceOf(TokenState);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const after = treeState.getTokenState(new TreePath(['aNumber']));
      expect(after).toBe(undefined);
    });
    it('should return an unresolved result when a token does not exist in withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aNumber: { $type: 'number', $value: { default: 1 } },
      });

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });

      const generic = treeState.getTokenState(new TreePath(['aNumber']));
      expect(generic).toBeInstanceOf(TokenState);

      const withView = treeState.getTokenState(new TreePath(['aNumber']), {
        withView: 'strings only',
      });
      expect(withView).toBe(undefined);
    });
  });
  describe.concurrent('getGroupState', () => {
    it('should get a group state', () => {
      const treeState = createTreeStateFromTokenTree({});
      const groupState = new GroupState(treeState, createGroupStateParams(new TreePath(['foo'])));

      // @ts-expect-error - private property
      treeState.current.groups.add(groupState);

      const maybeGroupState = treeState.getGroupState(new TreePath(['foo']));
      expect(maybeGroupState).toBeInstanceOf(GroupState);
    });
    it('should return an unresolved result with does not exist reason if a node does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});
      const result = treeState.getGroupState(new TreePath(['foo']));
      expect(result).toBe(undefined);
    });
    it('should return an unresolved result when a group does not exist in active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      });
      const before = treeState.getGroupState(new TreePath(['aGroup']));
      expect(before).toBeInstanceOf(GroupState);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const after = treeState.getGroupState(new TreePath(['aGroup']));
      expect(after).toBe(undefined);
    });
    it('should return an unresolved result when a group does not exist in withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      });

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });

      const generic = treeState.getGroupState(new TreePath(['aGroup']));
      expect(generic).toBeInstanceOf(GroupState);

      const withView = treeState.getGroupState(new TreePath(['aGroup']), {
        withView: 'strings only',
      });
      expect(withView).toBe(undefined);
    });
  });
  describe.concurrent('getCollectionState', () => {
    it('should get a collection state', () => {
      const treeState = createTreeStateFromTokenTree({});
      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['foo']), ['light', 'dark']),
      );

      // @ts-expect-error - private property
      treeState.current.collections.add(collectionState);

      const maybeCollectionState = treeState.getCollectionState(new TreePath(['foo']));

      expect(maybeCollectionState).toBeInstanceOf(CollectionState);
    });
    it('should return an unresolved result with does not exist reason if a node does not exist', () => {
      const treeState = createTreeStateFromTokenTree({});
      const maybeCollectionState = treeState.getCollectionState(new TreePath(['foo']));
      expect(maybeCollectionState).toBe(undefined);
    });
    it('should return an unresolved result when a collection does not exist in active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['fr', 'en'] },
          aStringInCollection: { $type: 'string', $value: { fr: 'une chaine', en: 'a string' } },
        },
      });
      const before = treeState.getCollectionState(new TreePath(['aCollection']));
      expect(before).toBeInstanceOf(CollectionState);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const after = treeState.getCollectionState(new TreePath(['aCollection']));
      expect(after).toBe(undefined);
    });
    it('should return an unresolved result when a collection does not exist in withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['fr', 'en'] },
          aStringInCollection: { $type: 'string', $value: { fr: 'une chaine', en: 'a string' } },
        },
      });

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });

      const generic = treeState.getCollectionState(new TreePath(['aCollection']));
      expect(generic).toBeInstanceOf(CollectionState);

      const withView = treeState.getCollectionState(new TreePath(['aCollection']), {
        withView: 'strings only',
      });
      expect(withView).toBe(undefined);
    });
  });
  describe.concurrent('getNearestCollectionState', () => {
    it('should get the nearest collection state of a token', () => {
      const treeState = createTreeStateFromTokenTree({});
      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['foo']), ['light', 'dark']),
      );

      // @ts-expect-error - private property
      treeState.current.collections.add(collectionState);

      const maybeCollectionState = treeState.getNearestCollectionState(
        new TreePath(['foo', 'bar']),
      );

      expect(maybeCollectionState).toBeInstanceOf(CollectionState);
    });
    it('should get an unresolvable result when no collection is available', () => {
      const treeState = createTreeStateFromTokenTree({});
      expect(treeState.getNearestCollectionState(new TreePath(['foo', 'bar']))).toBe(undefined);
    });
    it('should return an unresolved result when a collection does not exist in active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['fr', 'en'] },
          aStringInCollection: { $type: 'string', $value: { fr: 'une chaine', en: 'a string' } },
        },
      });
      const before = treeState.getNearestCollectionState(
        new TreePath(['aCollection', 'aStringInCollection']),
      );
      expect(before).toBeInstanceOf(CollectionState);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const after = treeState.getNearestCollectionState(
        new TreePath(['aCollection', 'aStringInCollection']),
      );
      expect(after).toBe(undefined);
    });
    it('should return an unresolved result when a collection does not exist in withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['fr', 'en'] },
          aStringInCollection: { $type: 'string', $value: { fr: 'une chaine', en: 'a string' } },
        },
      });

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });

      const generic = treeState.getNearestCollectionState(
        new TreePath(['aCollection', 'aStringInCollection']),
      );
      expect(generic).toBeInstanceOf(CollectionState);

      const withView = treeState.getNearestCollectionState(
        new TreePath(['aCollection', 'aStringInCollection']),
        {
          withView: 'strings only',
        },
      );
      expect(withView).toBe(undefined);
    });
  });
  describe.concurrent('getAllTokenStates', () => {
    it('should get all token states', () => {
      const treeState = createTreeStateFromTokenTree({});
      const tokenState = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['foo']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );

      // @ts-expect-error - private property
      treeState.current.tokens.add(tokenState);

      const result = treeState.getAllTokenStates();
      expect(result).toEqual([tokenState]);
    });
    it('should return an empty array if no token states exist', () => {
      const treeState = createTreeStateFromTokenTree({});
      const result = treeState.getAllTokenStates();
      expect(result).toEqual([]);
    });
    it('should return an empty array if no token states exist in active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
      });

      treeState.registerView(
        'numbers only',
        {
          where: { token: '.*', withTypes: { include: ['number'] }, select: true },
        },
        true,
      );

      const result = treeState.getAllTokenStates();
      expect(result).toEqual([]);
    });
    it('should return an empty array if no token states exist in withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
      });

      treeState.registerView('numbers only', {
        where: { token: '.*', withTypes: { include: ['number'] }, select: true },
      });

      expect(treeState.getAllTokenStates()).toHaveLength(1);

      expect(treeState.getAllTokenStates({ withView: 'numbers only' })).toEqual([]);
    });
  });
  describe.concurrent('getAllGroupStates', () => {
    it('should get all group states', () => {
      const treeState = createTreeStateFromTokenTree({});
      const groupState = new GroupState(treeState, createGroupStateParams(new TreePath(['foo'])));

      // @ts-expect-error - private property
      treeState.current.groups.add(groupState);

      const result = treeState.getAllGroupStates();
      expect(result).toEqual([groupState]);
    });
    it('should return an empty array if no group states exist', () => {
      const treeState = createTreeStateFromTokenTree({});
      const result = treeState.getAllGroupStates();
      expect(result).toEqual([]);
    });
    it('should return an empty array if no group states exist in active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      });

      treeState.registerView(
        'numbers only',
        {
          where: { token: '.*', withTypes: { include: ['number'] }, select: true },
        },
        true,
      );

      const result = treeState.getAllGroupStates();
      expect(result).toEqual([]);
    });
    it('should return an empty array if no group states exist in withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      });

      treeState.registerView('numbers only', {
        where: { token: '.*', withTypes: { include: ['number'] }, select: true },
      });

      expect(treeState.getAllGroupStates()).toHaveLength(1);

      expect(treeState.getAllGroupStates({ withView: 'numbers only' })).toEqual([]);
    });
  });
  describe.concurrent('getAllCollectionStates', () => {
    it('should get all collection states', () => {
      const treeState = createTreeStateFromTokenTree({});
      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['foo']), ['light', 'dark']),
      );

      // @ts-expect-error - private property
      treeState.current.collections.add(collectionState);

      const result = treeState.getAllCollectionStates();
      expect(result).toEqual([collectionState]);
    });
    it('should return an empty array if no collection states exist', () => {
      const treeState = createTreeStateFromTokenTree({});
      const result = treeState.getAllCollectionStates();
      expect(result).toEqual([]);
    });
    it('should return an empty array if no collection states exist in active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['fr', 'en'] },
          aStringInCollection: { $type: 'string', $value: { fr: 'une chaine', en: 'a string' } },
        },
      });

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const result = treeState.getAllCollectionStates();
      expect(result).toEqual([]);
    });
    it('should return an empty array if no collection states exist in withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aCollection: {
          $collection: { $modes: ['fr', 'en'] },
          aStringInCollection: { $type: 'string', $value: { fr: 'une chaine', en: 'a string' } },
        },
      });

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });

      expect(treeState.getAllCollectionStates()).toHaveLength(1);

      expect(treeState.getAllCollectionStates({ withView: 'strings only' })).toEqual([]);
    });
  });
  describe.concurrent('getAllNodeStates', () => {
    it('should get all node states', () => {
      const treeState = createTreeStateFromTokenTree({});
      const tokenState = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['foo']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );

      const groupState = new GroupState(treeState, createGroupStateParams(new TreePath(['bar'])));

      // @ts-expect-error - private property
      treeState.current.tokens.add(tokenState);
      // @ts-expect-error - private property
      treeState.current.groups.add(groupState);

      const result = treeState.getAllNodeStates();
      expect(result).toEqual([groupState, tokenState]);
    });
    it('should return an empty array if no node states exist', () => {
      const treeState = createTreeStateFromTokenTree({});
      const result = treeState.getAllNodeStates();
      expect(result).toEqual([]);
    });
    it('should return an empty array if no node states exist in active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'aString' } },
      });

      treeState.registerView(
        'numbers only',
        {
          where: { token: '.*', withTypes: { include: ['number'] }, select: true },
        },
        true,
      );

      const result = treeState.getAllNodeStates();
      expect(result).toEqual([]);
    });
    it('should return an empty array if no node states exist in withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
      });

      treeState.registerView('numbers only', {
        where: { token: '.*', withTypes: { include: ['number'] }, select: true },
      });

      expect(treeState.getAllNodeStates()).toHaveLength(2);

      expect(treeState.getAllNodeStates({ withView: 'numbers only' })).toEqual([]);
    });
  });
  describe.concurrent('getTokenChildrenOf', () => {
    it('should get the child tokens of a path', () => {
      const treeState = createTreeStateFromTokenTree({});

      const rootGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootGroupState);

      const rootSiblingGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['sibling'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootSiblingGroupState);

      const aString = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'aString']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(aString);

      const nestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(nestedGroupState);

      const superNestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested', 'deeper'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(superNestedGroupState);

      const aNestedString = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'nested', 'deeper', 'aString']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(aNestedString);

      const results = treeState.getTokenChildrenOf(new TreePath(['root']));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(aString);
      expect(results[1]).toEqual(aNestedString);
    });
    it('should get partial child tokens of a path with an active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
          aNumber: { $type: 'number', $value: { default: 1 } },
        },
      });

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const results = treeState.getTokenChildrenOf(new TreePath(['aGroup']));
      expect(results).toHaveLength(1);
      expect(results[0].name).toEqual('aString');
    });
    it('should get partial child tokens of a path with withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
          aNumber: { $type: 'number', $value: { default: 1 } },
          aGroup: {
            aStringInGroup: { $type: 'string', $value: { default: 'aString' } },
          },
        },
      });

      treeState.registerView('strings only', {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      });

      const results = treeState.getTokenChildrenOf(new TreePath(['aGroup']), undefined, {
        withView: 'strings only',
      });
      expect(results).toHaveLength(2);
      expect(results[0].name).toEqual('aString');
      expect(results[1].name).toEqual('aStringInGroup');
    });
  });
  describe.concurrent('getGroupChildrenOf', () => {
    it('should get the child groups of a path', () => {
      const treeState = createTreeStateFromTokenTree({});

      const rootGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootGroupState);

      const rootSiblingGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['sibling'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootSiblingGroupState);

      const aString = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'aString']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(aString);

      const nestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(nestedGroupState);

      const superNestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested', 'deeper'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(superNestedGroupState);

      const aNestedString = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'nested', 'deeper', 'aString']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(aNestedString);

      const results = treeState.getGroupChildrenOf(new TreePath(['root']));

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(nestedGroupState);
      expect(results[1]).toEqual(superNestedGroupState);
    });
    it('should get the child groups of a path with depth 1', () => {
      const treeState = createTreeStateFromTokenTree({});

      const rootGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootGroupState);

      const rootSiblingGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['sibling'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootSiblingGroupState);

      const aString = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'aString']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(aString);

      const nestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(nestedGroupState);

      const superNestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested', 'deeper'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(superNestedGroupState);

      const aNestedString = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'nested', 'deeper', 'aString']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(aNestedString);

      const results = treeState.getGroupChildrenOf(new TreePath(['root']), 1);

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(nestedGroupState);
    });
    it('should get partial child groups of a path with an active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aSubGroup: {},
          aNonMatchingSubGroup: {},
        },
      });

      treeState.registerView(
        'filtered group',
        {
          where: { group: 'aSubGroup', select: { parents: true } },
        },
        true,
      );

      const results = treeState.getGroupChildrenOf(new TreePath(['aGroup']));
      expect(results).toHaveLength(1);
      expect(results[0].name).toEqual('aSubGroup');
    });
    it('should get partial child groups of a path with withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aSubGroup: {},
          aNonMatchingSubGroup: {},
        },
      });

      treeState.registerView('filtered group', {
        where: { group: 'aSubGroup', select: { parents: true } },
      });

      const results = treeState.getGroupChildrenOf(new TreePath(['aGroup']), undefined, {
        withView: 'filtered group',
      });
      expect(results).toHaveLength(1);
      expect(results[0].name).toEqual('aSubGroup');
    });
  });
  describe.concurrent('getCollectionChildrenOf', () => {
    it('should get the child collections of a path', () => {
      const treeState = createTreeStateFromTokenTree({});

      const rootGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootGroupState);

      const rootSiblingGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['sibling'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootSiblingGroupState);

      const collectionState = new CollectionState(
        treeState,
        createCollectionStateParams(new TreePath(['root', 'nested']), ['a', 'b']),
      );
      // @ts-expect-error - private property
      treeState.current.collections.add(collectionState);

      const aString = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'nested', 'aString']), {
          type: 'string',
          primitiveParts: [
            { localMode: 'a', value: 'aString' },
            { localMode: 'b', value: 'bString' },
          ],
          isTopLevelAlias: false,
          isFullyResolvable: true,
          modesResolvability: [
            ['a', true],
            ['b', true],
          ],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(aString);

      const superNestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested', 'deeper'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(superNestedGroupState);

      const aNestedString = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'nested', 'deeper', 'aString']), {
          type: 'string',
          primitiveParts: [
            { localMode: 'a', value: 'aString' },
            { localMode: 'b', value: 'bString' },
          ],
          isTopLevelAlias: false,
          isFullyResolvable: true,
          modesResolvability: [
            ['a', true],
            ['b', true],
          ],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(aNestedString);

      const results = treeState.getCollectionChildrenOf(new TreePath(['root']));

      expect(results).toHaveLength(1);
      expect(results[0]).toEqual(collectionState);
    });
    it('should get partial child collections of a path with an active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aFirstCollection: {
            $collection: { $modes: ['small', 'large'] },
          },
          aSecondCollection: {
            $collection: { $modes: ['light', 'dark'] },
          },
        },
      });

      treeState.registerView(
        'first only',
        {
          where: { collection: 'aFirstCollection', select: { parents: true } },
        },
        true,
      );

      const results = treeState.getCollectionChildrenOf(new TreePath(['aGroup']));
      expect(results).toHaveLength(1);
      expect(results[0].name).toEqual('aFirstCollection');
    });
    it('should get partial child collections of a path with withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aFirstCollection: {
            $collection: { $modes: ['small', 'large'] },
          },
          aSecondCollection: {
            $collection: { $modes: ['light', 'dark'] },
          },
        },
      });

      treeState.registerView('first only', {
        where: { collection: 'aFirstCollection', select: { parents: true } },
      });

      const results = treeState.getCollectionChildrenOf(new TreePath(['aGroup']), undefined, {
        withView: 'first only',
      });
      expect(results).toHaveLength(1);
      expect(results[0].name).toEqual('aFirstCollection');
    });
  });
  describe.concurrent('getChildrenOf', () => {
    it('should get the children of a node', () => {
      const treeState = createTreeStateFromTokenTree({});

      const rootGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootGroupState);

      const rootSiblingGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['sibling'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootSiblingGroupState);

      const tokenState = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'aString']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(tokenState);

      const nestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(nestedGroupState);

      const superNestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested', 'deeper'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(superNestedGroupState);

      const results = treeState.getChildrenOf(new TreePath(['root']));

      expect(results).toHaveLength(3);
      expect(results[0]).toEqual(tokenState);
      expect(results[1]).toEqual(nestedGroupState);
      expect(results[2]).toEqual(superNestedGroupState);
    });
    it('should get the children with a depth of 1', () => {
      const treeState = createTreeStateFromTokenTree({});

      const rootGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(rootGroupState);

      const tokenState = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['root', 'aString']), {
          type: 'string',
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );
      // @ts-expect-error - private property
      treeState.current.tokens.add(tokenState);

      const nestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(nestedGroupState);

      const superNestedGroupState = new GroupState(
        treeState,
        createGroupStateParams(new TreePath(['root', 'nested', 'deeper'])),
      );
      // @ts-expect-error - private property
      treeState.current.groups.add(superNestedGroupState);

      const results = treeState.getChildrenOf(new TreePath(['root']), 1);

      expect(results).toHaveLength(2);
      expect(results[0]).toEqual(tokenState);
      expect(results[1]).toEqual(nestedGroupState);
    });
    it('should return an empty array if the node has no children', () => {
      const treeState = createTreeStateFromTokenTree({});
      const result = treeState.getChildrenOf(new TreePath(['foo']));
      expect(result).toEqual([]);
    });
    it('should return a partial array of children with an active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aFirstCollection: {
            $collection: { $modes: ['small', 'large'] },
            aStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
            anotherStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
          },
          aSecondCollection: {
            $collection: { $modes: ['light', 'dark'] },
            aStringInCollection: {
              $type: 'string',
              $value: { light: 'a light value', dark: 'a dark value' },
            },
          },
        },
      });

      treeState.registerView(
        'first only',
        {
          where: [
            { collection: 'aFirstCollection', select: { parents: true } },
            { token: 'aStringInCollection', select: { parents: true } },
          ],
        },
        true,
      );

      const results = treeState.getChildrenOf(new TreePath(['aGroup']));
      expect(results).toHaveLength(4);
      expect(results[0].name).toEqual('aFirstCollection');
      expect(results[1].name).toEqual('aStringInCollection');
      expect(results[2].name).toEqual('aSecondCollection');
      expect(results[3].name).toEqual('aStringInCollection');
    });
    it('should return a partial array of children with withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aFirstCollection: {
            $collection: { $modes: ['small', 'large'] },
            aStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
            anotherStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
          },
          aSecondCollection: {
            $collection: { $modes: ['light', 'dark'] },
            aStringInCollection: {
              $type: 'string',
              $value: { light: 'a light value', dark: 'a dark value' },
            },
          },
        },
      });

      treeState.registerView('first only', {
        where: [
          { collection: 'aFirstCollection', select: { parents: true } },
          { token: 'aStringInCollection', select: { parents: true } },
        ],
      });

      const results = treeState.getChildrenOf(new TreePath(['aGroup']), undefined, {
        withView: 'first only',
      });

      expect(results).toHaveLength(4);
      expect(results[0].name).toBe('aFirstCollection');
      expect(results[1].name).toBe('aStringInCollection');
      expect(results[2].name).toBe('aSecondCollection');
      expect(results[3].name).toBe('aStringInCollection');
    });
  });
  describe.concurrent('getParentsOf', () => {
    it('should get the parents of a node', () => {
      const treeState = createTreeStateFromTokenTree({
        root: {
          nested: {
            deeper: {
              aString: {
                $type: 'string',
                $value: { default: 'aString' },
              },
            },
          },
        },
      });

      const parentOfAString = treeState.getParentsOf(
        new TreePath(['root', 'nested', 'deeper', 'aString']),
      );
      expect(parentOfAString).toHaveLength(3);

      const parentOfAStringAtDepth1 = treeState.getParentsOf(
        new TreePath(['root', 'nested', 'deeper', 'aString']),
        1,
      );
      expect(parentOfAStringAtDepth1).toHaveLength(1);

      const parentOfDeeper = treeState.getParentsOf(new TreePath(['root', 'nested', 'deeper']));
      expect(parentOfDeeper).toHaveLength(2);
    });
    it('should return an empty array if the node has no parents', () => {
      const treeState = createTreeStateFromTokenTree({});
      const result = treeState.getParentsOf(new TreePath(['foo']));
      expect(result).toStrictEqual([]);
    });
    it('should return an empty array with an active view', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aFirstCollection: {
            $collection: { $modes: ['small', 'large'] },
            aStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
            anotherStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
          },
        },
      });

      treeState.registerView(
        'first only',
        {
          where: [{ token: 'aStringInCollection', select: true }],
        },
        true,
      );

      const results = treeState.getParentsOf(
        new TreePath(['aGroup', 'aFirstCollection', 'aStringInCollection']),
      );

      expect(results).toStrictEqual([]);
    });
    it('should return an empty array with withView param', () => {
      const treeState = createTreeStateFromTokenTree({
        aGroup: {
          aFirstCollection: {
            $collection: { $modes: ['small', 'large'] },
            aStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
            anotherStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
          },
        },
      });

      treeState.registerView('first only', {
        where: [{ token: 'aStringInCollection', select: true }],
      });

      const results = treeState.getParentsOf(
        new TreePath(['aGroup', 'aFirstCollection', 'aStringInCollection']),
        undefined,
        { withView: 'first only' },
      );

      expect(results).toStrictEqual([]);
    });
  });

  describe.concurrent('getGroupChildren', () => {
    it('should return the children of a group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: { aNestedGroup: {} },
        anotherGroup: {},
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const result = treeState.getGroupChildren();

      expect(result).toHaveLength(2);
      expect(result[0].path).toEqual(new TreePath(['aGroup']));
      expect(result[1].path).toEqual(new TreePath(['anotherGroup']));
    });
  });
  describe.concurrent('getTokenChildren', () => {
    it('should return the children of a token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aNumber: { $type: 'number', $value: { default: 1 } },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const result = treeState.getTokenChildren();

      expect(result).toHaveLength(2);
      expect(result[0].path).toEqual(new TreePath(['aString']));
      expect(result[1].path).toEqual(new TreePath(['aNumber']));
    });
  });
  describe.concurrent('getCollectionChildren', () => {
    it('should return the children of a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
        },
        anotherCollection: {
          $collection: { $modes: ['default'] },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const result = treeState.getCollectionChildren();

      expect(result).toHaveLength(2);
      expect(result[0].path).toEqual(new TreePath(['aCollection']));
      expect(result[1].path).toEqual(new TreePath(['anotherCollection']));
    });
  });

  describe.concurrent('clone', () => {
    it('should clone the tree state', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aNumber: { $type: 'number', $value: { default: 1 } },
        aNumberTopLevelAlias: { $type: 'number', $value: { $alias: 'aNumber' } },
        aNumberModeLevelAlias: {
          $type: 'number',
          $value: {
            custom: { $alias: 'aNumber', $mode: 'default' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const cloned = treeState.clone();

      treeState.deleteToken(new TreePath(['aString']));
      const { aString, ...rest } = tokens;
      expect(treeState.toJSON()).toStrictEqual(rest);

      expect(cloned).toBeInstanceOf(TreeState);
      expect(cloned.toJSON()).toStrictEqual(tokens);
    });
    it('should clone the tree state with views', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aNumber: { $type: 'number', $value: { default: 1 } },
      };
      const metadata: SDTFEngineSerializedMetadata = {
        views: [
          {
            name: 'strings only',
            query: { where: { token: '.*', withTypes: { include: ['string'] }, select: true } },
          },
        ],
        activeViewName: null,
      };

      const treeState = createTreeStateFromTokenTree(tokens, metadata);

      const cloned = treeState.clone();

      expect(cloned.listViews()).toStrictEqual(
        metadata.views.map(v => ({
          ...v,
          isActive: false,
        })),
      );

      cloned.setActiveView('strings only');

      expect(cloned.getAllTokenStates()).toHaveLength(1);
    });
  });

  describe.concurrent('populateJSONChildrenOf', () => {
    it('should populate the JSON children of a node with no options', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: {
            $type: 'string',
            $value: { default: 'aString' },
          },
          aStringAlias: {
            $type: 'string',
            $value: { $alias: 'aGroup.aString' },
          },
          aCollection: {
            $collection: { $modes: ['small', 'large'] },
            aGroupInCollection: {
              aStringInCollection: {
                $type: 'string',
                $value: { small: 'a small value', large: 'a large value' },
              },
            },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const acc: any = {};
      treeState.populateJSONChildrenOf(new TreePath(['aGroup']), acc);
      expect(acc).toStrictEqual(tokens.aGroup);

      expect(acc.aCollection).toStrictEqual((tokens.aGroup as any).aCollection);
    });

    it('should populate the JSON children of a node with resolveAliases:true', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: {
            $type: 'string',
            $value: { default: 'aString' },
            $description: 'A string',
          },
          aStringAlias: {
            $type: 'string',
            $value: { $alias: 'aGroup.aString' },
          },
          aStringAlias2: {
            $type: 'string',
            $value: {
              myMode: { $alias: 'aGroup.aStringAlias', $mode: 'default' },
            },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const acc = {};
      treeState.populateJSONChildrenOf(new TreePath(['aGroup']), acc, { resolveAliases: true });

      expect(acc).toEqual({
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aStringAlias: {
          $type: 'string',
          $value: { default: 'aString' },
        },
        aStringAlias2: {
          $type: 'string',
          $value: { myMode: 'aString' },
        },
      });
    });
    it('should populate the JSON children of a node with resolveAliases:true and targetMode', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: {
            $type: 'string',
            $value: { small: 'a small string', large: 'a large string' },
            $description: 'A string',
          },
          aStringAlias: {
            $type: 'string',
            $value: { $alias: 'aGroup.aString' },
          },
          aStringAlias2: {
            $type: 'string',
            $value: {
              small: 'small',
              large: 'large',
            },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const acc = {};
      treeState.populateJSONChildrenOf(new TreePath(['aGroup']), acc, {
        resolveAliases: true,
        targetMode: 'small',
      });

      expect(acc).toEqual({
        aString: {
          $type: 'string',
          $value: 'a small string',
          $description: 'A string',
        },
        aStringAlias: {
          $type: 'string',
          $value: 'a small string',
        },
        aStringAlias2: {
          $type: 'string',
          $value: 'small',
        },
      });
    });
    it('should not get affected by an active view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aString: { $type: 'string', $value: { default: 'aString' } },
          aNumber: { $type: 'number', $value: { default: 1 } },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      const acc = {};
      treeState.populateJSONChildrenOf(new TreePath(['aGroup']), acc);

      expect(acc).toEqual(tokens.aGroup);
    });
  });
  describe.concurrent('renderJSONTree', () => {
    it('should render the initial JSON tree by default', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aStringAlias: {
          $type: 'string',
          $value: {
            $alias: 'aString',
          },
        },
        aStringAlias2: {
          $type: 'string',
          $value: {
            myMode: {
              $alias: 'aString',
              $mode: 'default',
            },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const result = treeState.renderJSONTree();

      expect(result).toEqual(tokens);
    });
    it('should render the JSON tree with resolved aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aStringAlias: {
          $type: 'string',
          $value: {
            $alias: 'aString',
          },
        },
        aStringAlias2: {
          $type: 'string',
          $value: {
            myMode: { $alias: 'aString', $mode: 'default' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const result = treeState.renderJSONTree({ resolveAliases: true });

      expect(result).toEqual({
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aStringAlias: {
          $type: 'string',
          $value: { default: 'aString' },
        },
        aStringAlias2: {
          $type: 'string',
          $value: { myMode: 'aString' },
        },
      });
    });
    it('should render the complete JSON tree despite an active view', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
        aCollection: {
          $collection: { $modes: ['small', 'large'] },
          aGroupInCollection: {
            $description: 'A group in a collection',
            aStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
          },
        },
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      expect((treeState.getActiveView() as any).name).toBe('strings only');

      expect(treeState.renderJSONTree()).toStrictEqual(tokens);
    });
    it('should fail rendering the tree if targetMode options is set', () => {
      const tokens: SpecifyDesignTokenFormat = {};

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(() => {
        treeState.renderJSONTree({
          resolveAliases: true,
          // @ts-expect-error - testing invalid option
          targetMode: 'myMode',
        });
      }).toThrow('The "targetMode" option is not supported when using renderJSONTree.');
    });
  });
  describe.concurrent('exportMetadata', () => {
    it('should export registered views', () => {
      const treeState = createTreeStateFromTokenTree({});

      const query: SDTFQuery = {
        where: { token: '.*', withTypes: { include: ['string'] }, select: true },
      };
      treeState.registerView('strings only', query, true);

      const result = treeState.exportMetadata();
      expect(result.views).toStrictEqual([{ name: 'strings only', query }]);
    });
  });
  describe.concurrent('exportAll', () => {
    it('should export the token tree and metadata', () => {
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
      };
      const metadata: SDTFEngineSerializedMetadata = {
        activeViewName: 'strings only',
        views: [
          {
            name: 'strings only',
            query: {
              where: { token: '.*', withTypes: { include: ['string'] }, select: true },
            },
          },
        ],
      };

      const treeState = createTreeStateFromTokenTree(tokenTree, metadata);

      const result = treeState.exportAll();

      expect(result).toStrictEqual({
        tokenTree,
        metadata,
      });
    });
  });
  describe.concurrent('toJSON', () => {
    it('should render the initial JSON tree by default', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
        aStringAlias: {
          $type: 'string',
          $value: {
            $alias: 'aString',
          },
        },
        aStringAlias2: {
          $type: 'string',
          $value: {
            myMode: {
              $alias: 'aString',
              $mode: 'default',
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const result = treeState.toJSON();

      expect(result).toEqual(tokens);
    });
    it('should render the complete JSON tree despite a view being applied', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aBoolean: {
          $type: 'boolean',
          $value: { default: true },
          $description: 'A boolean',
        },
        aCollection: {
          $collection: { $modes: ['small', 'large'] },
          aGroupInCollection: {
            $description: 'A group in a collection',
            aStringInCollection: {
              $type: 'string',
              $value: { small: 'a small value', large: 'a large value' },
            },
          },
        },
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
          $description: 'A string',
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      treeState.registerView(
        'strings only',
        {
          where: { token: '.*', withTypes: { include: ['string'] }, select: true },
        },
        true,
      );

      expect((treeState.getActiveView() as any).name).toBe('strings only');

      expect(JSON.stringify(treeState)).toStrictEqual(JSON.stringify(tokens));
    });
  });

  describe.concurrent('getDeepAliasReferenceAndPathInfoFrom', () => {
    it('should get the dimension token with a path leading to the value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: { default: { value: 12, unit: 'px' } },
          $description: 'A boolean',
        },
        aliasDimension: {
          $type: 'dimension',
          $value: { notDefault: { $alias: 'aDimension', $mode: 'default' } },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getDeepAliasReferenceAndPathInfoFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
        }),
      ).toEqual({
        traversedPath: ValuePath.empty(),
        toValuePath: new ValuePath(['value']),
        aliasRef: {
          from: {
            mode: 'notDefault',
            treePath: new TreePath(['aliasDimension']),
            valuePath: new ValuePath(['value']),
          },
          isResolvable: true,
          to: {
            mode: 'default',
            treePath: new TreePath(['aDimension']),
          },
        },
      });
    });

    it('should get the dimension token with a path leading to the value into nested tokens', () => {
      const tokens: SpecifyDesignTokenFormat = {
        valueGroup: {
          otherLevel: {
            aDimension: {
              $type: 'dimension',
              $value: { default: { value: 12, unit: 'px' } },
              $description: 'A boolean',
            },
          },
        },
        aliasGroup: {
          otherLevel: {
            aliasDimension: {
              $type: 'dimension',
              $value: {
                notDefault: { $alias: 'valueGroup.otherLevel.aDimension', $mode: 'default' },
              },
            },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getDeepAliasReferenceAndPathInfoFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasGroup', 'otherLevel', 'aliasDimension']),
        }),
      ).toEqual({
        traversedPath: ValuePath.empty(),
        toValuePath: new ValuePath(['value']),
        aliasRef: {
          from: {
            mode: 'notDefault',
            treePath: new TreePath(['aliasGroup', 'otherLevel', 'aliasDimension']),
            valuePath: new ValuePath(['value']),
          },
          isResolvable: true,
          to: {
            mode: 'default',
            treePath: new TreePath(['valueGroup', 'otherLevel', 'aDimension']),
          },
        },
      });
    });

    it('should get the number token with an empty path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        number: {
          $type: 'number',
          $value: { small: 1 },
        },
        aDimension: {
          $type: 'dimension',
          $value: { default: { value: { $alias: 'number', $mode: 'small' }, unit: 'px' } },
          $description: 'A boolean',
        },
        aliasDimension: {
          $type: 'dimension',
          $value: { notDefault: { $alias: 'aDimension', $mode: 'default' } },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getDeepAliasReferenceAndPathInfoFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
        }),
      ).toEqual({
        toValuePath: new ValuePath([]),
        traversedPath: new ValuePath(['value']),
        aliasRef: {
          from: {
            mode: 'notDefault',
            treePath: new TreePath(['aliasDimension']),
            valuePath: new ValuePath(['value']),
          },
          isResolvable: true,
          to: {
            mode: 'small',
            treePath: new TreePath(['number']),
          },
        },
      });
    });

    it('should get an unresolvable reference', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aliasDimension: {
          $type: 'dimension',
          $value: { notDefault: { $alias: 'aDimension', $mode: 'default' } },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getDeepAliasReferenceAndPathInfoFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
        }),
      ).toEqual({
        aliasRef: {
          from: {
            mode: 'notDefault',
            treePath: new TreePath(['aliasDimension']),
            valuePath: new ValuePath(['value']),
          },
          isResolvable: false,
          reason: 'Token "aDimension" does not exist',
          to: {
            mode: 'default',
            treePath: new TreePath(['aDimension']),
          },
        },
        toValuePath: new ValuePath(['value']),
        traversedPath: ValuePath.empty(),
      });
    });

    it('should return an undefined as the path does not exists', () => {
      const tokens: SpecifyDesignTokenFormat = {};

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getDeepAliasReferenceAndPathInfoFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
        }),
      ).toEqual(undefined);
    });
  });

  describe.concurrent('getAliasReferenceOrParent', () => {
    it('should get the dimension token with a path leading to the value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: { default: { value: 12, unit: 'px' } },
          $description: 'A boolean',
        },
        aliasDimension: {
          $type: 'dimension',
          $value: { notDefault: { $alias: 'aDimension', $mode: 'default' } },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getAliasReferenceOrParentFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
        }),
      ).toEqual({
        from: {
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
          valuePath: new ValuePath([]),
        },
        isResolvable: true,
        to: {
          mode: 'default',
          treePath: new TreePath(['aDimension']),
        },
      });
    });

    it('should get the number token with an empty path', () => {
      const tokens: SpecifyDesignTokenFormat = {
        number: {
          $type: 'number',
          $value: { small: 1 },
        },
        aliasDimension: {
          $type: 'dimension',
          $value: { notDefault: { value: { $alias: 'aDimension', $mode: 'default' }, unit: 'px' } },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getAliasReferenceOrParentFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
        }),
      ).toEqual({
        from: {
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
          valuePath: new ValuePath(['value']),
        },
        isResolvable: false,
        reason: 'Token "aDimension" does not exist',
        to: {
          mode: 'default',
          treePath: new TreePath(['aDimension']),
        },
      });
    });

    it('should get an unresolvable reference', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aliasDimension: {
          $type: 'dimension',
          $value: { notDefault: { $alias: 'aDimension', $mode: 'default' } },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getAliasReferenceOrParentFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
        }),
      ).toEqual({
        from: {
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
          valuePath: new ValuePath([]),
        },
        isResolvable: false,
        reason: 'Token "aDimension" does not exist',
        to: {
          mode: 'default',
          treePath: new TreePath(['aDimension']),
        },
      });
    });

    it('should return an undefined as there is no alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: { notDefault: { value: 12, unit: 'px' } },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getAliasReferenceOrParentFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
        }),
      ).toBeUndefined();
    });

    it('should return an undefined as the path does not exists', () => {
      const tokens: SpecifyDesignTokenFormat = {};

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(
        treeState.getAliasReferenceOrParentFrom({
          valuePath: new ValuePath(['value']),
          mode: 'notDefault',
          treePath: new TreePath(['aliasDimension']),
        }),
      ).toBeUndefined();
    });
  });

  it('should get the dimension token with a path leading to the value into a nested token', () => {
    const tokens: SpecifyDesignTokenFormat = {
      valueGroup: {
        aDimension: {
          $type: 'dimension',
          $value: { default: { value: 12, unit: 'px' } },
          $description: 'A boolean',
        },
      },
      aliasGroup: {
        otherGroup: {
          aliasDimension: {
            $type: 'dimension',
            $value: { notDefault: { $alias: 'valueGroup.aDimension', $mode: 'default' } },
          },
        },
      },
    };

    const treeState = createTreeStateFromTokenTree(tokens);

    expect(
      treeState.getAliasReferenceOrParentFrom({
        valuePath: new ValuePath(['value']),
        mode: 'notDefault',
        treePath: new TreePath(['aliasGroup', 'otherGroup', 'aliasDimension']),
      }),
    ).toEqual({
      from: {
        mode: 'notDefault',
        treePath: new TreePath(['aliasGroup', 'otherGroup', 'aliasDimension']),
        valuePath: new ValuePath([]),
      },
      isResolvable: true,
      to: {
        mode: 'default',
        treePath: new TreePath(['valueGroup', 'aDimension']),
      },
    });
  });
});
