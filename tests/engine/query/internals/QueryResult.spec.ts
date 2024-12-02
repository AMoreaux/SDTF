import { describe, it, expect } from 'vitest';
import { createSDTFEngine, SpecifyDesignTokenFormat, TokenState } from '../../../../src/index.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('SDTFEngine - QueryResult', () => {
  const tokens: SpecifyDesignTokenFormat = {
    aGroup: {
      $description: 'This is a group',
      aString: {
        $type: 'string',
        $description: 'description of aString',
        $value: { default: 'a string' },
      },
      anotherString: {
        $type: 'string',
        $value: { $alias: 'aGroup.aString' },
      },
      aNestedGroupInGroup: {
        $description: 'This is a nested group in a group',
        $extensions: { a: 'b' },
        aSubNestedGroupInGroup: {
          $description: 'This is a sub nested group in a group',
          aDimension: {
            $type: 'dimension',
            $value: {
              small: { value: 4, unit: 'px' },
              medium: { value: 8, unit: 'px' },
              large: { value: 16, unit: 'px' },
            },
          },
        },
      },
    },
    anotherTopLevelGroup: {
      $description: 'This is another top level group',
    },
    aColor: {
      $type: 'color',
      $description: 'This is a color',
      $value: { default: { model: 'hex', hex: '#808080', alpha: 1 } },
    },
    aColorWithAlias: {
      $type: 'color',
      $value: { $alias: 'aColor' },
    },
    aStringCollection: {
      $collection: { $modes: ['en', 'fr'] },
      $description: 'This is a string collection',
      aGroupInCollection: {
        $description: 'This is a group in a collection',
        aLocalizedStringInCollection: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaîne' },
        },
        aNestedGroupInCollection: {
          $description: 'This is a nested group in a collection',
        },
      },
      anotherGroupInCollection: {
        $description: 'This is another group in a collection',
      },
    },
    aGroupWithNoChildren: {
      $description: 'This is a group with no children',
    },
    aGroupContainingCollection: {
      $description: 'This is a group containing a collection',
      aNestedCollection: {
        $collection: { $modes: ['small', 'large'] },
        aDimensionInCollection: {
          $type: 'dimension',
          $value: { small: { value: 4, unit: 'px' }, large: { value: 16, unit: 'px' } },
        },
        aGroupInNestedCollection: {
          $description: 'This is a group in a nested collection',
        },
      },
    },
  };
  const engine = createSDTFEngine(tokens);

  describe.concurrent('get isContinuous', () => {
    it('should return true when querying a single group without children', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: true,
        },
      });

      expect(nodes.isContinuous).toBe(true);
    });
    it('should return true when querying a single group with children', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: {
            children: true,
          },
        },
      });

      expect(nodes.isContinuous).toBe(true);
    });
    it('should return true when querying two root groups', () => {
      const nodes = engine.query.run({
        where: [
          {
            group: '^aGroup$',
            select: true,
          },
          {
            group: '^anotherTopLevelGroup$',
            select: true,
          },
        ],
      });

      expect(nodes.isContinuous).toBe(true);
    });
    it('should return false when querying two non-root groups', () => {
      const nodes = engine.query.run({
        where: [
          {
            group: '^aNestedGroupInGroup$',
            select: true,
          },
          {
            group: '^aGroupInNestedCollection$',
            select: true,
          },
        ],
      });

      expect(nodes.isContinuous).toBe(false);
    });
  });

  describe.concurrent('render', () => {
    it('should render the graph of a single root group with no children', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: true,
        },
      });

      expect(nodes.length).toBe(1);
      expect(nodes.isContinuous).toBe(true);

      const details = nodes.render();

      expect(details.length).toBe(1);
      const detail = details[0];
      expect(detail.parentPath).toEqual(new TreePath([]));
      expect(detail.isRoot).toBe(true);
      expect(detail.isComplete).toBe(false);
      expect(detail.sdtf).toEqual({
        aGroup: {
          $description: tokens.aGroup.$description,
        },
      });
    });
    it('should render the graph of the children of a single root group', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: {
            group: false,
            children: true,
          },
        },
      });

      expect(nodes.length).toBe(5);
      expect(nodes.isContinuous).toBe(false);

      const details = nodes.render();

      expect(details.length).toBe(1);
      const detail = details[0];
      expect(detail.parentPath).toEqual(new TreePath(['aGroup']));
      expect(detail.isRoot).toBe(false);
      expect(detail.isComplete).toBe(true);
      // We spread the description because it is not expected to be rendered
      const { $description, ...rest } = tokens.aGroup;
      expect(detail.sdtf).toEqual(rest);
    });
    it('should render the graph of two root groups with no children', () => {
      const nodes = engine.query.run({
        where: [
          {
            group: '^aGroup$',
            select: true,
          },
          {
            group: '^anotherTopLevelGroup$',
            select: true,
          },
        ],
      });

      expect(nodes.length).toBe(2);

      const details = nodes.render();
      expect(details.length).toBe(1);

      expect(details[0].parentPath).toEqual(new TreePath([]));
      expect(details[0].isRoot).toBe(true);
      expect(details[0].isComplete).toBe(false);
      expect(details[0].sdtf).toEqual({
        aGroup: {
          $description: tokens.aGroup.$description,
        },
        anotherTopLevelGroup: {
          $description: tokens.anotherTopLevelGroup.$description,
        },
      });
    });
    it('should render the graphs of two non-root groups with no children', () => {
      const nodes = engine.query.run({
        where: [
          {
            group: '^aNestedGroupInGroup$',
            select: true,
          },
          {
            group: '^aGroupInNestedCollection$',
            select: true,
          },
        ],
      });

      expect(nodes.length).toBe(2);

      const details = nodes.render();
      expect(details.length).toBe(2);

      expect(details[0].parentPath).toEqual(new TreePath(['aGroup']));
      expect(details[0].isRoot).toBe(false);
      expect(details[0].isComplete).toBe(false);
      expect(details[0].sdtf).toEqual({
        aNestedGroupInGroup: {
          $description: (tokens as any).aGroup.aNestedGroupInGroup.$description,
          $extensions: (tokens as any).aGroup.aNestedGroupInGroup.$extensions,
        },
      });

      expect(details[1].parentPath).toEqual(
        new TreePath(['aGroupContainingCollection', 'aNestedCollection']),
      );
      expect(details[1].isRoot).toBe(false);
      expect(details[1].isComplete).toBe(false);
      expect(details[1].sdtf).toEqual({
        aGroupInNestedCollection: {
          $description: (tokens as any).aGroupContainingCollection.aNestedCollection
            .aGroupInNestedCollection.$description,
        },
      });
    });
    it('should render the graphs of two non-root groups with children', () => {
      const nodes = engine.query.run({
        where: [
          {
            group: '^aNestedGroupInGroup$',
            select: {
              group: false,
              children: true,
            },
          },
          {
            group: '^aGroupInCollection$',
            select: {
              group: false,
              children: true,
            },
          },
        ],
      });

      expect(nodes.length).toBe(4);

      const details = nodes.render();

      expect(details.length).toBe(2);

      expect(details[0].parentPath).toEqual(new TreePath(['aGroup', 'aNestedGroupInGroup']));
      expect(details[0].isRoot).toBe(false);
      expect(details[0].isComplete).toBe(true);
      const { aSubNestedGroupInGroup } = (tokens as any).aGroup.aNestedGroupInGroup;
      expect(details[0].sdtf).toEqual({
        aSubNestedGroupInGroup,
      });

      expect(details[1].parentPath).toEqual(
        new TreePath(['aStringCollection', 'aGroupInCollection']),
      );
      expect(details[1].isRoot).toBe(false);
      expect(details[1].isComplete).toBe(true);
      const { aLocalizedStringInCollection, aNestedGroupInCollection } = (tokens as any)
        .aStringCollection.aGroupInCollection;
      expect(details[1].sdtf).toEqual({
        aLocalizedStringInCollection,
        aNestedGroupInCollection,
      });
    });
  });

  describe.concurrent('hasNodeType', () => {
    it('should return true when the group node type is present', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aRootToken: { $type: 'number', $value: { default: 1 } },
        aGroup: {
          aString: { $type: 'string', $value: { default: 'a string' } },
        },
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
          aLocalizedString: { $type: 'string', $value: { en: 'a string', fr: 'une chaîne' } },
        },
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: {
          group: '.*',
          select: true,
        },
      });

      expect(nodes.hasNodeType('group')).toBe(true);
    });
    it('should return true when the collection node type is present', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aRootToken: { $type: 'number', $value: { default: 1 } },
        aGroup: {
          aString: { $type: 'string', $value: { default: 'a string' } },
        },
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
          aLocalizedString: { $type: 'string', $value: { en: 'a string', fr: 'une chaîne' } },
        },
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: {
          collection: '.*',
          select: true,
        },
      });

      expect(nodes.hasNodeType('collection')).toBe(true);
    });
    it('should return true when the token node type is present', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aRootToken: { $type: 'number', $value: { default: 1 } },
        aGroup: {
          aString: { $type: 'string', $value: { default: 'a string' } },
        },
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
          aLocalizedString: { $type: 'string', $value: { en: 'a string', fr: 'une chaîne' } },
        },
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: {
          token: '.*',
          select: true,
        },
      });

      expect(nodes.hasNodeType('token')).toBe(true);
    });
    it('should return false when the group node type is not present', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aRootToken: { $type: 'number', $value: { default: 1 } },
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
          aLocalizedString: { $type: 'string', $value: { en: 'a string', fr: 'une chaîne' } },
        },
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: {
          collection: '.*',
          select: true,
        },
      });

      expect(nodes.hasNodeType('group')).toBe(false);
    });
    it('should return false when the collection node type is not present', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aRootToken: { $type: 'number', $value: { default: 1 } },
        aGroup: {
          aString: { $type: 'string', $value: { default: 'a string' } },
        },
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: {
          group: '.*',
          select: true,
        },
      });

      expect(nodes.hasNodeType('collection')).toBe(false);
    });
    it('should return false when the token node type is not present', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {},
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
        },
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: {
          token: '.*',
          select: true,
        },
      });

      expect(nodes.hasNodeType('token')).toBe(false);
    });
  });

  describe.concurrent('hasOnlyNodeType', () => {
    it('should return true when the result holds only group nodes', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {},
        anotherGroup: {},
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: {
          group: '.*',
          select: true,
        },
      });

      expect(nodes.hasOnlyNodeType('group')).toBe(true);
    });
    it('should return true when the result holds only collection nodes', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
        },
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: {
          collection: '.*',
          select: true,
        },
      });

      expect(nodes.hasOnlyNodeType('collection')).toBe(true);
    });
    it('should return true when the result holds only token nodes', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aToken: { $type: 'string', $value: { default: 'a string' } },
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: {
          token: '.*',
          select: true,
        },
      });

      expect(nodes.hasOnlyNodeType('token')).toBe(true);
    });
    it('should return false when the result holds all of types', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {},
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
        },
        aToken: { $type: 'string', $value: { default: 'a string' } },
      };

      const engine = createSDTFEngine(tokens);

      const nodes = engine.query.run({
        where: [
          { group: '.*', select: true },
          { token: '.*', select: true },
          { collection: '.*', select: true },
        ],
      });

      expect(nodes).toHaveLength(3);

      expect(nodes.hasOnlyNodeType('token')).toBe(false);

      expect(nodes.hasOnlyNodeType('group')).toBe(false);

      expect(nodes.hasOnlyNodeType('collection')).toBe(false);
    });
  });

  describe.concurrent('merge', () => {
    it('should render a valid sdtf', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroupOfColors: {
          $description: 'This is a group of colors',
          aSubGroupOfColors: {
            aTopLevelAlias: {
              $type: 'color',
              $value: { $alias: 'aGroupOfColors.aSubGroupOfColors.aColor' },
            },
            aColor: {
              $type: 'color',
              $description: 'This is a color',
              $value: { default: { model: 'hex', hex: '#808080', alpha: 1 } },
            },
            aModeLevelAlias: {
              $type: 'color',
              $value: {
                custom: { $alias: 'aGroupOfColors.aSubGroupOfColors.aColor', $mode: 'default' },
              },
            },
          },
        },
        aGroupOfDimensions: {
          $description: 'This is a group of dimensions',
          aSubGroupOfDimensions: {
            aDimension: {
              $type: 'dimension',
              $description: 'This is a dimension',
              $value: { default: { value: 4, unit: 'px' } },
            },
            anotherDimension: {
              $type: 'dimension',
              $value: { $alias: 'aGroupOfDimensions.aSubGroupOfDimensions.aDimension' },
            },
          },
        },
      };

      const result = createSDTFEngine(tokens).query.run({
        where: {
          group: 'aSub(.*)',
          select: {
            children: true,
          },
        },
      });

      const { treeState } = result.merge();

      expect(treeState.renderJSONTree()).toStrictEqual({
        aSubGroupOfColors: {
          aColor: {
            $type: 'color',
            $value: {
              default: { model: 'hex', hex: '#808080', alpha: 1 },
            },
            $description: 'This is a color',
          },
          aTopLevelAlias: {
            $type: 'color',
            $value: {
              $alias: 'aSubGroupOfColors.aColor',
            },
          },
          aModeLevelAlias: {
            $type: 'color',
            $value: {
              custom: { $alias: 'aSubGroupOfColors.aColor', $mode: 'default' },
            },
          },
        },
        aSubGroupOfDimensions: {
          aDimension: {
            $type: 'dimension',
            $value: {
              default: { value: 4, unit: 'px' },
            },
            $description: 'This is a dimension',
          },
          anotherDimension: {
            $type: 'dimension',
            $value: {
              $alias: 'aSubGroupOfDimensions.aDimension',
            },
          },
        },
      });
    });
    it('should not mutate the initial TreeState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroupOfColors: {
          $description: 'This is a group of colors',
          aSubGroupOfColors: {
            aTopLevelAlias: {
              $type: 'color',
              $value: { $alias: 'aGroupOfColors.aSubGroupOfColors.aColor' },
            },
            aColor: {
              $type: 'color',
              $description: 'This is a color',
              $value: { default: { model: 'hex', hex: '#808080', alpha: 1 } },
            },
            aModeLevelAlias: {
              $type: 'color',
              $value: {
                custom: { $alias: 'aGroupOfColors.aSubGroupOfColors.aColor', $mode: 'default' },
              },
            },
          },
        },
        aGroupOfDimensions: {
          $description: 'This is a group of dimensions',
          aSubGroupOfDimensions: {
            aDimension: {
              $type: 'dimension',
              $description: 'This is a dimension',
              $value: { default: { value: 4, unit: 'px' } },
            },
            anotherDimension: {
              $type: 'dimension',
              $value: { $alias: 'aGroupOfDimensions.aSubGroupOfDimensions.aDimension' },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);

      const queryResult = engine.query.run({
        where: {
          group: 'aSub(.*)',
          select: {
            children: true,
          },
        },
      });
      const { treeState } = queryResult.merge();

      expect(treeState.renderJSONTree()).toStrictEqual({
        aSubGroupOfColors: {
          aColor: {
            $type: 'color',
            $value: {
              default: { model: 'hex', hex: '#808080', alpha: 1 },
            },
            $description: 'This is a color',
          },
          aTopLevelAlias: {
            $type: 'color',
            $value: {
              $alias: 'aSubGroupOfColors.aColor',
            },
          },
          aModeLevelAlias: {
            $type: 'color',
            $value: {
              custom: { $alias: 'aSubGroupOfColors.aColor', $mode: 'default' },
            },
          },
        },
        aSubGroupOfDimensions: {
          aDimension: {
            $type: 'dimension',
            $value: {
              default: { value: 4, unit: 'px' },
            },
            $description: 'This is a dimension',
          },
          anotherDimension: {
            $type: 'dimension',
            $value: {
              $alias: 'aSubGroupOfDimensions.aDimension',
            },
          },
        },
      });

      const initial = engine.query.renderJSONTree();
      expect(initial).toStrictEqual(tokens);
    });
    it('should retrieve tokens only', () => {
      const tokens: SpecifyDesignTokenFormat = {
        group1: {
          colors: {
            primary: {
              $type: 'color',
              $value: {
                light: { model: 'hex', hex: '#000000', alpha: 1 },
                dark: { model: 'hex', hex: '#ffffff', alpha: 1 },
              },
            },
          },
          secondary: {
            $type: 'color',
            $value: {
              $alias: 'group1.colors.primary',
            },
          },
        },
        group2: {
          dimensions: {
            base: {
              $type: 'dimension',
              $value: {
                default: { value: 4, unit: 'px' },
              },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);

      const queryResult = engine.query.run({
        where: {
          token: '.*',
          select: true,
        },
      });
      const { treeState } = queryResult.merge();

      expect(treeState.renderJSONTree()).toStrictEqual({
        primary: {
          $type: 'color',
          $value: {
            light: { model: 'hex', hex: '#000000', alpha: 1 },
            dark: { model: 'hex', hex: '#ffffff', alpha: 1 },
          },
        },
        secondary: {
          $type: 'color',
          $value: {
            $alias: 'primary',
          },
        },
        base: {
          $type: 'dimension',
          $value: {
            default: { value: 4, unit: 'px' },
          },
        },
      });
    });
    it('should fail if query return duplicate nodes', () => {
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
      };

      const engine = createSDTFEngine(tokens);

      const queryResult = engine.query.run({
        where: {
          token: '.*',
          select: true,
        },
      });
      expect(() => queryResult.merge()).toThrow('Path "aToken" is already taken.');
    });
    it('should dedupe nodes', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
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
          aCollection: {
            $collection: { $modes: ['default'] },
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
      };

      const engine = createSDTFEngine(tokens);

      const queryResult = engine.query.run({
        where: {
          token: '.*',
          select: true,
        },
      });

      const { treeState } = queryResult.merge(true);

      expect(Object.keys(treeState.toJSON())).toEqual(
        expect.arrayContaining(['aToken-1', 'aToken-2', 'aToken-3', 'aToken']),
      );
    });
    it('should dedupe nodes with custom function', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
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
          aCollection: {
            $collection: { $modes: ['default'] },
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
      };

      const engine = createSDTFEngine(tokens);

      const queryResult = engine.query.run({
        where: {
          token: '.*',
          select: true,
        },
      });

      let counter = 0;
      const { treeState } = queryResult.merge((treeState, node) => {
        if (node instanceof TokenState) {
          counter++;
          treeState.renameToken(node.path, `${node.path.tail()}-${counter}`);
        }
      });

      expect(Object.keys(treeState.toJSON())).toEqual(
        expect.arrayContaining(['aToken-1', 'aToken-2', 'aToken-3', 'aToken']),
      );
    });
  });

  describe.concurrent('getPaths', () => {
    it('should return the string paths by default when omitting param', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: true,
        },
      });

      const paths = nodes.getPaths();

      expect(paths).toEqual(['aGroup']);
    });
    it('should return the string paths of a single root group with no children', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: true,
        },
      });

      const paths = nodes.getPaths('string');

      expect(paths).toEqual(['aGroup']);
    });
    it('should return the string paths of the children of a single root group', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: {
            group: true,
            children: true,
          },
        },
      });

      const paths = nodes.getPaths('string');

      expect(paths).toEqual([
        'aGroup',
        'aGroup.aNestedGroupInGroup',
        'aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup',
        'aGroup.aNestedGroupInGroup.aSubNestedGroupInGroup.aDimension',
        'aGroup.anotherString',
        'aGroup.aString',
      ]);
    });
    it('should return the array paths of a single root group with no children', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: true,
        },
      });

      const paths = nodes.getPaths('array');

      expect(paths).toEqual([['aGroup']]);
    });
    it('should return the array paths of the children of a single root group', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: {
            group: true,
            children: true,
          },
        },
      });

      const paths = nodes.getPaths('array');

      expect(paths).toEqual([
        ['aGroup'],
        ['aGroup', 'aNestedGroupInGroup'],
        ['aGroup', 'aNestedGroupInGroup', 'aSubNestedGroupInGroup'],
        ['aGroup', 'aNestedGroupInGroup', 'aSubNestedGroupInGroup', 'aDimension'],
        ['aGroup', 'anotherString'],
        ['aGroup', 'aString'],
      ]);
    });
  });

  describe.concurrent('toJSON', () => {
    it('should render the JSON representation of results', () => {
      const nodes = engine.query.run({
        where: {
          group: '^aGroup$',
          select: {
            group: true,
            children: true,
          },
        },
      });

      expect(nodes.toJSON()).toEqual({
        isContinuous: true,
        graphs: [
          {
            isRoot: true,
            parentPath: new TreePath([]),
            isComplete: false,
            sdtf: {
              aGroup: {
                ...tokens.aGroup,
              },
            },
          },
        ],
      });
    });
  });

  describe.concurrent('toArray', () => {
    it('should return an array of nodes', () => {
      const nodes = engine.query.run({
        where: {
          token: '.*',
          select: true,
        },
      });

      const result = nodes.toArray();

      expect(
        // @ts-expect-error - expected invalid property
        result.render,
      ).toBeUndefined();
    });

    it('should execute a native map', () => {
      const nodes = engine.query.run({
        where: {
          token: '.*',
          select: true,
        },
      });

      const names = nodes.map(v => v.name);

      expect(names).toEqual([
        'aString',
        'anotherString',
        'aDimension',
        'aColor',
        'aColorWithAlias',
        'aLocalizedStringInCollection',
        'aDimensionInCollection',
      ]);
    });
  });
});
