import { describe, expect, it } from 'vitest';

import {
  specifyCreatedAtTokenExtension,
  SpecifyDesignTokenFormat,
  specifySourceIdTokenExtension,
  specifyUpdatedAtTokenExtension,
  TokenSourceIds,
} from '../../../src/index.js';
import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import { SDTFQuery } from '../../../src/engine/query/index.js';

import { makeRunQuery } from '../../../src/engine/query/makeRunQuery.js';

describe.concurrent('makeRunQuery', () => {
  const source1Id = '25738289-e0ce-42c5-9a72-b170e672147e';
  const source2Id = 'a2dc96fc-b55b-4231-a039-221c4414baca';
  const createdAt1 = '2021-08-01T00:00:00.000Z';
  const createdAt2 = '2021-08-03T00:00:00.000Z';
  const createdAt3 = '2021-08-04T00:00:00.000Z';
  const updatedAt1 = '2021-08-05T00:00:00.000Z';
  const updatedAt2 = '2021-08-06T00:00:00.000Z';
  const updatedAt3 = '2021-08-07T00:00:00.000Z';

  const tokens: SpecifyDesignTokenFormat = {
    aGroup: {
      $description: 'This is a group',
      aString: {
        $type: 'string',
        $description: 'description of aString',
        $value: { default: 'a string' },
        $extensions: {
          [specifySourceIdTokenExtension]: source1Id,
          [specifyCreatedAtTokenExtension]: createdAt1,
          [specifyUpdatedAtTokenExtension]: updatedAt1,
        },
      },
      anotherString: {
        $type: 'string',
        $value: { $alias: 'aGroup.aString' },
        $extensions: {
          [specifySourceIdTokenExtension]: source1Id,
          [specifyCreatedAtTokenExtension]: createdAt1,
          [specifyUpdatedAtTokenExtension]: updatedAt1,
        },
      },
      aNestedGroupInGroup: {
        aSubNestedGroupInGroup: {
          aDimension: {
            $type: 'dimension',
            $value: {
              small: { value: 4, unit: 'px' },
              medium: { value: 8, unit: 'px' },
              large: { value: 16, unit: 'px' },
            },
            $extensions: {
              [specifySourceIdTokenExtension]: source1Id,
              [specifyCreatedAtTokenExtension]: createdAt1,
              [specifyUpdatedAtTokenExtension]: updatedAt1,
            },
          },
        },
      },
    },
    aColor: {
      $type: 'color',
      $description: 'This is a color',
      $value: { default: { model: 'hex', hex: '#808080', alpha: 1 } },
      $extensions: {
        [specifySourceIdTokenExtension]: source1Id,
        [specifyCreatedAtTokenExtension]: createdAt1,
        [specifyUpdatedAtTokenExtension]: updatedAt1,
      },
    },
    aColorWithAlias: {
      $type: 'color',
      $value: { $alias: 'aColor' },
      $extensions: {
        [specifySourceIdTokenExtension]: source1Id,
        [specifyCreatedAtTokenExtension]: createdAt1,
        [specifyUpdatedAtTokenExtension]: updatedAt1,
      },
    },
    aStringCollection: {
      $collection: { $modes: ['en', 'fr'] },
      $description: 'This is a string collection',
      aGroupInCollection: {
        $description: 'This is a group in a collection',
        aLocalizedStringInCollection: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaîne' },
          $extensions: {
            [specifySourceIdTokenExtension]: source1Id,
            [specifyCreatedAtTokenExtension]: createdAt3,
            [specifyUpdatedAtTokenExtension]: updatedAt3,
          },
        },
        aNestedGroupInCollection: {
          $description: 'This is a nested group in a collection',
        },
      },
    },
    aGroupWithNoChildren: {
      $description: 'This is a group with no children',
    },
    aGroupContainingCollection: {
      aNestedCollection: {
        $collection: { $modes: ['small', 'large'] },
        aDimensionInCollection: {
          $type: 'dimension',
          $value: { small: { value: 4, unit: 'px' }, large: { value: 16, unit: 'px' } },
          $extensions: {
            [specifySourceIdTokenExtension]: source2Id,
            [specifyCreatedAtTokenExtension]: createdAt2,
            [specifyUpdatedAtTokenExtension]: updatedAt2,
          },
        },
        aGroupInNestedCollection: {
          $description: 'This is a group in a nested collection',
        },
      },
    },
  };
  const treeState = createTreeStateFromTokenTree(tokens);

  describe.concurrent('where Token', () => {
    // Token basis
    it('should query any token on name', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          select: true,
        },
      };
      const nodes = makeRunQuery(treeState)(query);
      expect(nodes).toHaveLength(7);

      expect(nodes[0].path.toString()).toBe('aGroup.aString');
      expect(nodes[1].path.toString()).toBe('aGroup.anotherString');
      expect(nodes[2].path.toString()).toBe(
        'aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup.aDimension',
      );
      expect(nodes[3].path.toString()).toBe('aColor');
      expect(nodes[4].path.toString()).toBe('aColorWithAlias');
      expect(nodes[5].path.toString()).toBe(
        'aStringCollection.aGroupInCollection.aLocalizedStringInCollection',
      );
      expect(nodes[6].path.toString()).toBe(
        'aGroupContainingCollection.aNestedCollection.aDimensionInCollection',
      );
    });
    it('should query any token on description', () => {
      const query: SDTFQuery = {
        where: {
          token: {
            description: 'description of aString',
          },
          select: true,
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].description).toBe('description of aString');
    });
    it('should select any token in any group', () => {
      const query: SDTFQuery = {
        where: {
          group: '.*',
          andWhere: {
            token: '.*',
            select: true,
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(5);
      expect(nodes[0].path.toString()).toBe('aGroup.aString');
      expect(nodes[1].path.toString()).toBe('aGroup.anotherString');
      expect(nodes[2].path.toString()).toBe(
        'aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup.aDimension',
      );
      expect(nodes[3].path.toString()).toBe(
        'aStringCollection.aGroupInCollection.aLocalizedStringInCollection',
      );
      expect(nodes[4].path.toString()).toBe(
        'aGroupContainingCollection.aNestedCollection.aDimensionInCollection',
      );
    });

    // Token - withTypes
    it('should select any token based on included token types', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          withTypes: {
            include: ['color'],
          },
          select: true,
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].name).toBe('aColor');
      expect(nodes[1].name).toBe('aColorWithAlias');
    });
    it('should select any token based on excluded token types', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          withTypes: {
            exclude: ['color'],
          },
          select: true,
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(5);
      expect(nodes[0].path.toString()).toBe('aGroup.aString');
      expect(nodes[1].path.toString()).toBe('aGroup.anotherString');
      expect(nodes[2].path.toString()).toBe(
        'aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup.aDimension',
      );
      expect(nodes[3].path.toString()).toBe(
        'aStringCollection.aGroupInCollection.aLocalizedStringInCollection',
      );
      expect(nodes[4].path.toString()).toBe(
        'aGroupContainingCollection.aNestedCollection.aDimensionInCollection',
      );
    });
    it('should cancel itself when included token types and excluded token types are pointing to the same types ', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          withTypes: {
            include: ['color'],
            exclude: ['color'],
          },
          select: true,
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(0);
    });

    // Token - withModes
    it('should select any token based on included modes', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          withModes: {
            include: ['en'],
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aLocalizedStringInCollection');
    });
    it('should select any token based on excluded modes', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          withModes: {
            exclude: ['default'],
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(3);
      expect(nodes[0].path.toString()).toBe(
        'aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup.aDimension',
      );
      expect(nodes[1].path.toString()).toBe(
        'aStringCollection.aGroupInCollection.aLocalizedStringInCollection',
      );
      expect(nodes[2].path.toString()).toBe(
        'aGroupContainingCollection.aNestedCollection.aDimensionInCollection',
      );
    });

    // Token - atDepth - not implemented
    it('should fail selecting any token based on atDepth', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          atDepth: { upTo: 2 },
          select: true,
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Token where.atDepth is not implemented',
      );
    });
    // Token - nestedIn - not implemented
    it('should fail selecting any token based on nestedIn', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          nestedIn: {
            group: true,
          },
          select: true,
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Token where.nestedIn is not implemented',
      );
    });

    // Token - containsAliases
    it('should select any token based on included aliases', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          containsAliases: true,
          select: true,
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].name).toBe('anotherString');
      expect(nodes[1].name).toBe('aColorWithAlias');
    });
    it('should select any token based on excluded aliases', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          containsAliases: false,
          select: true,
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(5);
      expect(nodes[0].path.toString()).toBe('aGroup.aString');
      expect(nodes[1].path.toString()).toBe(
        'aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup.aDimension',
      );
      expect(nodes[2].path.toString()).toBe('aColor');
      expect(nodes[3].path.toString()).toBe(
        'aStringCollection.aGroupInCollection.aLocalizedStringInCollection',
      );
      expect(nodes[4].path.toString()).toBe(
        'aGroupContainingCollection.aNestedCollection.aDimensionInCollection',
      );
    });
    it('should select any token based on unresolvable aliases', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          containsAliases: { resolvability: 'unresolvable' },
          select: true,
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(0);
    });

    // Token - withSourceIds
    it('should select tokens included in sourceIds', () => {
      const sourceIds: TokenSourceIds = {
        include: [source1Id],
      };

      const query: SDTFQuery = {
        where: {
          token: '.*',
          withSourceIds: sourceIds,
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(6);
    });
    it('should select tokens excluded from sourceIds', () => {
      const sourceIds: TokenSourceIds = {
        exclude: [source1Id],
      };

      const query: SDTFQuery = {
        where: {
          token: '.*',
          withSourceIds: sourceIds,
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aDimensionInCollection');
    });

    // Token - withCreated
    it('should select tokens created after a specific date', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          created: {
            from: createdAt3,
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aLocalizedStringInCollection');
    });
    it('should select tokens created before a specific date', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          created: {
            to: createdAt2,
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(6);
    });
    it('should select tokens created between two specific dates', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          created: {
            from: createdAt2,
            to: createdAt3,
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].name).toBe('aLocalizedStringInCollection');
      expect(nodes[1].name).toBe('aDimensionInCollection');
    });

    // Token - withUpdated
    it('should select tokens updated after a specific date', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          updated: {
            from: updatedAt3,
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aLocalizedStringInCollection');
    });
    it('should select tokens updated before a specific date', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          updated: {
            to: updatedAt2,
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(6);
    });
    it('should select tokens updated between two specific dates', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          updated: {
            from: updatedAt2,
            to: updatedAt3,
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].name).toBe('aLocalizedStringInCollection');
      expect(nodes[1].name).toBe('aDimensionInCollection');
    });

    // Token - select
    it('should not select the token is select.token is false', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          select: {
            token: false,
          },
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(0);
    });
    it('should select the token if select.token is true', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          select: {
            token: true,
          },
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(7);
    });
    // Token - select - parents
    it('should select the parents of the token when the select.parents is true', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aLocalizedStringInCollection',
          select: {
            token: false,
            parents: true,
          },
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aStringCollection.aGroupInCollection');
      expect(nodes[1].path.toString()).toBe('aStringCollection');
    });
    it('should select the parents of the token upToDepth', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aLocalizedStringInCollection',
          select: {
            token: false,
            parents: { upToDepth: 2 },
          },
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aStringCollection.aGroupInCollection');
      expect(nodes[1].path.toString()).toBe('aStringCollection');
    });
    // Token - select - parents - not implemented
    it('should fail selecting the parents of the token equalToDepth', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aLocalizedStringInCollection',
          select: {
            token: false,
            parents: { equalToDepth: 2 },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrow(
        'Token select.parents.equalToDepth is not implemented',
      );
    });
    // Token - select - parents - groups
    it('should select the group parents of the token when the select.parents.groups is true', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aLocalizedStringInCollection',
          select: {
            token: false,
            parents: {
              groups: true,
            },
          },
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aStringCollection.aGroupInCollection');
    });
    it('should select the group parents of the the token when the select.parents.groups.upToDepth is 2', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aDimension$',
          select: {
            token: false,
            parents: {
              groups: {
                upToDepth: 2,
              },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup');
      expect(nodes[1].path.toString()).toBe('aGroup.aNestedGroupInGroup');
    });
    // Token - select - parents - groups - not implemented
    it('should fail selecting the group parents of the the token when the select.parents.groups.upToDepth is "collection"', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aDimension',
          select: {
            token: false,
            parents: {
              groups: {
                upToDepth: 'collection',
              },
            },
          },
        },
      };

      expect(() => {
        makeRunQuery(treeState)(query);
      }).toThrow('Token select.parents.groups.upToDepth as string is not implemented');
    });
    it('should fail selecting the group parents of the the token when the select.parents.groups.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aDimension',
          select: {
            token: false,
            parents: {
              groups: {
                equalToDepth: 1,
              },
            },
          },
        },
      };

      expect(() => {
        makeRunQuery(treeState)(query);
      }).toThrow('Token select.parents.groups.equalToDepth is not implemented');
    });
    // Token - select - parents - collections
    it('should select the collection parents of the token when the select.parents.collections is true', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aLocalizedStringInCollection',
          select: {
            token: false,
            parents: {
              collections: true,
            },
          },
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aStringCollection');
    });
    it('should select the collection parents of the the token when the select.parents.collections.upToDepth is 2', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aLocalizedStringInCollection',
          select: {
            token: false,
            parents: {
              collections: {
                upToDepth: 2,
              },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aStringCollection');
    });
    // Token - select - parents - collections - not implemented
    it('should fail selecting the collection parents of the the token when the select.parents.collections.upToDepth is "group"', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aLocalizedStringInCollection',
          select: {
            token: false,
            parents: {
              collections: {
                upToDepth: 'group',
              },
            },
          },
        },
      };

      expect(() => {
        makeRunQuery(treeState)(query);
      }).toThrow('Token select.parents.collections.upToDepth as string is not implemented');
    });
    it('should fail selecting the collection parents of the the token when the select.parents.collections.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aLocalizedStringInCollection',
          select: {
            token: false,
            parents: {
              collections: {
                equalToDepth: 1,
              },
            },
          },
        },
      };

      expect(() => {
        makeRunQuery(treeState)(query);
      }).toThrow('Token select.parents.collections.equalToDepth is not implemented');
    });

    // Token - select - parents - collections and groups
    it('should select the parents of the token when both the select.parents.groups and the select.parents.collections are true', () => {
      const query: SDTFQuery = {
        where: {
          token: 'aLocalizedStringInCollection',
          select: {
            token: false,
            parents: {
              groups: true,
              collections: true,
            },
          },
        },
      };
      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aStringCollection.aGroupInCollection');
      expect(nodes[1].path.toString()).toBe('aStringCollection');
    });
  });

  describe.concurrent('where Group', () => {
    // Group basis
    it('should select any group based on name', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aGroup');
    });
    it('should select any group based on description', () => {
      const query: SDTFQuery = {
        where: {
          group: {
            description: '^This is a group$',
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aGroup');
    });
    it('should select any group, direct parent of a token', () => {
      const query: SDTFQuery = {
        where: {
          token: '.*',
          select: {
            token: false,
            parents: {
              groups: true,
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(5);
      expect(nodes[0].name).toBe('aGroup');
      expect(nodes[1].name).toBe('aSubNestedGroupInGroup');
      expect(nodes[2].name).toBe('aNestedGroupInGroup');
      expect(nodes[3].name).toBe('aGroupInCollection');
      expect(nodes[4].name).toBe('aGroupContainingCollection');
    });

    // Group - atDepth - not implemented
    it('should fail selecting any group based on atDepth', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          atDepth: { upTo: 2 },
          select: true,
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group where.atDepth is not implemented',
      );
    });
    // Group - nestedIn - not implemented
    it('should fail selecting any group based on nestedIn', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          nestedIn: {
            collection: true,
          },
          select: true,
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group where.nestedIn is not implemented',
      );
    });

    // Group - select
    it('should not select the group if select.group is false', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(0);
    });
    it('should select the group if select.group is true', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: true,
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aGroup');
    });

    // Group - select - children
    it('should select all the children of the group when select.children is true', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aNestedGroupInGroup$',
          select: {
            group: false,
            children: true,
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup');
      expect(nodes[1].path.toString()).toBe(
        'aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup.aDimension',
      );
    });
    it('should select all the children of the group when select.children is upToDepth', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: { upToDepth: 1 },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(3);
      expect(nodes[0].path.toString()).toBe('aGroup.aNestedGroupInGroup');
      expect(nodes[1].path.toString()).toBe('aGroup.anotherString');
      expect(nodes[2].path.toString()).toBe('aGroup.aString');
    });
    // Group - select - children - not implemented
    it('should fail selecting the children of the group when select.children is equalToDepth', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: { equalToDepth: 1 },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.children.equalToDepth is not implemented',
      );
    });

    // Group - select - children - tokens
    it('should select the token children of the group when select.children.tokens is true', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: {
              tokens: true,
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(3);
      expect(nodes[0].path.toString()).toBe(
        'aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup.aDimension',
      );
      expect(nodes[1].path.toString()).toBe('aGroup.anotherString');
      expect(nodes[2].path.toString()).toBe('aGroup.aString');
    });
    it('should select the token children of the group when select.children.tokens.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: {
              tokens: { upToDepth: 1 },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aGroup.anotherString');
      expect(nodes[1].path.toString()).toBe('aGroup.aString');
    });
    // Group - select - children - tokens - not implemented
    it('should fail selecting the token children of the group when select.children.tokens.upToDepth is "group"', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: {
              tokens: { upToDepth: 'group' },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.children.tokens.upToDepth as string is not implemented',
      );
    });
    it('should fail selecting the token children of the group when select.children.tokens.equalToDepth is "group"', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: {
              tokens: { equalToDepth: 1 },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.children.tokens.equalToDepth is not implemented',
      );
    });

    // Group - select - children - groups
    it('should select the group children of the group when select.children.groups is true', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: {
              groups: true,
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aGroup.aNestedGroupInGroup');
      expect(nodes[1].path.toString()).toBe('aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup');
    });
    it('should select the group children of the group when select.children.groups.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: {
              groups: { upToDepth: 1 },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aGroup.aNestedGroupInGroup');
    });
    // Group - select - children - groups - not implemented
    it('should fail selecting the group children of the group when select.children.groups.upToDepth is "group"', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: {
              groups: { upToDepth: 'token' },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.children.groups.upToDepth as string is not implemented',
      );
    });
    it('should fail selecting the group children of the group when select.children.groups.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: {
              groups: { equalToDepth: 1 },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.children.groups.equalToDepth is not implemented',
      );
    });

    // Group - select - children - collections
    it('should select the collection children of the group when select.children.collections is true', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroupContainingCollection$',
          select: {
            group: false,
            children: {
              collections: true,
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aGroupContainingCollection.aNestedCollection');
    });
    it('should select the collection children of the group when select.children.collections.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroupContainingCollection$',
          select: {
            group: false,
            children: {
              collections: { upToDepth: 1 },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aGroupContainingCollection.aNestedCollection');
    });
    // Group - select - children - collections - not implemented
    it('should fail selecting the collection children of the group when select.children.collections.upToDepth is "group"', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroupContainingCollection$',
          select: {
            group: false,
            children: {
              collections: { upToDepth: 'group' },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.children.collections.upToDepth as string is not implemented',
      );
    });
    it('should fail selecting the collection children of the group when select.children.collections.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroupContainingCollection$',
          select: {
            group: false,
            children: {
              collections: { equalToDepth: 1 },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.children.collections.equalToDepth is not implemented',
      );
    });

    // Group - select - parents
    it('should select all the parents of the group if select.parents is true', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroupInNestedCollection$',
          select: {
            group: false,
            parents: true,
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aGroupContainingCollection.aNestedCollection');
      expect(nodes[1].path.toString()).toBe('aGroupContainingCollection');
    });
    it('should select all the parents of the group if select.parents.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aSubNestedGroupInGroup$',
          select: {
            group: false,
            parents: { upToDepth: 1 },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aGroup.aNestedGroupInGroup');
    });
    // Group - select - parents - not implemented
    it('should fail selecting all the parents of the group if select.parents.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aSubNestedGroupInGroup$',
          select: {
            group: false,
            parents: { equalToDepth: 1 },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.parents.equalToDepth is not implemented',
      );
    });

    // Group - select - parents - groups
    it('should select the group parents of the group when select.parents.groups is true', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aSubNestedGroupInGroup$',
          select: {
            group: false,
            parents: {
              groups: true,
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aGroup.aNestedGroupInGroup');
      expect(nodes[1].path.toString()).toBe('aGroup');
    });
    it('should select the group parents of the group when select.parents.groups.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aSubNestedGroupInGroup$',
          select: {
            group: false,
            parents: {
              groups: { upToDepth: 1 },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aGroup.aNestedGroupInGroup');
    });
    // Group - select - parents - groups - not implemented
    it('should fail selecting the group parents of the group when select.parents.groups.upToDepth is "collection"', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aSubNestedGroupInGroup$',
          select: {
            group: false,
            parents: {
              groups: { upToDepth: 'collection' },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.parents.groups.upToDepth as string is not implemented',
      );
    });
    it('should fail selecting the group parents of the group when select.parents.groups.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aSubNestedGroupInGroup$',
          select: {
            group: false,
            parents: {
              groups: { equalToDepth: 1 },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.parents.groups.equalToDepth is not implemented',
      );
    });

    // Group - select - parents - collections
    it('should select the collection parents of the group when select.parents.collections is true', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aNestedGroupInCollection$',
          select: {
            group: false,
            parents: {
              collections: true,
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aStringCollection');
    });
    it('should select the collection parents of the group when select.parents.collections.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroupInCollection$',
          select: {
            group: false,
            parents: {
              collections: { upToDepth: 1 },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aStringCollection');
    });
    // Group - select - parents - collections - not implemented
    it('should fail selecting the collection parents of the group when select.parents.collections.upToDepth is "group"', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroupInCollection$',
          select: {
            group: false,
            parents: {
              collections: { upToDepth: 'group' },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.parents.collections.upToDepth as string is not implemented',
      );
    });
    it('should fail selecting the collection parents of the group when select.parents.collections.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          group: '^aGroupInCollection$',
          select: {
            group: false,
            parents: {
              collections: { equalToDepth: 1 },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Group select.parents.collections.equalToDepth is not implemented',
      );
    });
  });

  describe.concurrent('where Collection', () => {
    // Collection basis
    it('should select any collection based on name', () => {
      const query: SDTFQuery = {
        where: {
          collection: '.*',
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aStringCollection');
      expect(nodes[1].path.toString()).toBe('aGroupContainingCollection.aNestedCollection');
    });
    it('should select any collection based on description', () => {
      const query: SDTFQuery = {
        where: {
          collection: {
            description: 'a string collection$',
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aStringCollection');
    });

    // Collection - withModes
    it('should select any collection based on withModes.include', () => {
      const query: SDTFQuery = {
        where: {
          collection: '.*',
          withModes: {
            include: ['fr'],
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aStringCollection');
    });
    it('should select any collection based on withModes.exclude', () => {
      const query: SDTFQuery = {
        where: {
          collection: '.*',
          withModes: {
            exclude: ['fr'],
          },
          select: true,
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].path.toString()).toBe('aGroupContainingCollection.aNestedCollection');
    });

    // Collection - atDepth - not implemented
    it('should fail selecting any collection based on atDepth', () => {
      const query: SDTFQuery = {
        where: {
          collection: '.*',
          atDepth: { upTo: 2 },
          select: true,
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Collection where.atDepth is not implemented',
      );
    });
    // Collection - nestedIn - not implemented
    it('should fail selecting any collection based on nestedIn', () => {
      const query: SDTFQuery = {
        where: {
          collection: '.*',
          nestedIn: {
            group: true,
          },
          select: true,
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Collection where.nestedIn is not implemented',
      );
    });

    // Collection - select
    it('should not select the collection if select.collection is false', () => {
      const query: SDTFQuery = {
        where: {
          collection: '.*',
          select: {
            collection: false,
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(0);
    });
    it('should select the collection if select.collection is true', () => {
      const query: SDTFQuery = {
        where: {
          collection: '.*',
          select: {
            collection: true,
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].path.toString()).toBe('aStringCollection');
      expect(nodes[1].path.toString()).toBe('aGroupContainingCollection.aNestedCollection');
    });

    // Collection - select - children
    it('should select all the children of the collection when select.children is true', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: true,
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(3);
      expect(nodes[0].name).toBe('aGroupInCollection');
      expect(nodes[1].name).toBe('aLocalizedStringInCollection');
    });
    it('should select all the children of the collection when select.children is upToDepth', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: { upToDepth: 1 },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aGroupInCollection');
    });
    // Collection - select - children - not implemented
    it('should fail selecting the children of the collection when select.children is equalToDepth', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: { equalToDepth: 1 },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Collection select.children.equalToDepth is not implemented',
      );
    });

    // Collection - select - children - tokens
    it('should select the token children of the collection when select.children.tokens is true', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: {
              tokens: true,
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aLocalizedStringInCollection');
    });
    it('should select the token children of the collection when select.children.tokens.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: {
              tokens: { upToDepth: 1 },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(0);
    });
    // Collection - select - children - tokens - not implemented
    it('should fail selecting the token children of the collection when select.children.tokens.upToDepth is "group"', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: {
              tokens: { upToDepth: 'group' },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Collection select.children.tokens.upToDepth as string is not implemented',
      );
    });
    it('should fail selecting the token children of the collection when select.children.tokens.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: {
              tokens: { equalToDepth: 1 },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Collection select.children.tokens.equalToDepth is not implemented',
      );
    });

    // Collection - select - children - groups
    it('should select the group children of the collection when select.children.groups is true', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: {
              groups: true,
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(2);
      expect(nodes[0].name).toBe('aGroupInCollection');
      expect(nodes[1].name).toBe('aNestedGroupInCollection');
    });
    it('should select the group children of the collection when select.children.groups.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: {
              groups: { upToDepth: 1 },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aGroupInCollection');
    });
    // Collection - select - children - groups - not implemented
    it('should fail selecting the group children of the collection when select.children.groups.upToDepth is "token"', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: {
              groups: { upToDepth: 'token' },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Collection select.children.groups.upToDepth as string is not implemented',
      );
    });
    it('should fail selecting the group children of the collection when select.children.groups.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aStringCollection$',
          select: {
            collection: false,
            children: {
              groups: { equalToDepth: 1 },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Collection select.children.groups.equalToDepth is not implemented',
      );
    });

    // Collection - select - parents
    it('should select all the parents of the collection if select.parents is true', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aNestedCollection$',
          select: {
            collection: false,
            parents: true,
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aGroupContainingCollection');
    });
    it('should select all the parents of the collection if select.parents.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aNestedCollection$',
          select: {
            collection: false,
            parents: { upToDepth: 1 },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aGroupContainingCollection');
    });
    // Collection - select - parents - not implemented
    it('should fail selecting all the parents of the collection if select.parents.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aNestedCollection$',
          select: {
            collection: false,
            parents: { equalToDepth: 1 },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Collection select.parents.equalToDepth is not implemented',
      );
    });

    // Collection - select - parents - groups
    it('should select the group parents of the collection when select.parents.groups is true', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aNestedCollection$',
          select: {
            collection: false,
            parents: {
              groups: true,
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aGroupContainingCollection');
    });
    it('should select the group parents of the collection when select.parents.groups.upToDepth is 1', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aNestedCollection$',
          select: {
            collection: false,
            parents: {
              groups: { upToDepth: 1 },
            },
          },
        },
      };

      const nodes = makeRunQuery(treeState)(query);

      expect(nodes).toHaveLength(1);
      expect(nodes[0].name).toBe('aGroupContainingCollection');
    });
    // Collection - select - parents - groups - not implemented
    it('should fail selecting the group parents of the collection when select.parents.groups.equalToDepth is number', () => {
      const query: SDTFQuery = {
        where: {
          collection: '^aNestedCollection$',
          select: {
            collection: false,
            parents: {
              groups: { equalToDepth: 1 },
            },
          },
        },
      };

      expect(() => makeRunQuery(treeState)(query)).toThrowError(
        'Collection select.parents.groups.equalToDepth is not implemented',
      );
    });
  });
});
