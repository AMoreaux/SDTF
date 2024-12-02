import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { SpecifyDesignTokenFormat } from '../../../src/index.js';

import { analyzeTokenTree } from '../../../src/engine/parser/analyzeTokenTree.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('analyzeTokenTree', () => {
  it('should analyze a token tree with raw values only', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aColorCollection: {
        $collection: {
          $modes: ['light', 'dark'],
        },
        $description: 'A collection of colors',
        $extensions: {
          'com.specifyapp.extensions.color': '1.0.0',
        },
        aColor: {
          $type: 'color',
          $value: {
            light: { model: 'hex', hex: '#ffffff', alpha: 1 },
            dark: { model: 'hex', hex: '#000000', alpha: 1 },
          },
          $description: 'A color',
          $extensions: {
            'com.specifyapp.extensions.active': true,
          },
        },
      },
      aGroup: {
        $description: 'A group',
        $extensions: {
          'com.specifyapp.extensions.active': true,
        },
        aDimensionInGroup: {
          $type: 'dimension',
          $value: {
            base: { unit: 'px', value: 8 },
            large: { unit: 'px', value: 16 },
          },
          $description: 'A dimension',
          $extensions: {
            'com.specifyapp.extensions.active': true,
          },
        },
      },
    };

    const { analyzedTokens, analyzedGroups, analyzedCollections } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all).toHaveLength(2);
    expect(analyzedTokens.all[0]).toStrictEqual({
      path: new TreePath(['aColorCollection', 'aColor']),
      definition: expect.any(Object),
      name: 'aColor',
      $type: 'color',
      $value: {
        light: {
          model: 'hex',
          hex: '#ffffff',
          alpha: 1,
        },
        dark: {
          model: 'hex',
          hex: '#000000',
          alpha: 1,
        },
      },
      $description: 'A color',
      $extensions: {
        'com.specifyapp.extensions.active': true,
      },
      isTopLevelAlias: false,
      modes: ['light', 'dark'],
      analyzedValueAliasParts: [],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'light',
          valuePath: new ValuePath(['model']),
          value: 'hex',
        },
        {
          type: 'primitive',
          localMode: 'light',
          valuePath: new ValuePath(['hex']),
          value: '#ffffff',
        },
        {
          type: 'primitive',
          localMode: 'light',
          valuePath: new ValuePath(['alpha']),
          value: 1,
        },
        {
          type: 'primitive',
          localMode: 'dark',
          valuePath: new ValuePath(['model']),
          value: 'hex',
        },
        {
          type: 'primitive',
          localMode: 'dark',
          valuePath: new ValuePath(['hex']),
          value: '#000000',
        },
        {
          type: 'primitive',
          localMode: 'dark',
          valuePath: new ValuePath(['alpha']),
          value: 1,
        },
      ],
      modesResolvability: {
        light: true,
        dark: true,
      },
      isFullyResolvable: true,
    });
    expect(analyzedTokens.all[1]).toStrictEqual({
      path: new TreePath(['aGroup', 'aDimensionInGroup']),
      definition: expect.any(Object),
      name: 'aDimensionInGroup',
      $type: 'dimension',
      $value: {
        base: {
          value: 8,
          unit: 'px',
        },
        large: {
          value: 16,
          unit: 'px',
        },
      },
      $description: 'A dimension',
      $extensions: {
        'com.specifyapp.extensions.active': true,
      },
      isTopLevelAlias: false,
      modes: ['base', 'large'],
      analyzedValueAliasParts: [],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'base',
          valuePath: new ValuePath(['value']),
          value: 8,
        },
        {
          type: 'primitive',
          localMode: 'base',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'large',
          valuePath: new ValuePath(['value']),
          value: 16,
        },
        {
          type: 'primitive',
          localMode: 'large',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
      ],
      modesResolvability: {
        base: true,
        large: true,
      },
      isFullyResolvable: true,
    });

    expect(analyzedGroups.all).toHaveLength(1);
    expect(analyzedGroups.all[0]).toStrictEqual({
      path: new TreePath(['aGroup']),
      name: 'aGroup',
      $description: 'A group',
      $extensions: {
        'com.specifyapp.extensions.active': true,
      },
    });
    expect(analyzedCollections.all).toHaveLength(1);
    expect(analyzedCollections.all[0]).toStrictEqual({
      path: new TreePath(['aColorCollection']),
      name: 'aColorCollection',
      $description: 'A collection of colors',
      $extensions: {
        'com.specifyapp.extensions.color': '1.0.0',
      },
      $collection: {
        $modes: ['light', 'dark'],
      },
      allowedModes: ['light', 'dark'],
    });
  });
  it('should analyze a token tree with resolvable alias types', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aNumber: { $type: 'number', $value: { base: 10 } },
      aRawDimension: {
        $type: 'dimension',
        $value: {
          base: { unit: 'px', value: 8 },
          large: { unit: 'px', value: 16 },
        },
      },
      aTopLevelAliasedDimension: {
        $type: 'dimension',
        $value: {
          $alias: 'aRawDimension',
        },
      },
      aModeAliasedDimension: {
        $type: 'dimension',
        $value: {
          customMode: {
            $alias: 'aRawDimension',
            $mode: 'large',
          },
        },
      },
      aValueAliasedDimension: {
        $type: 'dimension',
        $value: {
          default: {
            unit: 'px',
            value: { $alias: 'aNumber', $mode: 'base' },
          },
        },
      },
      aShadows: {
        $type: 'shadows',
        $value: {
          brand: [
            {
              offsetX: { $alias: 'aValueAliasedDimension', $mode: 'default' },
              offsetY: { unit: 'px', value: 4 },
              blurRadius: { unit: 'px', value: 8 },
              spreadRadius: { unit: 'px', value: 0 },
              color: { model: 'rgb', red: 0, green: 0, blue: 0, alpha: 0.2 },
              type: 'outer',
            },
            {
              offsetX: { unit: 'px', value: 0 },
              offsetY: { $alias: 'aModeAliasedDimension', $mode: 'customMode' },
              blurRadius: { unit: 'px', value: 8 },
              spreadRadius: { unit: 'px', value: 0 },
              color: { model: 'rgb', red: 0, green: 0, blue: 0, alpha: 0.2 },
              type: 'outer',
            },
          ],
        },
      },
      anAliasOfTopLevelAlias: {
        $type: 'dimension',
        $value: {
          $alias: 'aTopLevelAliasedDimension',
        },
      },
    };

    const { analyzedTokens } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all).toHaveLength(7);

    expect(analyzedTokens.all[0]).toStrictEqual({
      path: new TreePath(['aNumber']),
      definition: expect.any(Object),
      name: 'aNumber',
      $description: undefined,
      $extensions: undefined,
      $type: 'number',
      $value: {
        base: 10,
      },
      isTopLevelAlias: false,
      modes: ['base'],
      analyzedValueAliasParts: [],
      analyzedValuePrimitiveParts: [
        { type: 'primitive', localMode: 'base', valuePath: new ValuePath([]), value: 10 },
      ],
      modesResolvability: { base: true },
      isFullyResolvable: true,
    });
    expect(analyzedTokens.all[1]).toStrictEqual({
      path: new TreePath(['aRawDimension']),
      definition: expect.any(Object),
      name: 'aRawDimension',
      $description: undefined,
      $extensions: undefined,
      $type: 'dimension',
      $value: {
        base: { value: 8, unit: 'px' },
        large: { value: 16, unit: 'px' },
      },
      isTopLevelAlias: false,
      modes: ['base', 'large'],
      analyzedValueAliasParts: [],
      analyzedValuePrimitiveParts: [
        { type: 'primitive', localMode: 'base', valuePath: new ValuePath(['value']), value: 8 },
        { type: 'primitive', localMode: 'base', valuePath: new ValuePath(['unit']), value: 'px' },
        { type: 'primitive', localMode: 'large', valuePath: new ValuePath(['value']), value: 16 },
        { type: 'primitive', localMode: 'large', valuePath: new ValuePath(['unit']), value: 'px' },
      ],
      modesResolvability: {
        base: true,
        large: true,
      },
      isFullyResolvable: true,
    });
    expect(analyzedTokens.all[2]).toStrictEqual({
      path: new TreePath(['aTopLevelAliasedDimension']),
      definition: expect.any(Object),
      name: 'aTopLevelAliasedDimension',
      $description: undefined,
      $extensions: undefined,
      $type: 'dimension',
      $value: {
        $alias: 'aRawDimension',
      },
      isTopLevelAlias: true,
      modes: null,
      analyzedValueAliasParts: [
        {
          type: 'topLevelAlias',
          alias: { path: new TreePath(['aRawDimension']) },
          isResolvable: true,
        },
      ],
      analyzedValuePrimitiveParts: [],
      modesResolvability: { base: true, large: true },
      isFullyResolvable: true,
      computedModes: ['base', 'large'],
    });
    expect(analyzedTokens.all[3]).toStrictEqual({
      path: new TreePath(['aModeAliasedDimension']),
      definition: expect.any(Object),

      name: 'aModeAliasedDimension',
      $description: undefined,
      $extensions: undefined,
      $type: 'dimension',
      $value: {
        customMode: {
          $alias: 'aRawDimension',
          $mode: 'large',
        },
      },
      isTopLevelAlias: false,
      modes: ['customMode'],
      analyzedValueAliasParts: [
        {
          type: 'modeLevelAlias',
          localMode: 'customMode',
          alias: {
            path: new TreePath(['aRawDimension']),

            targetMode: 'large',
          },
          isResolvable: true,
        },
      ],
      analyzedValuePrimitiveParts: [],
      modesResolvability: {
        customMode: true,
      },
      isFullyResolvable: true,
    });
    expect(analyzedTokens.all[4]).toStrictEqual({
      path: new TreePath(['aValueAliasedDimension']),
      definition: expect.any(Object),

      name: 'aValueAliasedDimension',
      $description: undefined,
      $extensions: undefined,
      $type: 'dimension',
      $value: {
        default: {
          value: {
            $alias: 'aNumber',
            $mode: 'base',
          },
          unit: 'px',
        },
      },
      isTopLevelAlias: false,
      modes: ['default'],
      analyzedValueAliasParts: [
        {
          type: 'valueLevelAlias',
          localMode: 'default',
          valuePath: new ValuePath(['value']),
          alias: {
            path: new TreePath(['aNumber']),

            targetMode: 'base',
          },
          isResolvable: true,
        },
      ],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
      ],
      modesResolvability: {
        default: true,
      },
      isFullyResolvable: true,
    });
    expect(analyzedTokens.all[5]).toStrictEqual({
      path: new TreePath(['aShadows']),
      definition: expect.any(Object),

      name: 'aShadows',
      $description: undefined,
      $extensions: undefined,
      $type: 'shadows',
      $value: {
        brand: [
          {
            color: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0.2,
            },
            offsetX: {
              $alias: 'aValueAliasedDimension',
              $mode: 'default',
            },
            offsetY: {
              value: 4,
              unit: 'px',
            },
            blurRadius: {
              value: 8,
              unit: 'px',
            },
            spreadRadius: {
              value: 0,
              unit: 'px',
            },
            type: 'outer',
          },
          {
            color: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0.2,
            },
            offsetX: {
              value: 0,
              unit: 'px',
            },
            offsetY: {
              $alias: 'aModeAliasedDimension',
              $mode: 'customMode',
            },
            blurRadius: {
              value: 8,
              unit: 'px',
            },
            spreadRadius: {
              value: 0,
              unit: 'px',
            },
            type: 'outer',
          },
        ],
      },
      isTopLevelAlias: false,
      modes: ['brand'],
      analyzedValueAliasParts: [
        {
          type: 'valueLevelAlias',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'offsetX']),
          alias: {
            path: new TreePath(['aValueAliasedDimension']),

            targetMode: 'default',
          },
          isResolvable: true,
        },
        {
          type: 'valueLevelAlias',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'offsetY']),
          alias: {
            path: new TreePath(['aModeAliasedDimension']),

            targetMode: 'customMode',
          },
          isResolvable: true,
        },
      ],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'color', 'model']),
          value: 'rgb',
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'color', 'red']),
          value: 0,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'color', 'green']),
          value: 0,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'color', 'blue']),
          value: 0,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'color', 'alpha']),
          value: 0.2,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'offsetY', 'value']),
          value: 4,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'offsetY', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'blurRadius', 'value']),
          value: 8,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'blurRadius', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'spreadRadius', 'value']),
          value: 0,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'spreadRadius', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([0, 'type']),
          value: 'outer',
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'color', 'model']),
          value: 'rgb',
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'color', 'red']),
          value: 0,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'color', 'green']),
          value: 0,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'color', 'blue']),
          value: 0,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'color', 'alpha']),
          value: 0.2,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'offsetX', 'value']),
          value: 0,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'offsetX', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'blurRadius', 'value']),
          value: 8,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'blurRadius', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'spreadRadius', 'value']),
          value: 0,
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'spreadRadius', 'unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'brand',
          valuePath: new ValuePath([1, 'type']),
          value: 'outer',
        },
      ],
      modesResolvability: {
        brand: true,
      },
      isFullyResolvable: true,
    });
    expect(analyzedTokens.all[6]).toStrictEqual({
      path: new TreePath(['anAliasOfTopLevelAlias']),
      definition: expect.any(Object),

      name: 'anAliasOfTopLevelAlias',
      $description: undefined,
      $extensions: undefined,
      $type: 'dimension',
      $value: {
        $alias: 'aTopLevelAliasedDimension',
      },
      isTopLevelAlias: true,
      modes: null,
      analyzedValueAliasParts: [
        {
          type: 'topLevelAlias',
          alias: {
            path: new TreePath(['aTopLevelAliasedDimension']),
          },
          isResolvable: true,
        },
      ],
      analyzedValuePrimitiveParts: [],
      modesResolvability: {
        base: true,
        large: true,
      },
      isFullyResolvable: true,
      computedModes: ['base', 'large'],
    });
  });
  it('should analyze a token tree with an unresolvable top level alias', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      topLevelAlias: {
        $type: 'number',
        $value: {
          $alias: 'unknown.token',
        },
      },
    };

    const { analyzedTokens } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all).toHaveLength(1);
    expect(analyzedTokens.all[0]).toStrictEqual({
      path: new TreePath(['topLevelAlias']),

      definition: expect.any(Object),
      name: 'topLevelAlias',
      $type: 'number',
      $value: {
        $alias: 'unknown.token',
      },
      $description: undefined,
      $extensions: undefined,
      isTopLevelAlias: true,
      modes: null,
      analyzedValueAliasParts: [
        {
          type: 'topLevelAlias',
          alias: {
            path: new TreePath(['unknown', 'token']),
          },
          isResolvable: false,
        },
      ],
      analyzedValuePrimitiveParts: [],
      modesResolvability: {},
      isFullyResolvable: false,
    });
  });
  it('should analyze a token tree with an unresolvable mode level alias', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      modeLevelAlias: {
        $type: 'number',
        $value: {
          raw: 10,
          unresolvable: {
            $alias: 'unknown.token',
            $mode: 'base',
          },
        },
      },
    };

    const { analyzedTokens } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all).toHaveLength(1);
    expect(analyzedTokens.all[0]).toStrictEqual({
      path: new TreePath(['modeLevelAlias']),

      name: 'modeLevelAlias',
      $type: 'number',
      $value: {
        raw: 10,
        unresolvable: {
          $alias: 'unknown.token',
          $mode: 'base',
        },
      },
      $extensions: undefined,
      $description: undefined,
      isTopLevelAlias: false,
      definition: expect.any(Object),
      modes: ['unresolvable', 'raw'],
      analyzedValueAliasParts: [
        {
          type: 'modeLevelAlias',
          localMode: 'unresolvable',
          alias: {
            path: new TreePath(['unknown', 'token']),

            targetMode: 'base',
          },
          isResolvable: false,
        },
      ],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'raw',
          valuePath: new ValuePath([]),
          value: 10,
        },
      ],
      modesResolvability: {
        raw: true,
        unresolvable: false,
      },
      isFullyResolvable: false,
    });
  });
  it('should analyze a token tree with a resolvable mode level alias with invalid mode', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aNumber: {
        $type: 'number',
        $value: {
          base: 10,
        },
      },
      modeLevelAlias: {
        $type: 'number',
        $value: {
          raw: 10,
          unresolvable: {
            $alias: 'aNumber',
            $mode: 'unknown mode',
          },
        },
      },
    };

    const { analyzedTokens } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all).toHaveLength(2);
    expect(analyzedTokens.all[0]).toStrictEqual({
      path: new TreePath(['aNumber']),

      definition: expect.any(Object),
      name: 'aNumber',
      $type: 'number',
      $value: {
        base: 10,
      },
      $description: undefined,
      $extensions: undefined,
      isTopLevelAlias: false,
      modes: ['base'],
      analyzedValueAliasParts: [],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'base',
          valuePath: new ValuePath([]),
          value: 10,
        },
      ],
      modesResolvability: {
        base: true,
      },
      isFullyResolvable: true,
    });
    expect(analyzedTokens.all[1]).toStrictEqual({
      path: new TreePath(['modeLevelAlias']),

      definition: expect.any(Object),
      name: 'modeLevelAlias',
      $type: 'number',
      $value: {
        raw: 10,
        unresolvable: {
          $alias: 'aNumber',
          $mode: 'unknown mode',
        },
      },
      $description: undefined,
      $extensions: undefined,
      isTopLevelAlias: false,
      modes: ['unresolvable', 'raw'],
      analyzedValueAliasParts: [
        {
          type: 'modeLevelAlias',
          localMode: 'unresolvable',
          alias: {
            path: new TreePath(['aNumber']),

            targetMode: 'unknown mode',
          },
          isResolvable: false,
        },
      ],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'raw',
          valuePath: new ValuePath([]),
          value: 10,
        },
      ],
      modesResolvability: {
        raw: true,
        unresolvable: false,
      },
      isFullyResolvable: false,
    });
  });
  it('should analyze a token tree with an unresolvable value level alias', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      valueLevelAlias: {
        $type: 'dimension',
        $value: {
          raw: { unit: 'px', value: 8 },
          unresolvable: {
            unit: 'px',
            value: { $alias: 'unknown.token', $mode: 'base' },
          },
        },
      },
    };

    const { analyzedTokens } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all).toHaveLength(1);
    expect(analyzedTokens.all[0]).toStrictEqual({
      path: new TreePath(['valueLevelAlias']),

      name: 'valueLevelAlias',
      $type: 'dimension',
      $value: {
        raw: {
          value: 8,
          unit: 'px',
        },
        unresolvable: {
          value: {
            $alias: 'unknown.token',
            $mode: 'base',
          },
          unit: 'px',
        },
      },
      $extensions: undefined,
      $description: undefined,
      isTopLevelAlias: false,
      definition: expect.any(Object),
      modes: ['unresolvable', 'raw'],
      analyzedValueAliasParts: [
        {
          type: 'valueLevelAlias',
          localMode: 'unresolvable',
          valuePath: new ValuePath(['value']),
          alias: {
            path: new TreePath(['unknown', 'token']),

            targetMode: 'base',
          },
          isResolvable: false,
        },
      ],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'raw',
          valuePath: new ValuePath(['value']),
          value: 8,
        },
        {
          type: 'primitive',
          localMode: 'raw',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'unresolvable',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
      ],
      modesResolvability: {
        raw: true,
        unresolvable: false,
      },
      isFullyResolvable: false,
    });
  });
  it('should analyze a token tree with chained unresolvable aliases', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      toUnresolvableModeLevelAlias: {
        $type: 'number',
        $value: {
          base: { $alias: 'toUnresolvableTopLevelAlias', $mode: 'default' },
        },
      },
      aSourceDimension: {
        $type: 'dimension',
        $value: {
          raw: { unit: 'px', value: 8 },
          aliased: { unit: 'px', value: { $alias: 'toUnresolvableModeLevelAlias', $mode: 'base' } },
        },
      },
      aRefDimensionOnMode: {
        $type: 'dimension',
        $value: {
          base: { $alias: 'aSourceDimension', $mode: 'aliased' },
        },
      },
      aRefDimensionOnTopLevel: {
        $type: 'dimension',
        $value: {
          $alias: 'aSourceDimension',
        },
      },
    };

    const { analyzedTokens } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all).toHaveLength(4);
    expect(analyzedTokens.all[0]).toStrictEqual({
      path: new TreePath(['toUnresolvableModeLevelAlias']),

      definition: expect.any(Object),
      name: 'toUnresolvableModeLevelAlias',
      $type: 'number',
      $value: {
        base: {
          $alias: 'toUnresolvableTopLevelAlias',
          $mode: 'default',
        },
      },
      $description: undefined,
      $extensions: undefined,
      isTopLevelAlias: false,
      modes: ['base'],
      analyzedValueAliasParts: [
        {
          type: 'modeLevelAlias',
          localMode: 'base',
          alias: {
            path: new TreePath(['toUnresolvableTopLevelAlias']),

            targetMode: 'default',
          },
          isResolvable: false,
        },
      ],
      analyzedValuePrimitiveParts: [],
      modesResolvability: {
        base: false,
      },
      isFullyResolvable: false,
    });
    expect(analyzedTokens.all[1]).toStrictEqual({
      path: new TreePath(['aSourceDimension']),

      definition: expect.any(Object),
      name: 'aSourceDimension',
      $type: 'dimension',
      $value: {
        raw: {
          value: 8,
          unit: 'px',
        },
        aliased: {
          value: {
            $alias: 'toUnresolvableModeLevelAlias',
            $mode: 'base',
          },
          unit: 'px',
        },
      },
      $description: undefined,
      $extensions: undefined,
      isTopLevelAlias: false,
      modes: ['aliased', 'raw'],
      analyzedValueAliasParts: [
        {
          type: 'valueLevelAlias',
          localMode: 'aliased',
          valuePath: new ValuePath(['value']),
          alias: {
            path: new TreePath(['toUnresolvableModeLevelAlias']),

            targetMode: 'base',
          },
          isResolvable: true,
        },
      ],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'raw',
          valuePath: new ValuePath(['value']),
          value: 8,
        },
        {
          type: 'primitive',
          localMode: 'raw',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
        {
          type: 'primitive',
          localMode: 'aliased',
          valuePath: new ValuePath(['unit']),
          value: 'px',
        },
      ],
      modesResolvability: {
        raw: true,
        aliased: false,
      },
      isFullyResolvable: false,
    });
    expect(analyzedTokens.all[2]).toStrictEqual({
      path: new TreePath(['aRefDimensionOnMode']),

      definition: expect.any(Object),
      name: 'aRefDimensionOnMode',
      $type: 'dimension',
      $value: {
        base: {
          $alias: 'aSourceDimension',
          $mode: 'aliased',
        },
      },
      $description: undefined,
      $extensions: undefined,
      isTopLevelAlias: false,
      modes: ['base'],
      analyzedValueAliasParts: [
        {
          type: 'modeLevelAlias',
          localMode: 'base',
          alias: {
            path: new TreePath(['aSourceDimension']),

            targetMode: 'aliased',
          },
          isResolvable: true,
        },
      ],
      analyzedValuePrimitiveParts: [],
      modesResolvability: {
        base: false,
      },
      isFullyResolvable: false,
    });
  });
  it('should analyze a resolvable mode level alias pointing to an unresolvable top level alias', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      toUnresolvableTopLevelAlias: {
        $type: 'number',
        $value: {
          $alias: 'unknown.token',
        },
      },
      toUnresolvableModeLevelAlias: {
        $type: 'number',
        $value: {
          base: { $alias: 'toUnresolvableTopLevelAlias', $mode: 'default' },
        },
      },
    };

    const { analyzedTokens } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all).toHaveLength(2);
    expect(analyzedTokens.all[0]).toStrictEqual({
      path: new TreePath(['toUnresolvableTopLevelAlias']),

      name: 'toUnresolvableTopLevelAlias',
      $type: 'number',
      $value: {
        $alias: 'unknown.token',
      },
      definition: expect.any(Object),
      $description: undefined,
      $extensions: undefined,
      isTopLevelAlias: true,
      modes: null,
      analyzedValueAliasParts: [
        {
          type: 'topLevelAlias',
          alias: {
            path: new TreePath(['unknown', 'token']),
          },
          isResolvable: false,
        },
      ],
      analyzedValuePrimitiveParts: [],
      modesResolvability: {},
      isFullyResolvable: false,
    });
    expect(analyzedTokens.all[1]).toStrictEqual({
      path: new TreePath(['toUnresolvableModeLevelAlias']),

      name: 'toUnresolvableModeLevelAlias',
      $type: 'number',
      $value: {
        base: {
          $alias: 'toUnresolvableTopLevelAlias',
          $mode: 'default',
        },
      },
      definition: expect.any(Object),
      $description: undefined,
      $extensions: undefined,
      isTopLevelAlias: false,
      modes: ['base'],
      analyzedValueAliasParts: [
        {
          type: 'modeLevelAlias',
          localMode: 'base',
          alias: {
            path: new TreePath(['toUnresolvableTopLevelAlias']),

            targetMode: 'default',
          },
          isResolvable: false,
        },
      ],
      analyzedValuePrimitiveParts: [],
      modesResolvability: {
        base: false,
      },
      isFullyResolvable: false,
    });
  });

  it('should fail if the token tree is not an object', () => {
    expect(() => analyzeTokenTree(null)).toThrow(
      'Validation error (invalid_type): tokenTree root node must be a JSON object.',
    );
    expect(() => analyzeTokenTree('dope')).toThrow(
      'Failed to parse tokenTree from JSON string input.',
    );
  });
  it('should fail if a collection properties is invalid', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aCollection: {
        $collection: {
          // @ts-expect-error
          $description: 10,
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Validation error (invalid_type) at path "aCollection.$collection.$modes": Required, (unrecognized_keys) at path "aCollection.$collection": Unrecognized key(s) in object: \'$description\'',
    );
  });
  it('should fail if token properties are invalid', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aToken: {
        $type: 'color',
        // @ts-expect-error
        $description: 10,
        // @ts-expect-error
        $value: 10,
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Validation error (invalid_type) at path "aToken.$description": Expected string, received number',
    );
  });

  // Aliasing type checks
  it('should fail when a top level alias points to a non valid pairing type', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aNumber: { $type: 'number', $value: { base: 10 } },
      aTopLevelAliasedDimension: {
        $type: 'dimension',
        $value: {
          $alias: 'aNumber',
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Alias "aNumber" on token "aTopLevelAliasedDimension" is of type "number" but should be of type "dimension',
    );
  });
  it('should fail when a mode level alias points to a non valid pairing type', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aNumber: { $type: 'number', $value: { base: 10 } },
      aModeAliasedDimension: {
        $type: 'dimension',
        $value: {
          customMode: {
            $alias: 'aNumber',
            $mode: 'base',
          },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Alias "aNumber" on token "aModeAliasedDimension" is of type "number" but should be of type "dimension',
    );
  });
  it('should fail when a value level alias points to a non valid pairing type', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aString: { $type: 'string', $value: { base: '10' } },
      aValueAliasedDimension: {
        $type: 'dimension',
        $value: {
          default: {
            unit: 'px',
            value: { $alias: 'aString', $mode: 'base' },
          },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Alias "aString" on token "aValueAliasedDimension" is of type "string" but should be of type "number',
    );
  });
  it('should fail when a color.red value is pointing to a string type', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aString: { $type: 'string', $value: { base: '10' } },
      aColor: {
        $type: 'color',
        $value: {
          light: {
            model: 'rgb',
            red: { $alias: 'aString', $mode: 'base' },
            green: 0,
            blue: 0,
            alpha: 1,
          },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Alias "aString" on token "aColor" is of type "string" but should be of type "rgbColorNumber',
    );
  });
  it('should fail when a top level alias references itself', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aTopLevelAliasedDimension: {
        $type: 'dimension',
        $value: { $alias: 'aTopLevelAliasedDimension' },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Alias "aTopLevelAliasedDimension" on token "aTopLevelAliasedDimension" is referencing itself.',
    );
  });
  it('should fail when a mode level alias references itself', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aModeAliasedDimension: {
        $type: 'dimension',
        $value: {
          customMode: {
            $alias: 'aModeAliasedDimension',
            $mode: 'customMode',
          },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Alias "aModeAliasedDimension" on token "aModeAliasedDimension" is referencing itself in mode "customMode".',
    );
  });
  it('should fail when a circular dependency exists over 3 tokens', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      first: {
        $type: 'string',
        $value: { default: { $alias: 'third', $mode: 'default' } },
      },
      second: {
        $type: 'string',
        $value: { default: { $alias: 'first', $mode: 'default' } },
      },
      third: {
        $type: 'string',
        $value: { default: { $alias: 'second', $mode: 'default' } },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'A circular alias reference was found in initial token tree.',
    );
  });

  // Alias mode checks
  it('should produce an unresolvable alias when a mode level alias is pointing to an unknown mode in its referenced token', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aRawDimension: {
        $type: 'dimension',
        $value: {
          default: { unit: 'px', value: 8 },
        },
      },
      aModeAliasedDimension: {
        $type: 'dimension',
        $value: {
          customMode: {
            $alias: 'aRawDimension',
            $mode: 'unknown',
          },
        },
      },
    };

    const { analyzedTokens } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all[1].analyzedValueAliasParts[0]).toStrictEqual({
      type: 'modeLevelAlias',
      localMode: 'customMode',
      alias: {
        path: new TreePath(['aRawDimension']),
        targetMode: 'unknown',
      },
      isResolvable: false,
    });
  });
  it('should produce an unresolvable alias when a value level alias is pointing to an unknown mode in its referenced token', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aNumber: { $type: 'number', $value: { base: 10 } },
      aValueAliasedDimension: {
        $type: 'dimension',
        $value: {
          default: {
            unit: 'px',
            value: { $alias: 'aNumber', $mode: 'unknown' },
          },
        },
      },
    };

    const { analyzedTokens } = analyzeTokenTree(tokenTree);

    expect(analyzedTokens.all[1].analyzedValueAliasParts[0]).toStrictEqual({
      type: 'valueLevelAlias',
      localMode: 'default',
      valuePath: new ValuePath(['value']),
      alias: {
        path: new TreePath(['aNumber']),
        targetMode: 'unknown',
      },
      isResolvable: false,
    });
  });
  it('should fail to load a token, top level aliased in a collection further down the token tree', () => {
    const tokens: SpecifyDesignTokenFormat = {
      anotherCollection: {
        $collection: { $modes: ['light', 'dark', 'SUPP'] },
        anotherStringInCollection: {
          $type: 'string',
          $value: { $alias: 'aCollection.aStringInCollection' },
        },
      },
      aCollection: {
        $collection: { $modes: ['light', 'dark'] },
        aStringInCollection: {
          $type: 'string',
          $value: { light: 'a light value', dark: 'a dark value', SUPP: 'invalid value' },
        },
      },
    };

    expect(() => analyzeTokenTree(tokens)).toThrow(
      'Token "aCollection.aStringInCollection" has modes "light, dark, SUPP" but is used in the collection "aCollection" defining modes "light, dark".',
    );
  });

  // Modes check in collections
  it('should fail when a token is missing a mode in a collection', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aCollection: {
        $collection: { $modes: ['light', 'dark'] },
        aColor: {
          $type: 'color',
          $value: {
            light: { model: 'hex', hex: '#ffffff', alpha: 1 },
          },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Token "aCollection.aColor" has modes "light" but is used in the collection "aCollection" defining modes "light, dark".',
    );
  });
  it('should fail when a token has an extra mode in a collection', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aCollection: {
        $collection: { $modes: ['light', 'dark'] },
        aColor: {
          $type: 'color',
          $value: {
            light: { model: 'hex', hex: '#ffffff', alpha: 1 },
            dark: { model: 'hex', hex: '#000000', alpha: 1 },
            extra: { model: 'hex', hex: '#000000', alpha: 1 },
          },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Token "aCollection.aColor" has modes "light, dark, extra" but is used in the collection "aCollection" defining modes "light, dark".',
    );
  });
  it('should fail when a token has unrelated modes in a collection', () => {
    const sameLength: SpecifyDesignTokenFormat = {
      aCollection: {
        $collection: { $modes: ['c1', 'c2'] },
        aColor: {
          $type: 'color',
          $value: {
            t1: { model: 'hex', hex: '#ffffff', alpha: 1 },
            t2: { model: 'hex', hex: '#000000', alpha: 1 },
          },
        },
      },
    };

    expect(() => analyzeTokenTree(sameLength)).toThrow(
      'Token "aCollection.aColor" has modes "t1, t2" but is used in the collection "aCollection" defining modes "c1, c2".',
    );

    const collectionHasMoreModes: SpecifyDesignTokenFormat = {
      aCollection: {
        $collection: { $modes: ['c1', 'c2', 'c3'] },
        aColor: {
          $type: 'color',
          $value: {
            t1: { model: 'hex', hex: '#ffffff', alpha: 1 },
            t2: { model: 'hex', hex: '#000000', alpha: 1 },
          },
        },
      },
    };

    expect(() => analyzeTokenTree(collectionHasMoreModes)).toThrow(
      'Token "aCollection.aColor" has modes "t1, t2" but is used in the collection "aCollection" defining modes "c1, c2, c3".',
    );

    const tokenHasMoreModes: SpecifyDesignTokenFormat = {
      aCollection: {
        $collection: { $modes: ['c1', 'c2'] },
        aColor: {
          $type: 'color',
          $value: {
            t1: { model: 'hex', hex: '#ffffff', alpha: 1 },
            t2: { model: 'hex', hex: '#000000', alpha: 1 },
            t3: { model: 'hex', hex: '#CCCCCC', alpha: 1 },
          },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenHasMoreModes)).toThrow(
      'Token "aCollection.aColor" has modes "t1, t2, t3" but is used in the collection "aCollection" defining modes "c1, c2".',
    );
  });
  it('should fail when a top level aliased token is missing modes resolution in a collection', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aCollection: {
        $collection: { $modes: ['light', 'dark'] },
        aColor: {
          $type: 'color',
          $value: { $alias: 'aTopLevelAliasedColor' },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Modes of token "aCollection.aColor" cannot be computed since it points to an unresolvable token but is used in the collection "aCollection" defining modes "light, dark".',
    );
  });

  it('should fail when nested collections are found', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aCollection: {
        $collection: { $modes: ['light', 'dark'] },
        aNestedCollection: {
          $collection: { $modes: ['small', 'large'] },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Collection "aCollection.aNestedCollection" is nested in collection "aCollection".',
    );
  });
  it('should fail when nested collections in groups are found', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aGroup: {
        aCollection: {
          $collection: { $modes: ['light', 'dark'] },
          aNestedGroup: {
            aNestedCollection: {
              $collection: { $modes: ['small', 'large'] },
            },
          },
        },
      },
    };

    expect(() => analyzeTokenTree(tokenTree)).toThrow(
      'Collection "aGroup.aCollection.aNestedGroup.aNestedCollection" is nested in collection "aGroup.aCollection".',
    );
  });
});
