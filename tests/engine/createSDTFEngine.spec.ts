import { describe, it, expect } from 'vitest';
import { createSDTFEngine } from '../../src/engine/createSDTFEngine.js';
import {
  getAllMockedDesignTokens,
  SpecifyDesignToken,
  SpecifyDesignTokenFormat,
  SpecifyDesignTokenTypeName,
} from '../../src/index.js';
import { TreePath } from '../../src/engine/state/path/TreePath.js';

describe.concurrent('Engine', () => {
  it('should populate the SDTF API', () => {
    const engine = createSDTFEngine();

    expect(engine.renderJSONTree).toBeDefined();
    expect(engine.exportEngineState).toBeDefined();

    expect(engine.mutation.resetTokenTree).toBeDefined();
    expect(engine.mutation.loadTokenTree).toBeDefined();
    expect(engine.mutation.registerView).toBeDefined();
    expect(engine.mutation.setActiveView).toBeDefined();
    expect(engine.mutation.deleteView).toBeDefined();
    expect(engine.mutation.deleteAllViews).toBeDefined();
    expect(engine.mutation.addCollection).toBeDefined();
    expect(engine.mutation.renameCollection).toBeDefined();
    expect(engine.mutation.updateCollectionDescription).toBeDefined();
    expect(engine.mutation.updateCollectionExtensions).toBeDefined();
    expect(engine.mutation.renameCollectionMode).toBeDefined();
    expect(engine.mutation.truncateCollection).toBeDefined();
    expect(engine.mutation.deleteCollection).toBeDefined();
    expect(engine.mutation.deleteCollectionMode).toBeDefined();
    expect(engine.mutation.addGroup).toBeDefined();
    expect(engine.mutation.renameGroup).toBeDefined();
    expect(engine.mutation.updateGroupDescription).toBeDefined();
    expect(engine.mutation.updateGroupExtensions).toBeDefined();
    expect(engine.mutation.truncateGroup).toBeDefined();
    expect(engine.mutation.deleteGroup).toBeDefined();
    expect(engine.mutation.addToken).toBeDefined();
    expect(engine.mutation.renameToken).toBeDefined();
    expect(engine.mutation.updateTokenDescription).toBeDefined();
    expect(engine.mutation.updateTokenExtensions).toBeDefined();
    expect(engine.mutation.updateTokenValue).toBeDefined();
    expect(engine.mutation.updateTokenModeValue).toBeDefined();
    expect(engine.mutation.renameTokenMode).toBeDefined();
    expect(engine.mutation.createTokenModeValue).toBeDefined();
    expect(engine.mutation.deleteTokenModeValue).toBeDefined();
    expect(engine.mutation.deleteToken).toBeDefined();

    expect(engine.query.run).toBeDefined();
    expect(engine.query.getTokenState).toBeDefined();
    expect(engine.query.getGroupState).toBeDefined();
    expect(engine.query.getCollectionState).toBeDefined();
    expect(engine.query.getNearestCollectionState).toBeDefined();
    expect(engine.query.getAllTokenStates).toBeDefined();
    expect(engine.query.getAllGroupStates).toBeDefined();
    expect(engine.query.getAllCollectionStates).toBeDefined();
    expect(engine.query.getAllNodeStates).toBeDefined();
    expect(engine.query.getTokenChildrenOf).toBeDefined();
    expect(engine.query.getGroupChildrenOf).toBeDefined();
    expect(engine.query.getCollectionChildrenOf).toBeDefined();
    expect(engine.query.getChildrenOf).toBeDefined();
    expect(engine.query.getParentsOf).toBeDefined();
    expect(engine.query.getGroupChildren).toBeDefined();
    expect(engine.query.getTokenChildren).toBeDefined();
    expect(engine.query.getCollectionChildren).toBeDefined();
    expect(engine.query.renderJSONTree).toBeDefined();
    expect(engine.query.getAliasReference).toBeDefined();
    expect(engine.query.getAllAliasReferences).toBeDefined();
    expect(engine.query.getAliasReferencesTo).toBeDefined();
    expect(engine.query.getAliasReferencesFrom).toBeDefined();
    expect(engine.query.getStatefulAliasReference).toBeDefined();
    expect(engine.query.getStatefulAliasReferencesTo).toBeDefined();
    expect(engine.query.getStatefulAliasReferencesFrom).toBeDefined();
  });
  it('should parse and render the raw tokens from mocks with the very same values', () => {
    const tokens = getAllMockedDesignTokens({ asArray: false });

    const sdtfEngine = createSDTFEngine(tokens);

    expect(sdtfEngine.query.renderJSONTree()).toEqual(tokens);
  });
  it('should parse and render the aliased tokens with the very same values', () => {
    const tokens: { [token in SpecifyDesignTokenTypeName]: SpecifyDesignToken } = {
      string: { $type: 'string', $value: { default: { $alias: 'undefined', $mode: 'default' } } },
      number: { $type: 'number', $value: { default: { $alias: 'undefined', $mode: 'default' } } },
      boolean: { $type: 'boolean', $value: { default: { $alias: 'undefined', $mode: 'default' } } },
      null: { $type: 'null', $value: { default: { $alias: 'undefined', $mode: 'default' } } },
      array: { $type: 'array', $value: { default: { $alias: 'undefined', $mode: 'default' } } },
      object: { $type: 'object', $value: { default: { $alias: 'undefined', $mode: 'default' } } },
      integerNumber: {
        $type: 'integerNumber',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      zeroToOneNumber: {
        $type: 'zeroToOneNumber',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      arcDegreeNumber: {
        $type: 'arcDegreeNumber',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      rgbColorNumber: {
        $type: 'rgbColorNumber',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      positiveNumber: {
        $type: 'positiveNumber',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      positiveIntegerNumber: {
        $type: 'positiveIntegerNumber',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      percentageNumber: {
        $type: 'percentageNumber',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      hexadecimalColorString: {
        $type: 'hexadecimalColorString',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      bitmap: {
        $type: 'bitmap',
        $value: {
          default: {
            url: { $alias: 'undefined', $mode: 'default' },
            format: { $alias: 'undefined', $mode: 'default' },
            width: { $alias: 'undefined', $mode: 'default' },
            height: { $alias: 'undefined', $mode: 'default' },
            variationLabel: { $alias: 'undefined', $mode: 'default' },
            provider: 'Specify',
          },
        },
      },
      bitmapFormat: {
        $type: 'bitmapFormat',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      bitmaps: {
        $type: 'bitmaps',
        $value: {
          default: {
            files: [
              { $alias: 'bitmap', $mode: 'default' },
              {
                url: { $alias: 'undefined', $mode: 'default' },
                format: { $alias: 'undefined', $mode: 'default' },
                width: { $alias: 'undefined', $mode: 'default' },
                height: { $alias: 'undefined', $mode: 'default' },
                variationLabel: { $alias: 'undefined', $mode: 'default' },
                provider: 'Specify',
              },
            ],
          },
        },
      },
      blur: {
        $type: 'blur',
        $value: {
          default: {
            unit: { $alias: 'undefined', $mode: 'default' },
            value: { $alias: 'undefined', $mode: 'default' },
          },
        },
      },
      border: {
        $type: 'border',
        $value: {
          default: {
            color: { $alias: 'undefined', $mode: 'default' },
            style: { $alias: 'undefined', $mode: 'default' },
            width: { $alias: 'undefined', $mode: 'default' },
            rectangleCornerRadii: [
              { $alias: 'undefined', $mode: 'default' },
              { $alias: 'undefined', $mode: 'default' },
              { $alias: 'undefined', $mode: 'default' },
              { $alias: 'undefined', $mode: 'default' },
            ],
          },
        },
      },
      borderStyle: {
        $type: 'borderStyle',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      borderStyleLineCap: {
        $type: 'borderStyleLineCap',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      breakpoint: {
        $type: 'breakpoint',
        $value: {
          default: {
            unit: { $alias: 'undefined', $mode: 'default' },
            value: { $alias: 'undefined', $mode: 'default' },
          },
        },
      },
      color: {
        $type: 'color',
        $value: {
          default: {
            model: 'hex',
            hex: { $alias: 'undefined', $mode: 'default' },
            alpha: { $alias: 'undefined', $mode: 'default' },
          },
        },
      },
      cubicBezier: { $type: 'cubicBezier', $value: { default: [0, 0, 0, 0] } },
      dimension: {
        $type: 'dimension',
        $value: {
          default: {
            unit: { $alias: 'undefined', $mode: 'default' },
            value: { $alias: 'undefined', $mode: 'default' },
          },
        },
      },
      dimensionUnit: {
        $type: 'dimensionUnit',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      duration: {
        $type: 'duration',
        $value: {
          default: {
            unit: { $alias: 'undefined', $mode: 'default' },
            value: { $alias: 'undefined', $mode: 'default' },
          },
        },
      },
      durationUnit: {
        $type: 'durationUnit',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      font: {
        $type: 'font',
        $value: {
          default: {
            family: { $alias: 'undefined', $mode: 'default' },
            postScriptName: { $alias: 'undefined', $mode: 'default' },
            weight: { $alias: 'undefined', $mode: 'default' },
            style: { $alias: 'undefined', $mode: 'default' },
            files: [
              {
                url: { $alias: 'undefined', $mode: 'default' },
                format: { $alias: 'undefined', $mode: 'default' },
                provider: 'external',
              },
            ],
          },
        },
      },
      fontFamily: {
        $type: 'fontFamily',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      fontFeature: {
        $type: 'fontFeature',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      fontFeatures: {
        $type: 'fontFeatures',
        $value: { default: [{ $alias: 'undefined', $mode: 'default' }] },
      },
      fontFormat: {
        $type: 'fontFormat',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      fontStyle: {
        $type: 'fontStyle',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      fontWeight: {
        $type: 'fontWeight',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      gradient: {
        $type: 'gradient',
        $value: {
          default: {
            type: 'linear',
            angle: { $alias: 'undefined', $mode: 'default' },
            colorStops: [
              {
                color: { $alias: 'undefined', $mode: 'default' },
                position: { $alias: 'undefined', $mode: 'default' },
              },
              {
                color: { $alias: 'undefined', $mode: 'default' },
                position: { $alias: 'undefined', $mode: 'default' },
              },
            ],
          },
        },
      },
      gradients: {
        $type: 'gradients',
        $value: {
          default: [
            { $alias: 'undefined', $mode: 'default' },
            {
              type: 'linear',
              angle: { $alias: 'undefined', $mode: 'default' },
              colorStops: [
                {
                  color: { $alias: 'undefined', $mode: 'default' },
                  position: { $alias: 'undefined', $mode: 'default' },
                },
                {
                  color: { $alias: 'undefined', $mode: 'default' },
                  position: { $alias: 'undefined', $mode: 'default' },
                },
              ],
            },
          ],
        },
      },
      opacity: { $type: 'opacity', $value: { default: { $alias: 'undefined', $mode: 'default' } } },
      radius: {
        $type: 'radius',
        $value: {
          default: {
            unit: { $alias: 'undefined', $mode: 'default' },
            value: { $alias: 'undefined', $mode: 'default' },
          },
        },
      },
      radii: {
        $type: 'radii',
        $value: {
          default: [
            { $alias: 'undefined', $mode: 'default' },
            {
              unit: { $alias: 'undefined', $mode: 'default' },
              value: { $alias: 'undefined', $mode: 'default' },
            },
          ],
        },
      },
      shadow: {
        $type: 'shadow',
        $value: {
          default: {
            color: { $alias: 'undefined', $mode: 'default' },
            offsetX: { $alias: 'undefined', $mode: 'default' },
            offsetY: { $alias: 'undefined', $mode: 'default' },
            blurRadius: { $alias: 'undefined', $mode: 'default' },
            spreadRadius: { $alias: 'undefined', $mode: 'default' },
            type: { $alias: 'undefined', $mode: 'default' },
          },
        },
      },
      shadows: {
        $type: 'shadows',
        $value: {
          default: [
            { $alias: 'undefined', $mode: 'default' },
            {
              color: { $alias: 'undefined', $mode: 'default' },
              offsetX: { $alias: 'undefined', $mode: 'default' },
              offsetY: { $alias: 'undefined', $mode: 'default' },
              blurRadius: { $alias: 'undefined', $mode: 'default' },
              spreadRadius: { $alias: 'undefined', $mode: 'default' },
              type: { $alias: 'undefined', $mode: 'default' },
            },
          ],
        },
      },
      shadowType: {
        $type: 'shadowType',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      spacing: {
        $type: 'spacing',
        $value: {
          default: {
            unit: { $alias: 'undefined', $mode: 'default' },
            value: { $alias: 'undefined', $mode: 'default' },
          },
        },
      },
      spacings: {
        $type: 'spacings',
        $value: { default: [{ $alias: 'undefined', $mode: 'default' }] },
      },
      stepsTimingFunction: {
        $type: 'stepsTimingFunction',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      textAlignHorizontal: {
        $type: 'textAlignHorizontal',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      textAlignVertical: {
        $type: 'textAlignVertical',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      textDecoration: {
        $type: 'textDecoration',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      textStyle: {
        $type: 'textStyle',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      textTransform: {
        $type: 'textTransform',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      transition: {
        $type: 'transition',
        $value: {
          default: {
            duration: { $alias: 'undefined', $mode: 'default' },
            delay: { $alias: 'undefined', $mode: 'default' },
            timingFunction: { $alias: 'undefined', $mode: 'default' },
          },
        },
      },
      vector: {
        $type: 'vector',
        $value: {
          default: {
            url: { $alias: 'undefined', $mode: 'default' },
            format: { $alias: 'undefined', $mode: 'default' },
            variationLabel: { $alias: 'undefined', $mode: 'default' },
            provider: 'Specify',
          },
        },
      },
      vectorFormat: {
        $type: 'vectorFormat',
        $value: { default: { $alias: 'undefined', $mode: 'default' } },
      },
      vectors: {
        $type: 'vectors',
        $value: {
          default: {
            files: [
              { $alias: 'vector', $mode: 'default' },
              {
                url: { $alias: 'undefined', $mode: 'default' },
                format: { $alias: 'undefined', $mode: 'default' },
                variationLabel: { $alias: 'undefined', $mode: 'default' },
                provider: 'Specify',
              },
            ],
          },
        },
      },
      zIndex: { $type: 'zIndex', $value: { default: { $alias: 'undefined', $mode: 'default' } } },
    };

    const sdtfEngine = createSDTFEngine(tokens);

    expect(sdtfEngine.query.renderJSONTree()).toEqual(tokens);
  });
});

describe.concurrent('SDTFEngine', () => {
  describe.concurrent('clone', () => {
    it('should clone a SDTFEngine and its views', () => {
      const tokenTree: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'a string' } },
        aNumber: { $type: 'number', $value: { default: 4 } },
      };

      const sdtfEngine = createSDTFEngine(tokenTree, {
        activeViewName: 'one',
        views: [
          {
            name: 'one',
            query: {
              where: { token: '.*', withTypes: { include: ['string'] }, select: true },
            },
          },
          {
            name: 'two',
            query: {
              where: { token: '.*', withTypes: { include: ['number'] }, select: true },
            },
          },
        ],
      });

      const cloned = sdtfEngine.clone();

      cloned.mutation.updateTokenModeValue({
        atPath: new TreePath(['aString']),
        mode: 'default',
        value: 'a string updated',
      });

      expect(cloned.renderJSONTree()).toStrictEqual({
        aString: { $type: 'string', $value: { default: 'a string updated' } },
        aNumber: { $type: 'number', $value: { default: 4 } },
      });

      expect(sdtfEngine.renderJSONTree()).toStrictEqual({
        aString: { $type: 'string', $value: { default: 'a string' } },
        aNumber: { $type: 'number', $value: { default: 4 } },
      });

      expect(cloned.query.getActiveView()).toStrictEqual(sdtfEngine.query.getActiveView());

      cloned.mutation.setActiveView({ name: 'two' });

      expect(cloned.query.getActiveView()).toStrictEqual({
        name: 'two',
        query: {
          where: { token: '.*', withTypes: { include: ['number'] }, select: true },
        },
      });
    });
  });
  describe.concurrent('mutation.loadTokenTree', () => {
    it('should load a new token tree', () => {
      const initialTokenTree: SpecifyDesignTokenFormat = {
        colors: {
          blue: {
            $type: 'color',
            $value: {
              default: {
                model: 'hex',
                hex: '#0000ff',
                alpha: 1,
              },
            },
          },
        },
        aString: {
          $type: 'string',
          $value: {
            default: 'a string',
          },
        },
      };

      const sdtfEngine = createSDTFEngine(initialTokenTree);
      expect(sdtfEngine.renderJSONTree()).toEqual(initialTokenTree);

      const newTokenTree: SpecifyDesignTokenFormat = {
        aNumber: { $type: 'number', $value: { default: 1 } },
      };
      sdtfEngine.mutation.loadTokenTree({
        tokens: newTokenTree,
      });

      expect(sdtfEngine.renderJSONTree()).toEqual(newTokenTree);
    });
  });
});

describe.concurrent('createSDTFEngine EDGE CASES', () => {
  it('should parse a token tree containing aliases to tokens in collection prior in tree order', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      primitive: {
        $collection: {
          $modes: ['Mode'],
        },
        lightGray: {
          $type: 'color',
          $value: {
            Mode: { model: 'rgb', red: 75, green: 75, blue: 75, alpha: 0.08 },
          },
        },
        darkGray: {
          $type: 'color',
          $value: {
            Mode: { model: 'rgb', red: 22, green: 22, blue: 22, alpha: 0.08 },
          },
        },
      },
      aColorBefore: {
        $type: 'color',
        $value: {
          default: { $alias: 'themed.aThemedColor', $mode: 'Dark' },
        },
      },
      themed: {
        $collection: {
          $modes: ['Light', 'Dark'],
        },
        aThemedColor: {
          $type: 'color',
          $value: {
            Dark: { $alias: 'primitive.darkGray', $mode: 'Mode' },
            // Dark: { model: 'rgb', red: 22, green: 22, blue: 22, alpha: 0.08 },
            Light: { $alias: 'primitive.lightGray', $mode: 'Mode' },
          },
        },
      },
    };

    const sdtfEngine = createSDTFEngine(tokenTree);

    expect(sdtfEngine.query.renderJSONTree()).toEqual(tokenTree);
  });
});
