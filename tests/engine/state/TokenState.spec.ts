import { describe, it, expect, vi } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import {
  PickSpecifyDesignToken,
  ResolvableModeLevelAlias,
  ResolvableTopLevelAlias,
  ResolvableValueLevelAlias,
  SpecifyDesignTokenFormat,
  UnknownModeUIValue,
  UnresolvableTokenState,
  UnresolvableTopLevelAlias,
  createSDTFEngine,
} from '../../../src/index.js';
import {
  SpecifyDimensionValue,
  SpecifyDimensionValueWithAlias,
} from '../../../src/definitions/tokenTypes/dimension.js';
import { SpecifyRadiiValue } from '../../../src/definitions/tokenTypes/radii.js';
import { InnerValue } from '../../../src/engine/state/statefulValue/StatefulValueResult.js';
import {
  UnresolvableModeLevelAlias,
  UnresolvableValueLevelAlias,
} from '../../../src/engine/state/statefulValue/aliasing.js';

import {
  defaultGetJSONTokenValueOptions,
  mergeGetJSONTokenValueOptions,
  TokenState,
} from '../../../src/engine/state/TokenState.js';
import { createTokenStateParams } from '../../_utils/createStateParams.js';
import { Equal, Expect } from '../../_utils.js';
import { ZodError } from 'zod';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('defaultGetJSONTokenValueOptions', () => {
  it('should be the default options', () => {
    expect(defaultGetJSONTokenValueOptions).toEqual({
      resolveAliases: true,
      allowUnresolvable: true,
      targetMode: null,
    });
  });
});

describe.concurrent('mergeGetJSONTokenValueOptions', () => {
  it('should merge empty options', () => {
    const result = mergeGetJSONTokenValueOptions(
      // @ts-expect-error - Testing invalid options
      {},
    );
    expect(result).toEqual(defaultGetJSONTokenValueOptions);
  });
  it('should merge resolveAliases: false', () => {
    const result = mergeGetJSONTokenValueOptions({ resolveAliases: false });
    expect(result).toEqual({ ...defaultGetJSONTokenValueOptions, resolveAliases: false });
  });
  it('should merge resolveAliases: true and other options', () => {
    const result = mergeGetJSONTokenValueOptions({
      resolveAliases: true,
      allowUnresolvable: true,
      targetMode: 'myMode',
    });
    expect(result).toEqual({ resolveAliases: true, allowUnresolvable: true, targetMode: 'myMode' });
  });
});

describe.concurrent('TokenState', () => {
  describe.concurrent('constructor', () => {
    it('should create a string TokenState', () => {
      const treeState = createTreeStateFromTokenTree({});
      const state = new TokenState(
        treeState,
        createTokenStateParams(new TreePath(['foo']), {
          type: 'string',
          $description: 'A string',
          $extensions: { foo: 'bar' },
          primitiveParts: [{ localMode: 'default', value: 'aString' }],
          isFullyResolvable: true,
          isTopLevelAlias: false,
          modesResolvability: [['default', true]],
        }),
      );

      expect(state.name).toBe('foo');
      expect(state.description).toBe('A string');
      expect(state.extensions).toEqual({ foo: 'bar' });
      expect(state.type).toBe('string');
      expect(state.value).toEqual({ default: 'aString' });
      expect(state.modes).toEqual(['default']);
      expect(state.definition.type).toBe('string');
      expect(state.isFullyResolvable).toBe(true);
      expect(state.modesResolvability).toEqual({ default: true });
      expect(state.isTopLevelAlias).toBe(false);
    });
    it('should create a textStyle TokenState', () => {
      const rawTextStyle: PickSpecifyDesignToken<'textStyle'> = {
        $type: 'textStyle',
        $value: {
          default: {
            font: {
              family: 'Inter',
              postScriptName: 'Inter-Regular',
              weight: 400,
              style: 'normal',
              files: [],
            },
            fontSize: {
              value: 12,
              unit: 'pt',
            },
            fontFeatures: null,
            color: null,
            lineHeight: null,
            letterSpacing: null,
            paragraphSpacing: null,
            textAlignHorizontal: null,
            textAlignVertical: null,
            textDecoration: null,
            textIndent: null,
            textTransform: null,
          },
        },
        $description: 'A text style',
        $extensions: { foo: 'bar' },
      };
      const treeState = createTreeStateFromTokenTree({
        aTextStyle: rawTextStyle,
      });

      const tokenState = treeState.getTokenState(new TreePath(['aTextStyle']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.name).toBe('aTextStyle');
      expect(tokenState.description).toBe('A text style');
      expect(tokenState.extensions).toEqual({ foo: 'bar' });
      expect(tokenState.type).toBe('textStyle');
      expect(tokenState.value).toEqual(rawTextStyle.$value);
      expect(tokenState.modes).toEqual(['default']);
      expect(tokenState.definition.type).toBe('textStyle');
      expect(tokenState.isFullyResolvable).toBe(true);
      expect(tokenState.modesResolvability).toEqual({ default: true });
      expect(tokenState.isTopLevelAlias).toBe(false);

      expect(tokenState.getJSONToken()).toStrictEqual(rawTextStyle);
    });
    it('should create a radii TokenState', () => {
      const rawRadii: PickSpecifyDesignToken<'radii'> = {
        $type: 'radii',
        $value: {
          default: [
            { value: 0.5, unit: 'rem' },
            { value: 0.8, unit: 'rem' },
          ],
        },
        $description: 'A radii',
        $extensions: { foo: 'bar' },
      };
      const tokens: SpecifyDesignTokenFormat = {
        aRadii: rawRadii,
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aRadii']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.name).toBe('aRadii');
      expect(tokenState.description).toBe('A radii');
      expect(tokenState.extensions).toEqual({ foo: 'bar' });
      expect(tokenState.type).toBe('radii');
      expect(tokenState.value).toEqual(rawRadii.$value);
      expect(tokenState.modes).toEqual(['default']);
      expect(tokenState.definition.type).toBe('radii');
      expect(tokenState.isFullyResolvable).toBe(true);
      expect(tokenState.modesResolvability).toEqual({ default: true });
      expect(tokenState.isTopLevelAlias).toBe(false);

      expect(tokenState.getJSONToken()).toStrictEqual(rawRadii);
    });
    it('should create an unresolvable top level alias string TokenState', () => {
      const treeState = createTreeStateFromTokenTree({
        foo: {
          $type: 'string',
          $value: { $alias: 'aReference' },
          $description: 'A string',
          $extensions: { foo: 'bar' },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.name).toBe('foo');
      expect(tokenState.description).toBe('A string');
      expect(tokenState.extensions).toEqual({ foo: 'bar' });
      expect(tokenState.type).toBe('string');
      expect(tokenState.value).toEqual({ $alias: 'aReference' });
      expect(tokenState.modes).toEqual([]);
      expect(tokenState.definition.type).toBe('string');
      expect(tokenState.isFullyResolvable).toBe(false);
      expect(tokenState.modesResolvability).toEqual({});
      expect(tokenState.isTopLevelAlias).toBe(true);

      const aliasReferences = treeState.getAliasReferencesFrom({ treePath: new TreePath(['foo']) });

      expect(aliasReferences).toEqual([
        {
          isResolvable: false,
          reason: 'Token "aReference" does not exist',
          from: { treePath: new TreePath(['foo']), valuePath: new ValuePath([]), mode: null },
          to: { treePath: new TreePath(['aReference']), mode: null },
        },
      ]);
    });
    it('should create an unresolvable mode level alias string TokenState', () => {
      const treeState = createTreeStateFromTokenTree({
        foo: {
          $type: 'string',
          $value: { myMode: { $alias: 'aReference', $mode: 'default' } },
          $description: 'A string',
          $extensions: { foo: 'bar' },
        },
      });
      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.name).toBe('foo');
      expect(tokenState.description).toBe('A string');
      expect(tokenState.extensions).toEqual({ foo: 'bar' });
      expect(tokenState.type).toBe('string');
      expect(tokenState.value).toEqual({
        myMode: {
          $alias: 'aReference',
          $mode: 'default',
        },
      });
      expect(tokenState.modes).toEqual(['myMode']);
      expect(tokenState.definition.type).toBe('string');
      expect(tokenState.isFullyResolvable).toBe(false);
      expect(tokenState.modesResolvability).toEqual({ myMode: false });
      expect(tokenState.isTopLevelAlias).toBe(false);

      const aliasReferences = treeState.getAliasReferencesFrom({ treePath: new TreePath(['foo']) });

      expect(aliasReferences).toEqual([
        {
          isResolvable: false,
          reason: 'Token "aReference" does not exist',
          from: { treePath: new TreePath(['foo']), valuePath: new ValuePath([]), mode: 'myMode' },
          to: { treePath: new TreePath(['aReference']), mode: 'default' },
        },
      ]);
    });
    it('should create a resolvable top level alias string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aReference: { $type: 'string', $value: { default: 'aString' } },
        foo: {
          $type: 'string',
          $value: { $alias: 'aReference' },
          $description: 'A string',
          $extensions: { foo: 'bar' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.name).toBe('foo');
      expect(tokenState.description).toBe('A string');
      expect(tokenState.extensions).toEqual({ foo: 'bar' });
      expect(tokenState.type).toBe('string');
      expect(tokenState.value).toEqual({ $alias: 'aReference' });
      expect(tokenState.modes).toEqual(['default']);
      expect(tokenState.definition.type).toBe('string');
      expect(tokenState.isFullyResolvable).toBe(true);
      expect(tokenState.modesResolvability).toEqual({ default: true });
      expect(tokenState.isTopLevelAlias).toBe(true);

      const aliasReferences = treeState.getAliasReferencesFrom({ treePath: new TreePath(['foo']) });

      expect(aliasReferences).toEqual([
        {
          isResolvable: true,
          from: { treePath: new TreePath(['foo']), valuePath: new ValuePath([]), mode: null },
          to: { treePath: new TreePath(['aReference']), mode: null },
        },
      ]);
    });
    it('should create a resolvable mode level alias string TokenState on default mode', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aReference: { $type: 'string', $value: { default: 'aString' } },
        foo: {
          $type: 'string',
          $value: { myMode: { $alias: 'aReference', $mode: 'default' } },
          $description: 'A string',
          $extensions: { foo: 'bar' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.type).toBe('string');
      expect(tokenState.value).toEqual({
        myMode: { $alias: 'aReference', $mode: 'default' },
      });
      expect(tokenState.modes).toEqual(['myMode']);
      expect(tokenState.isFullyResolvable).toBe(true);
      expect(tokenState.modesResolvability).toEqual({ myMode: true });
      expect(tokenState.isTopLevelAlias).toBe(false);

      const aliasReferences = treeState.getAliasReferencesFrom({
        treePath: tokenState.path,
      });

      expect(aliasReferences).toEqual([
        {
          isResolvable: true,
          from: { treePath: new TreePath(['foo']), valuePath: new ValuePath([]), mode: 'myMode' },
          to: { treePath: new TreePath(['aReference']), mode: 'default' },
        },
      ]);
    });
    it('should create a resolvable mode level alias string TokenState on a custom mode', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aReference: { $type: 'string', $value: { customMode: 'aString' } },
        foo: {
          $type: 'string',
          $value: { myMode: { $alias: 'aReference', $mode: 'customMode' } },
          $description: 'A string',
          $extensions: { foo: 'bar' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.type).toBe('string');
      expect(tokenState.value).toEqual({
        myMode: { $alias: 'aReference', $mode: 'customMode' },
      });
      expect(tokenState.modes).toEqual(['myMode']);
      expect(tokenState.isFullyResolvable).toBe(true);
      expect(tokenState.modesResolvability).toEqual({ myMode: true });
      expect(tokenState.isTopLevelAlias).toBe(false);

      const aliasReferences = treeState.getAliasReferencesFrom({
        treePath: tokenState.path,
      });

      expect(aliasReferences).toEqual([
        {
          isResolvable: true,
          from: { treePath: new TreePath(['foo']), valuePath: new ValuePath([]), mode: 'myMode' },
          to: { treePath: new TreePath(['aReference']), mode: 'customMode' },
        },
      ]);
    });

    it('should fail to assign a state private properties', () => {
      const treeState = createTreeStateFromTokenTree({
        foo: { $type: 'string', $value: { default: 'aString' } },
      });

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        // @ts-expect-error - Private property
        tokenState.type = 'bar';
      }).toThrow('Cannot set property type of #<TokenState> which has only a getter');
      expect(() => {
        // @ts-expect-error - Private property
        tokenState.value = 'bar';
      }).toThrow('Cannot set property value of #<TokenState> which has only a getter');
      expect(() => {
        // @ts-expect-error - Private property
        tokenState.definition = 'bar';
      }).toThrow('Cannot set property definition of #<TokenState> which has only a getter');
    });
  });
  describe.concurrent('get value', () => {
    it('should access the value property of a primitive type (string)', () => {
      const $value = { default: 'a string' };

      const treeState = createTreeStateFromTokenTree({
        localToken: {
          $type: 'string',
          $value,
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['localToken']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.value).toStrictEqual($value);
    });
    it('should access the value property of an object type (dimension)', () => {
      const $value: { [m: string]: SpecifyDimensionValue } = {
        default: {
          value: 12,
          unit: 'px',
        },
      };
      const treeState = createTreeStateFromTokenTree({
        localToken: {
          $type: 'dimension',
          $value,
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['localToken']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.value).toStrictEqual($value);
    });
    it('should access the value property of an array type (radii)', () => {
      const $value: { [m: string]: SpecifyRadiiValue } = {
        default: [
          {
            value: 12,
            unit: 'px',
          },
          {
            value: 12,
            unit: 'px',
          },
        ],
      };
      const treeState = createTreeStateFromTokenTree({
        localToken: {
          $type: 'radii',
          $value,
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['localToken']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.value).toStrictEqual($value);
    });
    it('should access value property of a top level alias', () => {
      const $value = { $alias: 'aString' };
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'a string' } },
        localToken: { $type: 'string', $value },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['localToken']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.value).toStrictEqual($value);
    });
    it('should access value property of a mode level alias', () => {
      const $value = { myMode: { $alias: 'aString', $mode: 'default' } };
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'a string' } },
        localToken: { $type: 'string', $value },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['localToken']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.value).toStrictEqual($value);
    });
    it('should access value property of a value level alias', () => {
      const $value: { [m: string]: SpecifyDimensionValueWithAlias } = {
        default: {
          unit: 'px',
          value: { $alias: 'aNumber', $mode: 'default' },
        },
      };
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: { $type: 'number', $value: { default: 12 } },
        localToken: { $type: 'dimension', $value },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['localToken']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.value).toStrictEqual($value);
    });

    it('should access the updated value property after the top level referenced token has been renamed', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'a string' } },
        topLevelAlias: { $type: 'string', $value: { $alias: 'aString' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTopLevelAlias = treeState.getTokenState(new TreePath(['topLevelAlias']));
      if (!maybeTopLevelAlias) throw new Error('Token state is unresolvable');

      const maybeAStringTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeAStringTokenState) {
        throw new Error('Token state is unresolvable');
      }

      maybeAStringTokenState.rename('aRenamedString');

      expect(maybeTopLevelAlias.value).toEqual({ $alias: 'aRenamedString' });
    });
    it('should access the updated value property after the mode level referenced token has been renamed', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'a string' } },
        modeLevelAlias: {
          $type: 'string',
          $value: { myMode: { $alias: 'aString', $mode: 'default' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeModeLevelAlias = treeState.getTokenState(new TreePath(['modeLevelAlias']));
      if (!maybeModeLevelAlias) throw new Error('Token state is unresolvable');

      const maybeAStringTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeAStringTokenState) {
        throw new Error('Token state is unresolvable');
      }

      maybeAStringTokenState.rename('aRenamedString');

      expect(maybeModeLevelAlias.value).toEqual({
        myMode: { $alias: 'aRenamedString', $mode: 'default' },
      });
    });
  });
  describe.concurrent('get modes', () => {
    it('should resolve string token modes', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { one: 'one', two: 'two' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.modes).toStrictEqual(['one', 'two']);
    });
    it('should resolve a top level alias of alias string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aStringWithModes: {
          $type: 'string',
          $value: { default: 'a string', alt: 'another string' },
        },
        anotherReference: { $type: 'string', $value: { $alias: 'aStringWithModes' } },
        aString: { $type: 'string', $value: { $alias: 'anotherReference' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.modes).toStrictEqual(['alt', 'default']);
    });
    it('should resolve the modes from mode level alias and raw value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: { $type: 'number', $value: { small: 4, medium: 8 } },
        anotherNumber: {
          $type: 'number',
          $value: {
            small: { $alias: 'aNumber', $mode: 'small' },
            medium: { $alias: 'aNumber', $mode: 'medium' },
            large: 12,
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['anotherNumber']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.modes).toStrictEqual(['large', 'medium', 'small']);
    });
    it('should return an empty array when the top level alias is unresolvable', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { $alias: 'unresolvable.alias' } },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.modes).toStrictEqual([]);
    });
  });
  describe.concurrent('get definition', () => {
    it('should return the definition of the given token type', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { default: 'a string' } },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.definition.type).toBe('string');
    });
  });
  describe.concurrent('getCollection', () => {
    it('should return a collection when the tokenState is into one', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'large'] },
          aDimension: {
            $type: 'dimension',
            $value: {
              small: {
                unit: 'px',
                value: 12,
              },
              large: {
                unit: 'px',
                value: 24,
              },
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aCollection', 'aDimension']));

      if (!tokenState) throw new Error('Expected success');

      expect((tokenState.getCollection() as any).name).toEqual('aCollection');
    });
    it('should return a undefined when the tokenState is not into a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'large'] },
        },
        aDimension: {
          $type: 'dimension',
          $value: {
            small: {
              unit: 'px',
              value: 12,
            },
            large: {
              unit: 'px',
              value: 24,
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aDimension']));

      if (!tokenState) throw new Error('Expected success');

      expect(tokenState.getCollection()).toBeUndefined();
    });
  });
  describe.concurrent('getModes', () => {
    it('should resolve string token modes', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { one: 'one', two: 'two' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getModes()).toStrictEqual(['one', 'two']);
    });
    it('should resolve a top level alias of alias string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aStringWithModes: {
          $type: 'string',
          $value: { default: 'a string', alt: 'another string' },
        },
        anotherReference: { $type: 'string', $value: { $alias: 'aStringWithModes' } },
        aString: { $type: 'string', $value: { $alias: 'anotherReference' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getModes()).toStrictEqual(['alt', 'default']);
    });
    it('should resolve the modes from mode level alias and raw value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: { $type: 'number', $value: { small: 4, medium: 8 } },
        anotherNumber: {
          $type: 'number',
          $value: {
            small: { $alias: 'aNumber', $mode: 'small' },
            medium: { $alias: 'aNumber', $mode: 'medium' },
            large: 12,
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['anotherNumber']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getModes()).toStrictEqual(['large', 'medium', 'small']);
    });
    it('should return an empty array when the top level alias is unresolvable', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: { $type: 'string', $value: { $alias: 'unresolvable.alias' } },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getModes()).toStrictEqual([]);
    });
  });

  describe.concurrent('getStatefulValueResult', () => {
    it('should expose a resolvableTopLevelAlias for a resolvable top level alias value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: 12,
            },
          },
        },
        foo: {
          $type: 'dimension',
          $value: { $alias: 'aDimension' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = tokenState.getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(true);
      expect(statefulValueResult.isTopLevelValue).toBe(false);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(resolvableTopLevelAlias => {
          return resolvableTopLevelAlias.tokenState.path.toString();
        })
        .mapUnresolvableTopLevelAlias(_ => {
          return neverCalledCallback();
        })
        .mapTopLevelValue(_ => {
          return neverCalledCallback();
        })
        .unwrap();

      expect(result).toBe('aDimension');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a unresolvableTopLevelAlias for an unresolvable top level alias value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: { $type: 'dimension', $value: { $alias: 'aDimension' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = tokenState.getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(true);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(false);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(_ => {
          return neverCalledCallback();
        })
        .mapUnresolvableTopLevelAlias(unresolvableTopLevelAlias => {
          return unresolvableTopLevelAlias.targetPath.toString();
        })
        .mapTopLevelValue(_ => {
          return neverCalledCallback();
        })
        .unwrap();

      expect(result).toBe('aDimension');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a Dimension raw value with a default mode', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: 8,
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'dimension'>).getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(_ => {
          return neverCalledCallback();
        })
        .mapUnresolvableTopLevelAlias(unresolvable => {
          return neverCalledCallback();
        })
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue(rawValue => {
              return {
                value: rawValue.value.unwrap(),
                unit: rawValue.unit.unwrap(),
              };
            })
            .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
            .mapResolvableModeLevelAlias(() => neverCalledCallback())
            .unwrap();
        })
        .unwrap();

      expect(result).toStrictEqual({
        default: {
          unit: 'px',
          value: 8,
        },
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a Dimension raw value with two modes', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'dimension',
          $value: {
            mobile: {
              unit: 'px',
              value: 8,
            },
            desktop: {
              unit: 'px',
              value: 16,
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'dimension'>).getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(_ => {
          return neverCalledCallback();
        })
        .mapUnresolvableTopLevelAlias(unresolvable => {
          return neverCalledCallback();
        })
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue(rawValue => {
              return rawValue.value.unwrap();
            })
            .mapUnresolvableModeLevelAlias(() => {
              return neverCalledCallback();
            })
            .mapResolvableModeLevelAlias(() => {
              return neverCalledCallback();
            })
            .unwrap();
        })
        .unwrap();

      expect(result).toStrictEqual({ mobile: 8, desktop: 16 });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a Dimension raw value with a reduce on modes result', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'dimension',
          $value: {
            mobile: { unit: 'px', value: 8 },
            desktop: { unit: 'px', value: 16 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'dimension'>).getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(_ => {
          return neverCalledCallback();
        })
        .mapUnresolvableTopLevelAlias(unresolvable => {
          return neverCalledCallback();
        })
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue(rawValue => {
              return rawValue.value.unwrap() as number;
            })
            .mapUnresolvableModeLevelAlias(() => {
              return neverCalledCallback();
            })
            .mapResolvableModeLevelAlias(() => {
              return neverCalledCallback();
            })
            .reduce((acc, mode, value) => {
              if (value === undefined) return acc;
              return acc + value;
            }, 0);
        })
        .unwrap();

      expect(result).toBe(8 + 16);
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a Dimension raw value with a pickMode on modes result', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'dimension',
          $value: {
            mobile: { unit: 'px', value: 8 },
            desktop: { unit: 'px', value: 16 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'dimension'>).getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(_ => {
          return neverCalledCallback();
        })
        .mapUnresolvableTopLevelAlias(unresolvable => {
          return neverCalledCallback();
        })
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue((rawValue, mode) => {
              return rawValue.value.unwrap() as number;
            })
            .mapUnresolvableModeLevelAlias(() => {
              return neverCalledCallback();
            })
            .mapResolvableModeLevelAlias(() => {
              return neverCalledCallback();
            })
            .pickMode('desktop');
        })
        .unwrap();

      expect(result).toBe(16);
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a Dimension with resolvable mode level aliases only', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimensionSource: {
          $type: 'dimension',
          $value: {
            small: {
              value: 12,
              unit: 'px',
            },
            large: {
              value: 24,
              unit: 'px',
            },
          },
        },
        aDimension: {
          $type: 'dimension',
          $value: {
            small: { $alias: 'aDimensionSource', $mode: 'small' },
            big: { $alias: 'aDimensionSource', $mode: 'large' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'dimension'>).getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(_ => neverCalledCallback())
        .mapUnresolvableTopLevelAlias(unresolvable => neverCalledCallback())
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue(() => neverCalledCallback())
            .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
            .mapResolvableModeLevelAlias(resolvableModeLevelAlias => {
              return {
                target: resolvableModeLevelAlias.tokenState.path.toString(),
                mode: resolvableModeLevelAlias.targetMode,
              };
            })
            .unwrap();
        })
        .unwrap();

      expect(result).toStrictEqual({
        small: { target: 'aDimensionSource', mode: 'small' },
        big: { target: 'aDimensionSource', mode: 'large' },
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a Dimension with unresolvable mode level aliases only', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            small: { $alias: 'aDimensionSource', $mode: 'small' },
            big: { $alias: 'aDimensionSource', $mode: 'large' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = tokenState.getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(_ => neverCalledCallback())
        .mapUnresolvableTopLevelAlias(unresolvable => neverCalledCallback())
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue(() => neverCalledCallback())
            .mapUnresolvableModeLevelAlias(unresolvableModeLevelAlias => {
              return {
                target: unresolvableModeLevelAlias.targetPath.toString(),
                mode: unresolvableModeLevelAlias.targetMode,
              };
            })
            .mapResolvableModeLevelAlias(() => neverCalledCallback())
            .unwrap();
        })
        .unwrap();

      expect(result).toStrictEqual({
        small: { target: 'aDimensionSource', mode: 'small' },
        big: { target: 'aDimensionSource', mode: 'large' },
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a Dimension with resolvable value level aliases only', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimensionUnit: { $type: 'dimensionUnit', $value: { px: 'px' } },
        aNumber: { $type: 'number', $value: { small: 12, large: 24 } },
        aDimension: {
          $type: 'dimension',
          $value: {
            small: {
              unit: { $alias: 'aDimensionUnit', $mode: 'px' },
              value: { $alias: 'aNumber', $mode: 'small' },
            },
            large: {
              unit: { $alias: 'aDimensionUnit', $mode: 'px' },
              value: { $alias: 'aNumber', $mode: 'large' },
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'dimension'>).getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapUnresolvableTopLevelAlias(() => neverCalledCallback())
        .mapResolvableTopLevelAlias(() => neverCalledCallback())
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue((rawValue, mode) => {
              return {
                value: rawValue.value
                  .mapPrimitiveValue(() => neverCalledCallback())
                  .mapUnresolvableValueLevelAlias(() => neverCalledCallback())
                  .mapResolvableValueLevelAlias(
                    ref => `${ref.tokenState.path.toString()} at mode ${ref.targetMode}`,
                  )
                  .unwrap(),
                unit: rawValue.unit
                  .mapPrimitiveValue(() => neverCalledCallback())
                  .mapUnresolvableValueLevelAlias(() => neverCalledCallback())
                  .mapResolvableValueLevelAlias(
                    ref => `${ref.tokenState.path.toString()} at mode ${ref.targetMode}`,
                  )
                  .unwrap(),
              };
            })
            .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
            .mapResolvableModeLevelAlias(() => neverCalledCallback())
            .unwrap();
        })
        .unwrap();

      expect(result).toStrictEqual({
        small: { value: 'aNumber at mode small', unit: 'aDimensionUnit at mode px' },
        large: { value: 'aNumber at mode large', unit: 'aDimensionUnit at mode px' },
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a Dimension with unresolvable value level aliases only', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            small: {
              unit: { $alias: 'aDimensionUnit', $mode: 'px' },
              value: { $alias: 'aNumber', $mode: 'small' },
            },
            large: {
              unit: { $alias: 'aDimensionUnit', $mode: 'px' },
              value: { $alias: 'aNumber', $mode: 'large' },
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'dimension'>).getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);
      const result = statefulValueResult
        .mapUnresolvableTopLevelAlias(() => neverCalledCallback())
        .mapResolvableTopLevelAlias(() => neverCalledCallback())
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue((rawValue, mode) => {
              return {
                value: rawValue.value
                  .mapPrimitiveValue(() => neverCalledCallback())
                  .mapUnresolvableValueLevelAlias(ref => {
                    return `unresolvable ${ref.targetPath.toString()} at mode ${ref.targetMode}`;
                  })
                  .mapResolvableValueLevelAlias(() => neverCalledCallback())
                  .unwrap(),
                unit: rawValue.unit
                  .mapPrimitiveValue(() => neverCalledCallback())
                  .mapUnresolvableValueLevelAlias(ref => {
                    return `unresolvable ${ref.targetPath.toString()} at mode ${ref.targetMode}`;
                  })
                  .mapResolvableValueLevelAlias(() => neverCalledCallback())
                  .unwrap(),
              };
            })
            .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
            .mapResolvableModeLevelAlias(() => neverCalledCallback())
            .unwrap();
        })
        .unwrap();

      expect(result).toStrictEqual({
        small: {
          value: 'unresolvable aNumber at mode small',
          unit: 'unresolvable aDimensionUnit at mode px',
        },
        large: {
          value: 'unresolvable aNumber at mode large',
          unit: 'unresolvable aDimensionUnit at mode px',
        },
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a primitive token type', () => {
      const treeState = createTreeStateFromTokenTree({
        aZIndex: {
          $type: 'zIndex',
          $value: {
            small: 12,
            medium: 14,
          },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aZIndex']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const result = tokenState.getStatefulValueResult().unwrap();

      expect((result as any).unwrap()).toStrictEqual({
        small: 12,
        medium: 14,
      });
    });
    it('should expose a result for a primitive token type aliased on mode', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aZIndexSource: {
          $type: 'zIndex',
          $value: { default: 1 },
        },
        topLevel: {
          $type: 'zIndex',
          $value: {
            small: { $alias: 'aZIndexSource', $mode: 'default' },
            medium: 14,
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['topLevel']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const result = tokenState.getStatefulValueResult().unwrap();

      expect((result as any).unwrap()).toStrictEqual({
        small: expect.any(ResolvableModeLevelAlias),
        medium: 14,
      });
    });
    it('should expose a result for a raw object based token', () => {
      const treeState = createTreeStateFromTokenTree({
        topLevel: {
          $type: 'dimension',
          $value: {
            small: {
              unit: 'px',
              value: 8,
            },
            medium: {
              unit: 'px',
              value: 16,
            },
          },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['topLevel']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const result = tokenState.getStatefulValueResult().unwrap();

      expect((result as any).unwrap()).toStrictEqual({
        small: {
          unit: expect.any(InnerValue),
          value: expect.any(InnerValue),
        },
        medium: {
          unit: expect.any(InnerValue),
          value: expect.any(InnerValue),
        },
      });
    });
    it('should expose a result for a raw array based token', () => {
      const treeState = createTreeStateFromTokenTree({
        topLevel: {
          $type: 'radii',
          $value: {
            small: [
              {
                unit: 'px',
                value: 8,
              },
              {
                unit: 'px',
                value: 8,
              },
            ],
            medium: [
              {
                unit: 'px',
                value: 16,
              },
              {
                unit: 'px',
                value: 16,
              },
            ],
          },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['topLevel']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const result = tokenState.getStatefulValueResult().unwrap();

      expect((result as any).unwrap()).toStrictEqual({
        small: [expect.any(InnerValue), expect.any(InnerValue)],
        medium: [expect.any(InnerValue), expect.any(InnerValue)],
      });
    });
    it('should expose a result for a textStyle value with a aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        unit: {
          $type: 'dimensionUnit',
          $value: { px: 'px' },
        },
        number: {
          base: {
            $type: 'number',
            $value: { default: 12 },
          },
        },
        sizing: {
          lineHeight: {
            $type: 'dimension',
            $value: { default: { unit: 'px', value: 24 } },
          },
        },
        foo: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter-Regular',
                weight: 400,
                style: 'normal',
                files: [],
              },
              fontSize: {
                unit: 'px',
                value: { $alias: 'number.base', $mode: 'default' },
              },
              color: null,
              fontFeatures: ['none'],
              lineHeight: { $alias: 'sizing.lineHeight', $mode: 'default' },
              letterSpacing: { $alias: 'unresolvable', $mode: 'default' },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'textStyle'>).getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(_ => neverCalledCallback())
        .mapUnresolvableTopLevelAlias(unresolvable => neverCalledCallback())
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue((rawValue, mode) => {
              const font = rawValue.font
                .mapPrimitiveValue(primitive => {
                  return Object.entries(primitive).reduce(
                    (acc, [key, val]) => {
                      acc[key] = val.unwrap();
                      return acc;
                    },
                    {} as { [k: string]: unknown },
                  );
                })
                .mapResolvableValueLevelAlias(() => neverCalledCallback())
                .mapUnresolvableValueLevelAlias(() => neverCalledCallback())
                .unwrap();

              const fontSize = rawValue.fontSize
                .mapPrimitiveValue(primitive => {
                  const value = primitive.value
                    .mapResolvableValueLevelAlias(valueRef => {
                      return valueRef.tokenState.getJSONValue({
                        resolveAliases: true,
                        allowUnresolvable: false,
                        targetMode: valueRef.targetMode,
                      });
                    })
                    .unwrap();
                  const unit = primitive.unit.unwrap();
                  return `${value}${unit}`;
                })
                .mapResolvableValueLevelAlias(() => neverCalledCallback())
                .mapUnresolvableValueLevelAlias(() => neverCalledCallback())
                .unwrap();

              const lineHeight = rawValue.lineHeight
                .mapPrimitiveValue(value => neverCalledCallback())
                .mapUnresolvableValueLevelAlias(() => neverCalledCallback())
                .mapResolvableValueLevelAlias(valueRef => {
                  return valueRef.tokenState.path.toString();
                })
                .unwrap();

              const letterSpacing = rawValue.letterSpacing
                .mapPrimitiveValue(value => neverCalledCallback())
                .mapUnresolvableValueLevelAlias(() => 'unresolvable')
                .mapResolvableValueLevelAlias(() => () => neverCalledCallback())
                .unwrap();
              return { font, fontSize, lineHeight, letterSpacing };
            })
            .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
            .mapResolvableModeLevelAlias(() => neverCalledCallback())
            .unwrap();
        })
        .unwrap();

      expect(result).toStrictEqual({
        default: {
          font: {
            family: 'Inter',
            postScriptName: 'Inter-Regular',
            weight: 400,
            style: 'normal',
            files: [],
          },
          fontSize: '12px',
          lineHeight: 'sizing.lineHeight',
          letterSpacing: 'unresolvable',
        },
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a Gradients value with a aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          blue: {
            $type: 'color',
            $value: { default: { model: 'hex', hex: '#770F69', alpha: 1 } },
          },
        },
        foo: {
          $type: 'gradients',
          $value: {
            default: [
              {
                type: 'linear',
                angle: 0,
                colorStops: [
                  {
                    color: { $alias: 'color.blue', $mode: 'default' },
                    position: 0,
                  },
                  {
                    color: { model: 'rgb', red: 0, green: 255, blue: 100, alpha: 1 },
                    position: 1,
                  },
                ],
              },
            ],
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'gradients'>).getStatefulValueResult();

      expect(statefulValueResult.isUnresolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isResolvableTopLevelAlias).toBe(false);
      expect(statefulValueResult.isTopLevelValue).toBe(true);

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(_ => neverCalledCallback())
        .mapUnresolvableTopLevelAlias(unresolvable => neverCalledCallback())
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue((rawValue, mode) => {
              return rawValue.map(gradient => {
                return gradient
                  .mapPrimitiveValue(primitive => {
                    const linearGradient = primitive as Extract<
                      typeof primitive,
                      { type: InnerValue<'linear'> }
                    >;

                    const colors = linearGradient.colorStops
                      .mapPrimitiveValue(colorStops => {
                        return colorStops.map(colorStop => {
                          return colorStop
                            .unwrap()
                            .color.ofType('color')
                            .mapPrimitiveValue(color => {
                              const mod = color.model.unwrap();

                              switch (mod) {
                                case 'hex': {
                                  const hexColor = color as Extract<
                                    typeof color,
                                    { model: InnerValue<'hex', 'hex'> }
                                  >;
                                  return hexColor.hex.unwrap();
                                }
                                case 'rgb': {
                                  const rgbColor = color as Extract<
                                    typeof color,
                                    { model: InnerValue<'rgb', 'rgb'> }
                                  >;
                                  return `rgb(${rgbColor.red.unwrap()}, ${rgbColor.green.unwrap()}, ${rgbColor.blue.unwrap()})`;
                                }
                              }
                            })
                            .mapResolvableValueLevelAlias(resolvableAliasRef => {
                              const colorValue = resolvableAliasRef.tokenState.getJSONValue({
                                resolveAliases: true,
                                allowUnresolvable: false,
                                targetMode: resolvableAliasRef.targetMode,
                              });

                              if (colorValue && colorValue.model === 'hex') {
                                return colorValue.hex;
                              }
                            })
                            .unwrap();
                        });
                      })
                      .unwrap();

                    return {
                      type: linearGradient.type.unwrap(),
                      angle: linearGradient.angle.unwrap(),
                      colorStops: colors,
                    };
                  })
                  .mapResolvableValueLevelAlias(ref => {
                    return ref.tokenState.getJSONValue({
                      resolveAliases: true,
                      allowUnresolvable: false,
                      targetMode: ref.targetMode,
                    });
                  })
                  .mapUnresolvableValueLevelAlias(() => neverCalledCallback())
                  .unwrap();
              });
            })
            .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
            .mapResolvableModeLevelAlias(() => neverCalledCallback())
            .pickMode('default');
        })
        .unwrap();

      expect(result).toStrictEqual([
        {
          type: 'linear',
          angle: 0,
          colorStops: ['#770F69', 'rgb(0, 255, 100)'],
        },
      ]);
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should expose a result for a complex shadows with aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: {
          $type: 'number',
          $value: { default: 4 },
        },
        aColor: {
          $type: 'color',
          $value: {
            default: {
              model: 'hex',
              hex: '#000000',
              alpha: 1,
            },
          },
        },
        aDimension: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'aNumber', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        aShadow: {
          $type: 'shadow',
          $value: {
            default: {
              color: { $alias: 'aColor', $mode: 'default' },
              offsetX: { value: 0, unit: 'px' },
              offsetY: { value: 0, unit: 'px' },
              blurRadius: { $alias: 'aDimension', $mode: 'default' },
              spreadRadius: { value: 0, unit: 'px' },
              type: 'outer',
            },
          },
        },
        aShadows: {
          $type: 'shadows',
          $value: {
            default: [
              {
                $alias: 'aShadow',
                $mode: 'default',
              },
            ],
          },
        },
        anotherShadows: {
          $type: 'shadows',
          $value: {
            raw: [
              {
                $alias: 'aShadow',
                $mode: 'default',
              },
            ],
            aliased: { $alias: 'aShadows', $mode: 'default' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['anotherShadows']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const statefulValueResult = (tokenState as TokenState<'shadows'>).getStatefulValueResult();

      const neverCalledCallback = vi.fn(() => undefined);

      const result = statefulValueResult
        .mapResolvableTopLevelAlias(() => neverCalledCallback())
        .mapUnresolvableTopLevelAlias(() => neverCalledCallback())
        .mapTopLevelValue(topLevelValue => {
          return topLevelValue
            .mapRawValue((rawValue, mode) => {
              return rawValue.map(shadow => {
                return shadow
                  .mapPrimitiveValue(() => neverCalledCallback())
                  .mapResolvableValueLevelAlias(resolvableAliasRef => {
                    return resolvableAliasRef.tokenState.getJSONValue({
                      resolveAliases: true,
                      targetMode: resolvableAliasRef.targetMode,
                    });
                  })
                  .mapUnresolvableValueLevelAlias(() => neverCalledCallback())
                  .unwrap();
              });
            })
            .mapResolvableModeLevelAlias(resolvableAliasRef => {
              return resolvableAliasRef.tokenState.path.toString();
            })
            .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
            .unwrap();
        })
        .unwrap();

      expect(result).toStrictEqual({
        raw: [
          {
            offsetX: {
              value: 0,
              unit: 'px',
            },
            offsetY: {
              value: 0,
              unit: 'px',
            },
            spreadRadius: {
              value: 0,
              unit: 'px',
            },
            type: 'outer',
            color: {
              model: 'hex',
              hex: '#000000',
              alpha: 1,
            },
            blurRadius: {
              unit: 'px',
              value: 4,
            },
          },
        ],
        aliased: 'aShadows',
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });
  describe.concurrent('resolveDeepStatefulValueForMode', () => {
    it('should dig a mode level alias until a value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        value: {
          $type: 'dimension',
          $value: {
            large: {
              value: { $alias: 'valueValueAlias', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        valueValueAlias: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        alias1: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'value', $mode: 'large' },
          },
        },
        alias2: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'alias1', $mode: 'default' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState<'dimension'>(new TreePath(['alias2']));

      if (!tokenState) throw new Error('Should be resolved');

      const {
        value: tokenToTest,
        targetMode,
        tokenState: foundToken,
      } = tokenState.resolveDeepStatefulValueForMode<'dimension'>('default');

      expect(targetMode).toBe('large');
      expect(foundToken.path.toString()).toBe('value');
      expect(tokenToTest instanceof UnresolvableModeLevelAlias).toBeFalsy();
      expect(tokenToTest).toEqual({ value: expect.any(InnerValue), unit: expect.any(InnerValue) });
      // @ts-expect-error - Removing the need to narrow the type
      expect(tokenToTest.value.unwrap() instanceof ResolvableValueLevelAlias).toBeTruthy();
      // @ts-expect-error - Removing the need to narrow the type
      expect(tokenToTest.unit.unwrapValue()).toBe('px');

      if (tokenToTest instanceof UnresolvableModeLevelAlias) throw new Error('Unreachable');

      expect(tokenToTest.value.resolveDeepValue().unwrapValue()).toBe(12);
    });
    it('should return the raw value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        value: {
          $type: 'dimension',
          $value: {
            default: {
              value: 12,
              unit: 'px',
            },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState<'dimension'>(new TreePath(['value']));

      if (!tokenState) throw new Error('Should be resolved');

      const {
        value: tokenToTest,
        tokenState: foundToken,
        targetMode,
      } = tokenState.resolveDeepStatefulValueForMode<'dimension'>('default');

      expect(targetMode).toBe('default');
      expect(foundToken.path.toString()).toBe('value');
      expect(tokenToTest instanceof UnresolvableModeLevelAlias).toBeFalsy();

      if (tokenToTest instanceof UnresolvableModeLevelAlias) throw new Error('Unreachable');

      expect(tokenToTest.unit instanceof InnerValue).toBeTruthy();
      expect(tokenToTest.value instanceof InnerValue).toBeTruthy();
      expect(tokenToTest.unit.unwrapValue()).toBe('px');
      expect(tokenToTest.value.unwrapValue()).toBe(12);
    });
    it('should return an unresolvable mode value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        alias2: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'value', $mode: 'no' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState<'dimension'>(new TreePath(['alias2']));

      if (!tokenState) throw new Error('Should be resolved');

      const {
        value: tokenToTest,
        targetMode,
        tokenState: foundToken,
      } = tokenState.resolveDeepStatefulValueForMode('default');

      expect(targetMode).toBe('default');
      expect(foundToken.path.toString()).toBe('alias2');
      expect(tokenToTest instanceof UnresolvableModeLevelAlias).toBeTruthy();

      if (!(tokenToTest instanceof UnresolvableModeLevelAlias)) throw new Error('Unreachable');

      expect(tokenToTest.targetMode).toBe('no');
      expect(tokenToTest.targetPath).toEqual(new TreePath(['value']));
      expect(tokenToTest.localMode).toBe('default');
    });
    it('should return a resolved value with an unresolved value level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        value: {
          $type: 'dimension',
          $value: {
            large: {
              value: { $alias: 'valueValueAlias', $mode: 'no' },
              unit: 'px',
            },
          },
        },
        alias1: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'value', $mode: 'large' },
          },
        },
        alias2: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'alias1', $mode: 'default' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState<'dimension'>(new TreePath(['alias2']));

      if (!tokenState) throw new Error('Should be resolved');

      const {
        value: tokenToTest,
        tokenState: foundToken,
        targetMode,
      } = tokenState.resolveDeepStatefulValueForMode('default');

      expect(targetMode).toBe('large');
      expect(foundToken.path.toString()).toBe('value');

      expect(tokenToTest instanceof UnresolvableModeLevelAlias).toBeFalsy();
      expect(tokenToTest).toEqual({ value: expect.any(InnerValue), unit: expect.any(InnerValue) });

      if (tokenToTest instanceof UnresolvableModeLevelAlias) throw new Error('Unreachable');

      expect(tokenToTest.value.unwrap()).toBeInstanceOf(UnresolvableValueLevelAlias);

      const unresolvable = tokenToTest.value.unwrap();

      if (!(unresolvable instanceof UnresolvableValueLevelAlias)) throw new Error('Unreachable');

      expect(unresolvable.localMode).toBe('large');
      expect(unresolvable.valuePath).toEqual(new ValuePath(['value']));
      expect(unresolvable.targetPath).toEqual(new TreePath(['valueValueAlias']));
      expect(unresolvable.targetMode).toBe('no');
    });
    it('should fail if trying to resolve a top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            default: { unit: 'px', value: 12 },
          },
        },
        foo: {
          $type: 'dimension',
          $value: { $alias: 'aDimension' },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => tokenState.resolveDeepStatefulValueForMode('default')).toThrow(
        "resolveDeepStatefulValueForMode can't be called from a topLevelAlias",
      );
    });
  });

  describe.concurrent('getUIValueResultOnMode', () => {
    it('should expose a resolvableTopLevelAlias for a resolvable top level alias value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: 12,
            },
          },
        },
        foo: {
          $type: 'dimension',
          $value: { $alias: 'aDimension' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const UIValueResult = tokenState.getUIValueResultOnMode('default');

      expect(UIValueResult).toBeInstanceOf(ResolvableTopLevelAlias);
    });
    it('should expose a unresolvableTopLevelAlias for a unresolvable top level alias value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'dimension',
          $value: { $alias: 'aDimension' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const UIValueResult = tokenState.getUIValueResultOnMode('default');

      expect(UIValueResult).toBeInstanceOf(UnresolvableTopLevelAlias);
    });
    it('should expose an UnknownModeUIValue when the mode does not exist on token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: 12,
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const UIValueResult = tokenState.getUIValueResultOnMode('small');
      expect(UIValueResult).toBeInstanceOf(UnknownModeUIValue);
      expect((UIValueResult as any).mode).toBe('small');
    });
    it('should expose a UIValueSignature when defining a raw value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: 12,
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const UIValueResult = tokenState.getUIValueResultOnMode('default');

      expect(UIValueResult).toEqual({ unit: 'px', value: 12 });
    });
    it('should expose a UIValueSignature when defining a raw value with a resolvable mode level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: 12,
            },
          },
        },
        foo: {
          $type: 'dimension',
          $value: {
            small: { $alias: 'aDimension', $mode: 'default' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const UIValueResult = tokenState.getUIValueResultOnMode('small');

      expect(UIValueResult).toBeInstanceOf(ResolvableModeLevelAlias);
      expect((UIValueResult as any).tokenState.type).toBe('dimension');
    });
    it('should expose a UIValueSignature when defining a raw value with an unresolvable mode level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'dimension',
          $value: {
            small: { $alias: 'aDimension', $mode: 'default' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const UIValueResult = tokenState.getUIValueResultOnMode('small');

      expect(UIValueResult).toBeInstanceOf(UnresolvableModeLevelAlias);
      expect((UIValueResult as any).localMode).toBe('small');
      expect((UIValueResult as any).targetMode).toBe('default');
    });
    it('should expose a UIValueSignature when defining a raw value with a resolvable value level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: { $type: 'number', $value: { default: 12 } },
        foo: {
          $type: 'dimension',
          $value: {
            small: {
              unit: 'px',
              value: { $alias: 'aNumber', $mode: 'default' },
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const UIValueResult = tokenState.getUIValueResultOnMode('small');

      expect(UIValueResult).toStrictEqual({
        unit: 'px',
        value: expect.any(ResolvableValueLevelAlias),
      });
      expect((UIValueResult as any).value.tokenState.type).toBe('number');
    });
    it('should expose a UIValueSignature when defining a raw value with an unresolvable value level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'dimension',
          $value: {
            small: {
              unit: 'px',
              value: { $alias: 'aNumber', $mode: 'default' },
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const UIValueResult = tokenState.getUIValueResultOnMode('small');

      expect(UIValueResult).toStrictEqual({
        unit: 'px',
        value: expect.any(UnresolvableValueLevelAlias),
      });
      expect((UIValueResult as any).value.localMode).toBe('small');
      expect((UIValueResult as any).value.targetMode).toBe('default');
    });
    it('should fail if the targetMode is not a string', () => {
      const treeState = createTreeStateFromTokenTree({
        foo: {
          $type: 'dimension',
          $value: {
            small: {
              unit: 'px',
              value: { $alias: 'aNumber', $mode: 'default' },
            },
          },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => tokenState.getUIValueResultOnMode(null as any)).toThrow(
        'targetMode should be a string, received: "null"',
      );
    });
  });

  describe.concurrent('rename', () => {
    it('should rename the token and its aliasReferences', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aGroup: {
          aStringAlias: {
            $type: 'string',
            $value: { $alias: 'aString' },
          },
        },
        anotherStringAlias: {
          $type: 'string',
          $value: { $alias: 'aGroup.aStringAlias' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aGroup', 'aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const hasBeenRenamed = tokenState.rename('aRenamedStringAlias');

      expect(hasBeenRenamed).toBe(true);
      expect(tokenState.name).toBe('aRenamedStringAlias');
      const foundFrom = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aGroup', 'aRenamedStringAlias']),
      });
      expect(foundFrom).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aGroup', 'aRenamedStringAlias']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: { treePath: new TreePath(['aString']), mode: null },
        },
      ]);

      const foundTo = treeState.getAliasReferencesTo({
        treePath: new TreePath(['aGroup', 'aRenamedStringAlias']),
      });
      expect(foundTo).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['anotherStringAlias']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: { treePath: new TreePath(['aGroup', 'aRenamedStringAlias']), mode: null },
        },
      ]);
    });
    it('should do nothing if the token is already named the same', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const hasBeenRenamed = tokenState.rename('aString');

      expect(hasBeenRenamed).toBe(false);
      expect(tokenState.name).toBe('aString');
    });
  });
  describe.concurrent('renameMode', () => {
    it('should rename the mode of a simple raw token', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: {
          $type: 'string',
          $value: {
            small: 'small',
            medium: 'medium',
            large: 'large',
          },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.renameMode('medium', 'MEDIUM');

      expect(tokenState.value).toStrictEqual({
        small: 'small',
        MEDIUM: 'medium',
        large: 'large',
      });
      expect(tokenState.modes).toStrictEqual(['large', 'MEDIUM', 'small']);
    });
    it('should rename the mode of a composed raw token', () => {
      const treeState = createTreeStateFromTokenTree({
        aColor: {
          $type: 'color',
          $value: {
            light: { model: 'hex', hex: '#000000', alpha: 1 },
            dark: { model: 'hex', hex: '#000000', alpha: 1 },
            colorBlind: { model: 'hex', hex: '#000000', alpha: 1 },
          },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aColor']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.renameMode('dark', 'DARK');
      expect(tokenState.value).toStrictEqual({
        light: { model: 'hex', hex: '#000000', alpha: 1 },
        DARK: { model: 'hex', hex: '#000000', alpha: 1 },
        colorBlind: { model: 'hex', hex: '#000000', alpha: 1 },
      });
      expect(tokenState.modes).toStrictEqual(['colorBlind', 'DARK', 'light']);
    });
    it('should rename the mode of a token used as a top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aBaseNumber: {
          $type: 'number',
          $value: {
            default: 2,
          },
        },
        aTopLevelAlias: {
          $type: 'number',
          $value: {
            $alias: 'aBaseNumber',
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aBaseNumber']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.renameMode('default', 'base');
      expect(tokenState.modes).toStrictEqual(['base']);
      expect(tokenState.value).toStrictEqual({ base: 2 });

      const references = treeState.getAllAliasReferences();

      expect(references).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aTopLevelAlias']),
            valuePath: new ValuePath([]),
            mode: null,
          },
          to: { treePath: new TreePath(['aBaseNumber']), mode: null },
        },
      ]);
    });
    it('should rename the mode of a token used as a mode level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aBaseNumber: {
          $type: 'number',
          $value: {
            default: 2,
          },
        },
        aModeLevelAlias: {
          $type: 'number',
          $value: {
            small: { $alias: 'aBaseNumber', $mode: 'default' },
            large: { $alias: 'aBaseNumber', $mode: 'default' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      expect(treeState.getAllAliasReferences()).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aModeLevelAlias']),
            valuePath: new ValuePath([]),
            mode: 'small',
          },
          to: { treePath: new TreePath(['aBaseNumber']), mode: 'default' },
        },
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aModeLevelAlias']),
            mode: 'large',
            valuePath: new ValuePath([]),
          },
          to: { treePath: new TreePath(['aBaseNumber']), mode: 'default' },
        },
      ]);

      const maybeBaseNumberTokenState = treeState.getTokenState(new TreePath(['aBaseNumber']));
      if (!maybeBaseNumberTokenState) throw new Error('Token state is unresolvable');

      maybeBaseNumberTokenState.renameMode('default', 'base');
      expect(maybeBaseNumberTokenState.modes).toEqual(['base']);

      expect(treeState.getAllAliasReferences()).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aModeLevelAlias']),
            valuePath: new ValuePath([]),
            mode: 'small',
          },
          to: { treePath: new TreePath(['aBaseNumber']), mode: 'base' },
        },
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aModeLevelAlias']),
            mode: 'large',
            valuePath: new ValuePath([]),
          },
          to: { treePath: new TreePath(['aBaseNumber']), mode: 'base' },
        },
      ]);

      const maybeAModeLevelAlias = treeState.getTokenState(new TreePath(['aModeLevelAlias']));
      if (!maybeAModeLevelAlias) throw new Error('Token state is unresolvable');

      maybeAModeLevelAlias.renameMode('small', 'tiny');
      expect(maybeAModeLevelAlias.modes).toEqual(['large', 'tiny']);

      expect(treeState.getAllAliasReferences()).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aModeLevelAlias']),
            valuePath: new ValuePath([]),
            mode: 'tiny',
          },
          to: { treePath: new TreePath(['aBaseNumber']), mode: 'base' },
        },
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aModeLevelAlias']),
            mode: 'large',
            valuePath: new ValuePath([]),
          },
          to: { treePath: new TreePath(['aBaseNumber']), mode: 'base' },
        },
      ]);
    });
    it('should rename the aliased token mode when using a top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aString' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.renameMode('default', 'foo');

      expect(tokenState.modes).toEqual(['foo']);

      const maybeAStringTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeAStringTokenState) throw new Error('Token state is unresolvable');

      expect(maybeAStringTokenState.modes).toEqual(['foo']);
    });
    it('should fail renaming the aliased token mode in a collection when using a top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
          aString: { $type: 'string', $value: { default: 'aString' } },
        },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aCollection.aString' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.renameMode('default', 'foo');
      }).toThrow(
        'Mode "foo" is not allowed in collection "aCollection.aString" defining modes: "default"',
      );
    });
    it('should fail renaming when the token is a top level non-resolvable alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aUnknownString' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.renameMode('default', 'foo');
      }).toThrow(
        'Cannot rename the modes of the non-resolvable top level alias: "aUnknownString" on token "aStringAlias"',
      );
    });
    it('should fail renaming when the fromMode does not exist', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: {
          $type: 'string',
          $value: { default: 'aString' },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.renameMode('foo', 'bar');
      }).toThrow('Mode "foo" does not exist in token "aString"');
    });
    it('should fail renaming when the toMode already exists', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaine' },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.renameMode('en', 'fr');
      }).toThrow('Mode "fr" already exists in token "aString"');
    });
    it('should fail renaming a mode when the toMode starts with "$"', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaine' },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.renameMode('en', '$foo');
      }).toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "message": "$mode cannot start with a \\\"$\\\"",
            "path": [
              "aString"
            ]
          }
        ]]
      `);
    });
    it('should fail renaming a mode when the toMode is an empty string', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaine' },
        },
      });

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.renameMode('en', '');
      }).toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "too_small",
            "minimum": 1,
            "type": "string",
            "inclusive": true,
            "exact": false,
            "message": "$mode must be a non-empty string",
            "path": [
              "aString"
            ]
          }
        ]]
      `);
    });
  });

  describe.concurrent('updateValue - without overriding alias', () => {
    it('should update a deep value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'notDefault',
        {
          font: {
            weight: 100,
          },
        },
        { overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 100,
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the value and the aliases as well', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { $alias: 'middle', $mode: 'default' },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'notDefault',
        {
          fontSize: { value: 0, unit: 'px' },
          lineHeight: {
            value: 0,
            unit: 'px',
          },
          letterSpacing: {
            value: 0,
            unit: 'px',
          },
        },
        { overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'number',
          $value: {
            default: 0,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { $alias: 'middle', $mode: 'default' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the deep alias to another alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { $alias: 'middle', $mode: 'default' },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'notDefault',
        {
          fontSize: { $alias: 'test', $mode: 'mode' },
        },
        { overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'test', $mode: 'mode' },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { $alias: 'middle', $mode: 'default' },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the value for a null', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'notDefault',
        {
          fontSize: { value: 0, unit: 'px' },
          lineHeight: {
            value: 0,
            unit: 'px',
          },
          letterSpacing: {
            value: 0,
            unit: 'px',
          },
          paragraphSpacing: { value: 12, unit: 'px' },
        },
        { overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: { value: 12, unit: 'px' },
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the value for a null and throw because of single value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: null,
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue(
          'notDefault',
          {
            lineHeight: {
              value: 12,
            },
          },
          { overrideAliases: false },
        );

        throw new Error('updateValueForMode is supposed to throw');
      } catch (e) {
        const error = e as ZodError;

        expect(error.message.includes('ZodError')).toBeTruthy();
      }
    });

    it('should update an alias value and throw because the type is wrong', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        dimension: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['dimension']));

      if (!tokenState) throw new Error('unreachable');

      try {
        (tokenState as TokenState<'dimension'>).updateModeValue(
          'default',
          {
            // @ts-expect-error - Supposed to be a number
            value: 'a string',
          },
          { overrideAliases: false },
        );

        throw new Error('updateValueForMode is supposed to throw');
      } catch (e) {
        const error = e as ZodError;

        expect(error.message.includes('ZodError')).toBeTruthy();
      }
    });

    it('should update the value and set a null', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'notDefault',
        {
          fontSize: { value: 10, unit: 'px' },
          lineHeight: null,
          letterSpacing: {
            value: 0,
            unit: 'px',
          },
        },
        { overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 10, unit: 'px' },
              lineHeight: null,
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should not update anything because of an unresolvable alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                $alias: 'does.not.exists',
                $mode: 'mode',
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'notDefault',
        {
          font: {
            weight: 100,
          },
        },
        { overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                $alias: 'does.not.exists',
                $mode: 'mode',
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the value for a primitive token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        number: {
          $type: 'number',
          $value: { default: 10 },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['number']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', 0, { overrideAliases: false });

      expect(engine.renderJSONTree()).toEqual({
        number: {
          $type: 'number',
          $value: { default: 0 },
        },
      });
    });

    it('should update the value with an unresolvable alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        number: {
          $type: 'number',
          $value: { default: 10 },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['number']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { $alias: 'a.path', $mode: 'mode' },
        { overrideAliases: false },
      );

      const result = tokenState
        .getStatefulValueResult()
        .mapTopLevelValue(modeLevel => modeLevel.unwrap())
        .unwrap();

      // @ts-expect-error
      expect(result['default']).toBeInstanceOf(UnresolvableModeLevelAlias);
      expect(engine.renderJSONTree()).toEqual({
        number: {
          $type: 'number',
          $value: { default: { $alias: 'a.path', $mode: 'mode' } },
        },
      });
    });

    it('should update the value with a resolvable alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        a: {
          path: { $type: 'number', $value: { mode: 10 } },
        },
        number: {
          $type: 'number',
          $value: { default: 10 },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['number']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { $alias: 'a.path', $mode: 'mode' },
        { overrideAliases: false },
      );

      const result = tokenState
        .getStatefulValueResult()
        .mapTopLevelValue(modeLevel => modeLevel.unwrap())
        .unwrap();

      // @ts-expect-error
      expect(result['default']).toBeInstanceOf(ResolvableModeLevelAlias);

      expect(engine.renderJSONTree()).toEqual({
        a: {
          path: { $type: 'number', $value: { mode: 10 } },
        },
        number: {
          $type: 'number',
          $value: { default: { $alias: 'a.path', $mode: 'mode' } },
        },
      });
    });

    it('should update an array', () => {
      const tokens: SpecifyDesignTokenFormat = {
        radii: {
          $type: 'radii',
          $value: { default: [{ value: 10, unit: 'px' }] },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['radii']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', [{ value: 0, unit: 'px' }], {
        overrideAliases: false,
      });

      expect(engine.renderJSONTree()).toEqual({
        radii: {
          $type: 'radii',
          $value: {
            default: [{ value: 0, unit: 'px' }],
          },
        },
      });
    });

    it('should update an array with an alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        radius: {
          $type: 'radius',
          $value: {
            aMode: { value: 10, unit: 'px' },
          },
        },
        radii: {
          $type: 'radii',
          $value: { default: [{ $alias: 'radius', $mode: 'aMode' }] },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['radii']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', [{ value: 0, unit: 'px' }], {
        overrideAliases: false,
      });

      expect(engine.renderJSONTree()).toEqual({
        radius: {
          $type: 'radius',
          $value: {
            aMode: { value: 0, unit: 'px' },
          },
        },
        radii: {
          $type: 'radii',
          $value: { default: [{ $alias: 'radius', $mode: 'aMode' }] },
        },
      });
    });

    it('should update the color red value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { red: 0 },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 0, green: 0, blue: 0, alpha: 1 } },
        },
      });
    });

    it('should throw an error because the property is in the wrong model', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue(
          'default',
          { hue: 0 },
          {
            overrideAliases: false,
          },
        );

        throw new Error('Expected error to be thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should update the color model and all the values', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { model: 'hex', hex: '#ffff00' },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        color: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ffff00', alpha: 1 } },
        },
      });
    });

    it('should throw an error because we change the model of the color but not all the properties are here', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue(
          'default',
          { model: 'hex', alpha: 1 },
          {
            overrideAliases: false,
          },
        );

        throw new Error('Expected error to be thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should update the color with a mode level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        hex: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { $alias: 'hex', $mode: 'default' },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        hex: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        color: {
          $type: 'color',
          $value: {
            default: { $alias: 'hex', $mode: 'default' },
          },
        },
      });
    });

    it('should update the color with an alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        hex: {
          $type: 'hexadecimalColorString',
          $value: { default: '#ff00ff' },
        },
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { model: 'hex', hex: { $alias: 'hex', $mode: 'default' }, alpha: 0.5 },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        hex: {
          $type: 'hexadecimalColorString',
          $value: { default: '#ff00ff' },
        },
        color: {
          $type: 'color',
          $value: {
            default: { model: 'hex', hex: { $alias: 'hex', $mode: 'default' }, alpha: 0.5 },
          },
        },
      });
    });

    it('should update the color red value of a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { color: { red: 0 } },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the deep color of a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'color',
          $value: {
            notDefault: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 1,
            },
          },
        },
        intermediate: {
          $type: 'color',
          $value: {
            default: { $alias: 'deep', $mode: 'notDefault' },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                $alias: 'intermediate',
                $mode: 'default',
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { color: { red: 255 } },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'color',
          $value: {
            notDefault: {
              model: 'rgb',
              red: 255,
              green: 0,
              blue: 0,
              alpha: 1,
            },
          },
        },
        intermediate: {
          $type: 'color',
          $value: {
            default: { $alias: 'deep', $mode: 'notDefault' },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                $alias: 'intermediate',
                $mode: 'default',
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should throw an error because the property is in the wrong model for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue(
          'default',
          { color: { hue: 0 } },
          {
            overrideAliases: false,
          },
        );

        throw new Error('Expected error to be thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should update the color model and all the values for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { color: { model: 'hex', hex: '#ffff00' }, fontSize: { value: 0, unit: 'px' } },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'hex',
                hex: '#ffff00',
                alpha: 0,
              },
              fontSize: {
                value: 0,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should throw an error because we change the model of the color but not all the properties are here for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue(
          'default',
          { color: { model: 'hex', alpha: 1 } },
          {
            overrideAliases: false,
          },
        );

        throw new Error('Expected error to be thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should update the color with an alias for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        hex: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { color: { $alias: 'hex', $mode: 'default' } },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        hex: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: { $alias: 'hex', $mode: 'default' },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });
    it('should update the color with an alias for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        hex: {
          $type: 'hexadecimalColorString',
          $value: { default: '#ff00ff' },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { color: { model: 'hex', hex: { $alias: 'hex', $mode: 'default' }, alpha: 0.5 } },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        hex: {
          $type: 'hexadecimalColorString',
          $value: { default: '#ff00ff' },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'hex',
                hex: { $alias: 'hex', $mode: 'default' },
                alpha: 0.5,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the color hue value of a border', () => {
      const tokens: SpecifyDesignTokenFormat = {
        border: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'groove',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['border']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { color: { hue: 0 } },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        border: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 0,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'groove',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should update the color red value of a shadow', () => {
      const tokens: SpecifyDesignTokenFormat = {
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 231,
                green: 228,
                blue: 251,
                alpha: 1,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['shadow']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { color: { red: 0 } },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 0,
                green: 228,
                blue: 251,
                alpha: 1,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
      });
    });

    it('should update the deep color red value of a shadow', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'color',
          $value: {
            notDefault: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 1,
            },
          },
        },
        intermediate: {
          $type: 'color',
          $value: {
            default: { $alias: 'deep', $mode: 'notDefault' },
          },
        },
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                $alias: 'intermediate',
                $mode: 'default',
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['shadow']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { color: { red: 255 } },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'color',
          $value: {
            notDefault: {
              model: 'rgb',
              red: 255,
              green: 0,
              blue: 0,
              alpha: 1,
            },
          },
        },
        intermediate: {
          $type: 'color',
          $value: {
            default: { $alias: 'deep', $mode: 'notDefault' },
          },
        },
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                $alias: 'intermediate',
                $mode: 'default',
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
      });
    });

    it('should update the color of a gradient', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradient']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { colorStops: [{}, { color: { red: 255 } }] },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 255,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
      });
    });

    it('should update the gradient type', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradient']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          type: 'radial',
          position: 'center',
          colorStops: [
            {
              color: {
                model: 'hsb',
                alpha: 0.09,
                hue: 82.14,
                saturation: 54.88,
                brightness: 13.99,
              },
              position: 0,
            },
            {
              color: {
                model: 'hsb',
                alpha: 0.68,
                hue: 102.29,
                saturation: 16.85,
                brightness: 35.93,
              },
              position: 1,
            },
          ],
        },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'radial',
              position: 'center',
              colorStops: [
                {
                  color: {
                    model: 'hsb',
                    alpha: 0.09,
                    hue: 82.14,
                    saturation: 54.88,
                    brightness: 13.99,
                  },
                  position: 0,
                },
                {
                  color: {
                    model: 'hsb',
                    alpha: 0.68,
                    hue: 102.29,
                    saturation: 16.85,
                    brightness: 35.93,
                  },
                  position: 1,
                },
              ],
            },
          },
        },
      });
    });

    it("should throw because we change the gradient type but don't provide enough informations", () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradient']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue(
          'default',
          {
            type: 'radial',
            position: 'center',
          },
          {
            overrideAliases: false,
          },
        );

        throw new Error('Supposed to throw');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should update the color of a gradients', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              {
                type: 'linear',
                angle: 90,
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
              {
                type: 'radial',
                position: 'center',
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradients']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        [
          { colorStops: [{}, { color: { red: 255 } }] },
          { colorStops: [{}, { color: { red: 255 } }] },
        ],
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              {
                type: 'linear',
                angle: 90,
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 255,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
              {
                type: 'radial',
                position: 'center',
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 255,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('should update the color of a gradients with multiple aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            notDefault: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              { $alias: 'gradient', $mode: 'notDefault' },
              {
                type: 'radial',
                position: 'center',
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradients']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        [
          { colorStops: [{}, { color: { red: 255 } }] },
          { colorStops: [{}, { color: { red: 255 } }] },
        ],
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        gradient: {
          $type: 'gradient',
          $value: {
            notDefault: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 255,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              { $alias: 'gradient', $mode: 'notDefault' },
              {
                type: 'radial',
                position: 'center',
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 255,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('should update the color of a gradients with multiple aliases and one in the gradient as well', () => {
      const tokens: SpecifyDesignTokenFormat = {
        colorToUpdate: {
          $type: 'color',
          $value: {
            default: {
              model: 'rgb',
              red: 0,
              green: 228,
              blue: 251,
              alpha: 1,
            },
          },
        },
        gradient: {
          $type: 'gradient',
          $value: {
            notDefault: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    $alias: 'colorToUpdate',
                    $mode: 'default',
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              { $alias: 'gradient', $mode: 'notDefault' },
              {
                type: 'radial',
                position: 'center',
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradients']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        [
          { colorStops: [{ color: { red: 255 } }, { color: { red: 255 } }] },
          { colorStops: [{}, { color: { red: 255 } }] },
        ],
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        colorToUpdate: {
          $type: 'color',
          $value: {
            default: {
              model: 'rgb',
              red: 255,
              green: 228,
              blue: 251,
              alpha: 1,
            },
          },
        },
        gradient: {
          $type: 'gradient',
          $value: {
            notDefault: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 255,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    $alias: 'colorToUpdate',
                    $mode: 'default',
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              { $alias: 'gradient', $mode: 'notDefault' },
              {
                type: 'radial',
                position: 'center',
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 255,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('should update the color of a shadows', () => {
      const tokens: SpecifyDesignTokenFormat = {
        shadows: {
          $type: 'shadows',
          $value: {
            default: [
              {
                type: 'outer',
                color: {
                  model: 'rgb',
                  red: 0,
                  green: 0,
                  blue: 0,
                  alpha: 0.02,
                },
                offsetX: {
                  value: 0,
                  unit: 'px',
                },
                offsetY: {
                  value: 1,
                  unit: 'px',
                },
                blurRadius: {
                  value: 2,
                  unit: 'px',
                },
                spreadRadius: {
                  value: 0,
                  unit: 'px',
                },
              },
              {
                type: 'outer',
                color: {
                  model: 'rgb',
                  red: 0,
                  green: 0,
                  blue: 0,
                  alpha: 0.04,
                },
                offsetX: {
                  value: 0,
                  unit: 'px',
                },
                offsetY: {
                  value: 2,
                  unit: 'px',
                },
                blurRadius: {
                  value: 2,
                  unit: 'px',
                },
                spreadRadius: {
                  value: 0,
                  unit: 'px',
                },
              },
            ],
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['shadows']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        [
          { color: { red: 255 }, offsetY: { value: 0 } },
          { color: { red: 255 }, offsetX: { value: 10 } },
        ],
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        shadows: {
          $type: 'shadows',
          $value: {
            default: [
              {
                type: 'outer',
                color: {
                  model: 'rgb',
                  red: 255,
                  green: 0,
                  blue: 0,
                  alpha: 0.02,
                },
                offsetX: {
                  value: 0,
                  unit: 'px',
                },
                offsetY: {
                  value: 0,
                  unit: 'px',
                },
                blurRadius: {
                  value: 2,
                  unit: 'px',
                },
                spreadRadius: {
                  value: 0,
                  unit: 'px',
                },
              },
              {
                type: 'outer',
                color: {
                  model: 'rgb',
                  red: 255,
                  green: 0,
                  blue: 0,
                  alpha: 0.04,
                },
                offsetX: {
                  value: 10,
                  unit: 'px',
                },
                offsetY: {
                  value: 2,
                  unit: 'px',
                },
                blurRadius: {
                  value: 2,
                  unit: 'px',
                },
                spreadRadius: {
                  value: 0,
                  unit: 'px',
                },
              },
            ],
          },
        },
      });
    });

    it('should update the timing function of a transition to a steps timing function', () => {
      const tokens: SpecifyDesignTokenFormat = {
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: [0.20282747403427392, -1, 0.9697411674570271, -1],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['transition']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          timingFunction: {
            stepsCount: 10,
            jumpTerm: 'jump-end',
          },
        },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: {
                stepsCount: 10,
                jumpTerm: 'jump-end',
              },
            },
          },
        },
      });
    });

    it('should update the timing function of a transition and set another value for the cubic bezier', () => {
      const tokens: SpecifyDesignTokenFormat = {
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: [0.20282747403427392, -1, 0.9697411674570271, -1],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['transition']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          timingFunction: [0],
        },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: [0, -1, 0.9697411674570271, -1],
            },
          },
        },
      });
    });

    it('should update the timing function of a transition and set another value for the deep alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        cubicBezier: { $type: 'cubicBezier', $value: { notDefault: [0, 1, 0, 1] } },
        cubicBezierAlias: {
          $type: 'cubicBezier',
          $value: { default: { $mode: 'notDefault', $alias: 'cubicBezier' } },
        },
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: { $alias: 'cubicBezierAlias', $mode: 'default' },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['transition']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          timingFunction: [1],
        },
        {
          overrideAliases: false,
        },
      );

      expect(engine.renderJSONTree()).toEqual({
        cubicBezier: { $type: 'cubicBezier', $value: { notDefault: [1, 1, 0, 1] } },
        cubicBezierAlias: {
          $type: 'cubicBezier',
          $value: { default: { $mode: 'notDefault', $alias: 'cubicBezier' } },
        },
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: { $alias: 'cubicBezierAlias', $mode: 'default' },
            },
          },
        },
      });
    });

    it('should update the value without touching to the other mode', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: {
            light: {
              model: 'hex',
              hex: '#ffffff',
              alpha: 1,
            },
            dark: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('light', {
        hex: '#000000',
      });

      expect(engine.renderJSONTree()).toEqual({
        color: {
          $type: 'color',
          $value: {
            light: {
              model: 'hex',
              hex: '#000000',
              alpha: 1,
            },
            dark: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0,
            },
          },
        },
      });
    });

    it('should update the value without touching to the other mode and override the alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        group: {
          nested: {
            color: {
              $type: 'color',
              $value: { default: { model: 'rgb', red: 0, green: 255, blue: 255, alpha: 1 } },
            },
          },
        },
        color: {
          $type: 'color',
          $value: {
            light: {
              $alias: 'group.nested.color',
              $mode: 'default',
            },
            dark: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'light',
        {
          red: 255,
        },
        { overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        group: {
          nested: {
            color: {
              $type: 'color',
              $value: { default: { model: 'rgb', red: 255, green: 255, blue: 255, alpha: 1 } },
            },
          },
        },
        color: {
          $type: 'color',
          $value: {
            light: {
              $alias: 'group.nested.color',
              $mode: 'default',
            },
            dark: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0,
            },
          },
        },
      });
    });

    it('should change the model of a deep color in a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        primary: {
          $type: 'color',
          $value: {
            red: {
              model: 'rgb',
              red: 255,
              green: 0,
              blue: 0,
              alpha: 1,
            },
          },
        },
        primarySecond: {
          $type: 'color',
          $value: {
            blue: { $alias: 'primary', $mode: 'red' },
          },
        },
        textStyleAlias: {
          $type: 'textStyle',
          $value: {
            default: {
              color: {
                $alias: 'primarySecond',
                $mode: 'blue',
              },
              font: {
                family: 'Calibri',
                postScriptName: 'Calibri_postScriptName',
                weight: 600,
                style: 'normal',
                files: [],
              },
              fontSize: {
                value: 20,
                unit: 'px',
              },
              lineHeight: {
                value: 12,
                unit: 'dvmin',
              },
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyleAlias']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          color: { model: 'hex', hex: '#ff0000' },
        },
        { overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        primary: {
          $type: 'color',
          $value: {
            red: {
              model: 'hex',
              hex: '#ff0000',
              alpha: 1,
            },
          },
        },
        primarySecond: {
          $type: 'color',
          $value: {
            blue: { $alias: 'primary', $mode: 'red' },
          },
        },
        textStyleAlias: {
          $type: 'textStyle',
          $value: {
            default: {
              color: {
                $alias: 'primarySecond',
                $mode: 'blue',
              },
              font: {
                family: 'Calibri',
                postScriptName: 'Calibri_postScriptName',
                weight: 600,
                style: 'normal',
                files: [],
              },
              fontSize: {
                value: 20,
                unit: 'px',
              },
              lineHeight: {
                value: 12,
                unit: 'dvmin',
              },
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should change the model of an aliased gradient in a gradients', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
        gradients: {
          $type: 'gradients',
          $value: {
            notDefault: [{ $alias: 'gradient', $mode: 'default' }],
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradients']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'notDefault',
        [
          {
            type: 'radial',
            position: 'center',
            colorStops: [
              {
                color: {
                  model: 'hsb',
                  alpha: 0.09,
                  hue: 82.14,
                  saturation: 54.88,
                  brightness: 13.99,
                },
                position: 0,
              },
              {
                color: {
                  model: 'hsb',
                  alpha: 0.68,
                  hue: 102.29,
                  saturation: 16.85,
                  brightness: 35.93,
                },
                position: 1,
              },
            ],
          },
        ],
        { overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'radial',
              position: 'center',
              colorStops: [
                {
                  color: {
                    model: 'hsb',
                    alpha: 0.09,
                    hue: 82.14,
                    saturation: 54.88,
                    brightness: 13.99,
                  },
                  position: 0,
                },
                {
                  color: {
                    model: 'hsb',
                    alpha: 0.68,
                    hue: 102.29,
                    saturation: 16.85,
                    brightness: 35.93,
                  },
                  position: 1,
                },
              ],
            },
          },
        },
        gradients: {
          $type: 'gradients',
          $value: {
            notDefault: [{ $alias: 'gradient', $mode: 'default' }],
          },
        },
      });
    });

    it('should change the style of a border for a string', () => {
      const tokens: SpecifyDesignTokenFormat = {
        border: {
          $type: 'border',
          $value: {
            notDefault: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'groove',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['border']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', { style: 'dashed' }, { overrideAliases: false });

      expect(engine.renderJSONTree()).toEqual({
        border: {
          $type: 'border',
          $value: {
            notDefault: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'dashed',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should update the style of a border token with an alias inside for an object', () => {
      const tokens: SpecifyDesignTokenFormat = {
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: {
              lineCap: 'square',
              dashArray: [{ value: 12, unit: 'px' }],
            },
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                $alias: 'borderStyle',
                $mode: 'default',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myBorder']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          style: {
            lineCap: 'round',
            dashArray: [
              {
                value: 24,
                unit: 'px',
              },
            ],
          },
        },
        { allowModeCreation: true, overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: {
              lineCap: 'round',
              dashArray: [
                {
                  value: 24,
                  unit: 'px',
                },
              ],
            },
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                $alias: 'borderStyle',
                $mode: 'default',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should update the style of a border token with an alias inside for a string', () => {
      const tokens: SpecifyDesignTokenFormat = {
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: 'solid',
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                $alias: 'borderStyle',
                $mode: 'default',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myBorder']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          style: 'round',
        },
        { allowModeCreation: true, overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: 'round',
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                $alias: 'borderStyle',
                $mode: 'default',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should update the style of a border token with an alias inside for a string and an object', () => {
      const tokens: SpecifyDesignTokenFormat = {
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: 'solid',
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                $alias: 'borderStyle',
                $mode: 'default',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myBorder']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          style: {
            lineCap: 'round',
            dashArray: [
              {
                value: 24,
                unit: 'px',
              },
            ],
          },
        },
        { allowModeCreation: true, overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: {
              lineCap: 'round',
              dashArray: [
                {
                  value: 24,
                  unit: 'px',
                },
              ],
            },
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                $alias: 'borderStyle',
                $mode: 'default',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should update the style object of a border token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                lineCap: 'round',
                dashArray: [
                  {
                    value: 12,
                    unit: 'px',
                  },
                ],
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myBorder']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          style: {
            lineCap: 'square',
            dashArray: [
              {
                value: 24,
                unit: 'px',
              },
            ],
          },
        },
        { allowModeCreation: true, overrideAliases: false },
      );

      expect(engine.renderJSONTree()).toEqual({
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                lineCap: 'square',
                dashArray: [
                  {
                    value: 24,
                    unit: 'px',
                  },
                ],
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it("should update the modes of the tokens and throw because it is not matching the collection's mode", () => {
      const tokens: SpecifyDesignTokenFormat = {
        myCollection: {
          $collection: { $modes: ['light', 'dark'] },
          color: {
            $type: 'color',
            $value: {
              light: {
                model: 'hex',
                hex: '#ffffff',
                alpha: 1,
              },
              dark: {
                model: 'rgb',
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0,
              },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myCollection', 'color']));

      if (!tokenState) throw new Error('unreachable');

      expect(() =>
        tokenState.updateModeValue(
          'lighter',
          {
            model: 'hex',
            hex: '#000000',
            alpha: 1,
          },
          { allowModeCreation: true, overrideAliases: false },
        ),
      ).toThrow(
        'Couldn\'t match mode "lighter" on token "myCollection.color" that belongs to collection "myCollection" where modes are: "light", "dark"',
      );
    });

    it("should update the modes of the tokens and throw because it is not matching the collection's mode", () => {
      const tokens: SpecifyDesignTokenFormat = {
        'Text style': {
          'App/Body M': {
            $type: 'textStyle',
            $value: {
              default: {
                font: {
                  family: 'Inter',
                  postScriptName: 'Inter',
                  weight: 'medium',
                  style: 'normal',
                  files: [
                    {
                      url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.woff2',
                      format: 'woff2',
                      provider: 'Specify',
                    },
                    {
                      url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.woff',
                      format: 'woff',
                      provider: 'Specify',
                    },
                    {
                      url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.otf',
                      format: 'otf',
                      provider: 'Specify',
                    },
                    {
                      url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.ttf',
                      format: 'ttf',
                      provider: 'Specify',
                    },
                    {
                      url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.eot',
                      format: 'eot',
                      provider: 'Specify',
                    },
                  ],
                },
                fontSize: {
                  value: 14,
                  unit: 'px',
                },
                color: null,
                fontFeatures: null,
                lineHeight: {
                  value: 20,
                  unit: 'px',
                },
                letterSpacing: {
                  value: 0,
                  unit: '%',
                },
                paragraphSpacing: {
                  value: 20,
                  unit: 'px',
                },
                textAlignHorizontal: null,
                textAlignVertical: null,
                textDecoration: 'none',
                textIndent: {
                  value: 0,
                  unit: 'px',
                },
                textTransform: 'none',
              },
            },
            $description: 'Medium emphasis',
            $extensions: {
              'com.specifyapp.figmaStyles.hangingList': false,
              'com.specifyapp.figmaStyles.leadingTrim': 'NONE',
              'com.specifyapp.figmaStyles.listSpacing': 0,
              'com.specifyapp.figmaStyles.hangingPunctuation': false,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['Text style', 'App/Body M']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          color: {
            model: 'hex',
            hex: '#000000',
            alpha: 1,
          },
        },
        { allowModeCreation: true, overrideAliases: false },
      );

      // @ts-expect-error
      expect(tokenState.value.default).toEqual({
        font: {
          family: 'Inter',
          postScriptName: 'Inter',
          weight: 'medium',
          style: 'normal',
          files: [
            {
              url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.woff2',
              format: 'woff2',
              provider: 'Specify',
            },
            {
              url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.woff',
              format: 'woff',
              provider: 'Specify',
            },
            {
              url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.otf',
              format: 'otf',
              provider: 'Specify',
            },
            {
              url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.ttf',
              format: 'ttf',
              provider: 'Specify',
            },
            {
              url: 'https://ddp-assets-prod.s3.eu-west-1.amazonaws.com/f42e7eec-31d0-4803-b41a-ff221c242cb8/0bbca821-6ce7-4556-be49-c2fc580ccc57/43ab6c08e6abcec4ceafcbadde0fb5a6e06e40642285925f720e75d071bcc7eb.eot',
              format: 'eot',
              provider: 'Specify',
            },
          ],
        },
        fontSize: {
          value: 14,
          unit: 'px',
        },
        color: {
          model: 'hex',
          hex: '#000000',
          alpha: 1,
        },
        fontFeatures: null,
        lineHeight: {
          value: 20,
          unit: 'px',
        },
        letterSpacing: {
          value: 0,
          unit: '%',
        },
        paragraphSpacing: {
          value: 20,
          unit: 'px',
        },
        textAlignHorizontal: null,
        textAlignVertical: null,
        textDecoration: 'none',
        textIndent: {
          value: 0,
          unit: 'px',
        },
        textTransform: 'none',
      });
    });
  });

  describe.concurrent('updateValue - with overriding alias', () => {
    it('should update a deep value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', {
        font: {
          weight: 100,
        },
      });

      expect(engine.renderJSONTree()).toEqual({
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 100,
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the value and the aliases as well', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { $alias: 'middle', $mode: 'default' },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', {
        fontSize: { value: 0, unit: 'px' },
        lineHeight: {
          value: 0,
          unit: 'px',
        },
        letterSpacing: {
          value: 0,
          unit: 'px',
        },
      });

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the alias to another one', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { $alias: 'middle', $mode: 'default' },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', {
        fontSize: { $alias: 'test', $mode: 'mode' },
      });

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { $alias: 'test', $mode: 'mode' },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the value for a null', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', {
        fontSize: { value: 0, unit: 'px' },
        lineHeight: {
          value: 0,
          unit: 'px',
        },
        letterSpacing: {
          value: 0,
          unit: 'px',
        },
        paragraphSpacing: { value: 12, unit: 'px' },
      });

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: { value: 12, unit: 'px' },
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the value for an alias and build the value from the alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { $alias: 'middle', $mode: 'default' },
              lineHeight: null,
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', {
        fontSize: {
          value: 12,
        },
      });

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: {
                $alias: 'deep',
                $mode: 'default',
              },
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              color: null,
              font: {
                family: 'Inter',
                files: [
                  {
                    format: 'ttf',
                    provider: 'Specify',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                  },
                ],
                postScriptName: 'Inter Bold',
                style: 'normal',
                weight: 'bold',
              },
              fontFeatures: null,
              fontSize: {
                unit: 'px',
                value: 12,
              },
              letterSpacing: null,
              lineHeight: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the value for a null and throw because of single value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: null,
              fontFeatures: null,
              letterSpacing: null,
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue('notDefault', {
          lineHeight: {
            value: 12,
          },
        });

        throw new Error('updateValueForMode is supposed to throw');
      } catch (e) {
        const error = e as ZodError;

        expect(error.message.includes('ZodError')).toBeTruthy();
      }
    });

    it('should update an alias value and throw because the type is wrong', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        dimension: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['dimension']));

      if (!tokenState) throw new Error('unreachable');

      try {
        (tokenState as TokenState<'dimension'>).updateModeValue('default', {
          // @ts-expect-error - Supposed to be a number
          value: 'a string',
        });

        throw new Error('updateValueForMode is supposed to throw');
      } catch (e) {
        const error = e as ZodError;

        expect(error.message.includes('ZodError')).toBeTruthy();
      }
    });

    it('should update the value and set a null', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', {
        fontSize: { value: 10, unit: 'px' },
        lineHeight: null,
        letterSpacing: {
          value: 0,
          unit: 'px',
        },
      });

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'number',
          $value: {
            default: 12,
          },
        },
        middle: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'deep', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: null,
              fontSize: { value: 10, unit: 'px' },
              lineHeight: null,
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should not update anything because of an unresolvable alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                $alias: 'does.not.exists',
                $mode: 'mode',
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', {
        font: {
          weight: 100,
        },
      });

      expect(engine.renderJSONTree()).toEqual({
        textStyle: {
          $type: 'textStyle',
          $value: {
            notDefault: {
              font: {
                $alias: 'does.not.exists',
                $mode: 'mode',
              },
              color: null,
              fontSize: { value: 0, unit: 'px' },
              lineHeight: {
                value: 0,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: 0,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the value for a primitive token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        number: {
          $type: 'number',
          $value: { default: 10 },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['number']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', 0);

      expect(engine.renderJSONTree()).toEqual({
        number: {
          $type: 'number',
          $value: { default: 0 },
        },
      });
    });

    it('should update the value with an unresolvable alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        number: {
          $type: 'number',
          $value: { default: 10 },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['number']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { $alias: 'a.path', $mode: 'mode' },
        { overrideAliases: false },
      );

      const result = tokenState
        .getStatefulValueResult()
        .mapTopLevelValue(modeLevel => modeLevel.unwrap())
        .unwrap();

      // @ts-expect-error
      expect(result['default']).toBeInstanceOf(UnresolvableModeLevelAlias);
      expect(engine.renderJSONTree()).toEqual({
        number: {
          $type: 'number',
          $value: { default: { $alias: 'a.path', $mode: 'mode' } },
        },
      });
    });

    it('should update the value with a resolvable alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        a: {
          path: { $type: 'number', $value: { mode: 10 } },
        },
        number: {
          $type: 'number',
          $value: { default: 10 },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['number']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        { $alias: 'a.path', $mode: 'mode' },
        { overrideAliases: false },
      );

      const result = tokenState
        .getStatefulValueResult()
        .mapTopLevelValue(modeLevel => modeLevel.unwrap())
        .unwrap();

      // @ts-expect-error
      expect(result['default']).toBeInstanceOf(ResolvableModeLevelAlias);

      expect(engine.renderJSONTree()).toEqual({
        a: {
          path: { $type: 'number', $value: { mode: 10 } },
        },
        number: {
          $type: 'number',
          $value: { default: { $alias: 'a.path', $mode: 'mode' } },
        },
      });
    });

    it('should update an array', () => {
      const tokens: SpecifyDesignTokenFormat = {
        radii: {
          $type: 'radii',
          $value: { default: [{ value: 10, unit: 'px' }] },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['radii']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', [{ value: 0, unit: 'px' }]);

      expect(engine.renderJSONTree()).toEqual({
        radii: {
          $type: 'radii',
          $value: {
            default: [{ value: 0, unit: 'px' }],
          },
        },
      });
    });

    it('should update an array with an alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        radius: {
          $type: 'radius',
          $value: {
            aMode: { value: 10, unit: 'px' },
          },
        },
        radii: {
          $type: 'radii',
          $value: { default: [{ $alias: 'radius', $mode: 'aMode' }] },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['radii']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', [{ value: 0, unit: 'px' }], {
        overrideAliases: false,
      });

      expect(engine.renderJSONTree()).toEqual({
        radius: {
          $type: 'radius',
          $value: {
            aMode: { value: 0, unit: 'px' },
          },
        },
        radii: {
          $type: 'radii',
          $value: { default: [{ $alias: 'radius', $mode: 'aMode' }] },
        },
      });
    });

    it('should update the color red value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { red: 0 });

      expect(engine.renderJSONTree()).toEqual({
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 0, green: 0, blue: 0, alpha: 1 } },
        },
      });
    });

    it('should throw an error because the property is in the wrong model', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue('default', { hue: 0 });

        throw new Error('Expected error to be thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should update the color model and all the values', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { model: 'hex', hex: '#ffff00' });

      expect(engine.renderJSONTree()).toEqual({
        color: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ffff00', alpha: 1 } },
        },
      });
    });

    it('should throw an error because we change the model of the color but not all the properties are here', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue('default', { model: 'hex', alpha: 1 });

        throw new Error('Expected error to be thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should override a mode level alias for a color', () => {
      const tokens: SpecifyDesignTokenFormat = {
        hex: {
          $type: 'color',
          $value: { notDefault: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        color: {
          $type: 'color',
          $value: { default: { $alias: 'hex', $mode: 'notDefault' } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { alpha: 0.1 });

      expect(engine.renderJSONTree()).toEqual({
        hex: {
          $type: 'color',
          $value: { notDefault: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        color: {
          $type: 'color',
          $value: {
            default: { model: 'hex', hex: '#ff00ff', alpha: 0.1 },
          },
        },
      });
    });

    it('should update the color with a mode level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        hex: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { $alias: 'hex', $mode: 'default' });

      expect(engine.renderJSONTree()).toEqual({
        hex: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        color: {
          $type: 'color',
          $value: {
            default: { $alias: 'hex', $mode: 'default' },
          },
        },
      });
    });

    it('should update the color with an alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        hex: {
          $type: 'hexadecimalColorString',
          $value: { default: '#ff00ff' },
        },
        color: {
          $type: 'color',
          $value: { default: { model: 'rgb', red: 255, green: 0, blue: 0, alpha: 1 } },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', {
        model: 'hex',
        hex: { $alias: 'hex', $mode: 'default' },
        alpha: 0.5,
      });

      expect(engine.renderJSONTree()).toEqual({
        hex: {
          $type: 'hexadecimalColorString',
          $value: { default: '#ff00ff' },
        },
        color: {
          $type: 'color',
          $value: {
            default: { model: 'hex', hex: { $alias: 'hex', $mode: 'default' }, alpha: 0.5 },
          },
        },
      });
    });

    it('should update the color red value of a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { color: { red: 0 } });

      expect(engine.renderJSONTree()).toEqual({
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should remove the alias of a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'color',
          $value: {
            notDefault: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 1,
            },
          },
        },
        intermediate: {
          $type: 'color',
          $value: {
            default: { $alias: 'deep', $mode: 'notDefault' },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                $alias: 'intermediate',
                $mode: 'default',
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { color: { red: 255 } });

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'color',
          $value: {
            notDefault: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 1,
            },
          },
        },
        intermediate: {
          $type: 'color',
          $value: {
            default: { $alias: 'deep', $mode: 'notDefault' },
          },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                alpha: 1,
                blue: 0,
                green: 0,
                model: 'rgb',
                red: 255,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should throw an error because the property is in the wrong model for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue('default', { color: { hue: 0 } });

        throw new Error('Expected error to be thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should update the color model and all the values for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', {
        color: { model: 'hex', hex: '#ffff00' },
        fontSize: { value: 0, unit: 'px' },
      });

      expect(engine.renderJSONTree()).toEqual({
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'hex',
                hex: '#ffff00',
                alpha: 0,
              },
              fontSize: {
                value: 0,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should throw an error because we change the model of the color but not all the properties are here for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue('default', { color: { model: 'hex', alpha: 1 } });

        throw new Error('Expected error to be thrown');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should update the color with an alias for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        hex: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { color: { $alias: 'hex', $mode: 'default' } });

      expect(engine.renderJSONTree()).toEqual({
        hex: {
          $type: 'color',
          $value: { default: { model: 'hex', hex: '#ff00ff', alpha: 1 } },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: { $alias: 'hex', $mode: 'default' },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });
    it('should update the color with an alias for a text style', () => {
      const tokens: SpecifyDesignTokenFormat = {
        hex: {
          $type: 'hexadecimalColorString',
          $value: { default: '#ff00ff' },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 0,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['textStyle']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', {
        color: { model: 'hex', hex: { $alias: 'hex', $mode: 'default' }, alpha: 0.5 },
      });

      expect(engine.renderJSONTree()).toEqual({
        hex: {
          $type: 'hexadecimalColorString',
          $value: { default: '#ff00ff' },
        },
        textStyle: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter Bold',
                weight: 'bold',
                style: 'normal',
                files: [
                  {
                    format: 'ttf',
                    url: 'https://static.specifyapp.com/sdtf-seeds/inter-bold.ttf',
                    provider: 'Specify',
                  },
                ],
              },
              color: {
                model: 'hex',
                hex: { $alias: 'hex', $mode: 'default' },
                alpha: 0.5,
              },
              fontSize: {
                value: 64,
                unit: 'px',
              },
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      });
    });

    it('should update the color hue value of a border', () => {
      const tokens: SpecifyDesignTokenFormat = {
        border: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'groove',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['border']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { color: { hue: 0 } });

      expect(engine.renderJSONTree()).toEqual({
        border: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 0,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'groove',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should update the color red value of a shadow', () => {
      const tokens: SpecifyDesignTokenFormat = {
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 231,
                green: 228,
                blue: 251,
                alpha: 1,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['shadow']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { color: { red: 0 } });

      expect(engine.renderJSONTree()).toEqual({
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 0,
                green: 228,
                blue: 251,
                alpha: 1,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
      });
    });

    it('should update the color red value of a mode level aliased shadow', () => {
      const tokens: SpecifyDesignTokenFormat = {
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 231,
                green: 228,
                blue: 251,
                alpha: 1,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
        shadowAlias: {
          $type: 'shadow',
          $value: {
            notDefault: { $alias: 'shadow', $mode: 'default' },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['shadowAlias']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', { color: { red: 0 } });

      expect(engine.renderJSONTree()).toEqual({
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 231,
                green: 228,
                blue: 251,
                alpha: 1,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
        shadowAlias: {
          $type: 'shadow',
          $value: {
            notDefault: {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 0,
                green: 228,
                blue: 251,
                alpha: 1,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
      });
    });

    it('should update the deep color red value of a shadow', () => {
      const tokens: SpecifyDesignTokenFormat = {
        deep: {
          $type: 'color',
          $value: {
            notDefault: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 1,
            },
          },
        },
        intermediate: {
          $type: 'color',
          $value: {
            default: { $alias: 'deep', $mode: 'notDefault' },
          },
        },
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                $alias: 'intermediate',
                $mode: 'default',
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['shadow']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { color: { red: 255 } });

      expect(engine.renderJSONTree()).toEqual({
        deep: {
          $type: 'color',
          $value: {
            notDefault: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 1,
            },
          },
        },
        intermediate: {
          $type: 'color',
          $value: {
            default: { $alias: 'deep', $mode: 'notDefault' },
          },
        },
        shadow: {
          $type: 'shadow',
          $value: {
            default: {
              type: 'outer',
              color: {
                model: 'rgb',
                red: 255,
                green: 0,
                blue: 0,
                alpha: 1,
              },
              offsetX: {
                value: 0,
                unit: 'px',
              },
              offsetY: {
                value: 0,
                unit: 'px',
              },
              blurRadius: {
                value: 0,
                unit: 'px',
              },
              spreadRadius: {
                value: 3,
                unit: 'px',
              },
            },
          },
        },
      });
    });

    it('should update the color of a gradient', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradient']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { colorStops: [{}, { color: { red: 255 } }] });

      expect(engine.renderJSONTree()).toEqual({
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 255,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
      });
    });

    it('should update the gradient type', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradient']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', {
        type: 'radial',
        position: 'center',
        colorStops: [
          {
            color: {
              model: 'hsb',
              alpha: 0.09,
              hue: 82.14,
              saturation: 54.88,
              brightness: 13.99,
            },
            position: 0,
          },
          {
            color: {
              model: 'hsb',
              alpha: 0.68,
              hue: 102.29,
              saturation: 16.85,
              brightness: 35.93,
            },
            position: 1,
          },
        ],
      });

      expect(engine.renderJSONTree()).toEqual({
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'radial',
              position: 'center',
              colorStops: [
                {
                  color: {
                    model: 'hsb',
                    alpha: 0.09,
                    hue: 82.14,
                    saturation: 54.88,
                    brightness: 13.99,
                  },
                  position: 0,
                },
                {
                  color: {
                    model: 'hsb',
                    alpha: 0.68,
                    hue: 102.29,
                    saturation: 16.85,
                    brightness: 35.93,
                  },
                  position: 1,
                },
              ],
            },
          },
        },
      });
    });

    it("should throw because we change the gradient type but don't provide enough informations", () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradient']));

      if (!tokenState) throw new Error('unreachable');

      try {
        tokenState.updateModeValue('default', {
          type: 'radial',
          position: 'center',
        });

        throw new Error('Supposed to throw');
      } catch (e) {
        expect(e).toBeInstanceOf(ZodError);
      }
    });

    it('should update the color of a gradients', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              {
                type: 'linear',
                angle: 90,
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
              {
                type: 'radial',
                position: 'center',
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradients']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', [
        { colorStops: [{}, { color: { red: 255 } }] },
        { colorStops: [{}, { color: { red: 255 } }] },
      ]);

      expect(engine.renderJSONTree()).toEqual({
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              {
                type: 'linear',
                angle: 90,
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 255,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
              {
                type: 'radial',
                position: 'center',
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 255,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      });
    });

    it('should update the color of an aliased gradient', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            notDefault: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
        gradientAlias: {
          $type: 'gradient',
          $value: {
            default: { $alias: 'gradient', $mode: 'notDefault' },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradientAlias']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', { colorStops: [{}, { color: { red: 255 } }] });

      expect(engine.renderJSONTree()).toEqual({
        gradient: {
          $type: 'gradient',
          $value: {
            notDefault: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
        gradientAlias: {
          $type: 'gradient',
          $value: {
            default: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 255,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
      });
    });

    it('should update the color of a gradients with multiple aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        gradient: {
          $type: 'gradient',
          $value: {
            notDefault: {
              type: 'linear',
              angle: 90,
              colorStops: [
                {
                  position: 0,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 0.5,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
                {
                  position: 1,
                  color: {
                    model: 'rgb',
                    red: 0,
                    green: 228,
                    blue: 251,
                    alpha: 1,
                  },
                },
              ],
            },
          },
        },
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              { $alias: 'gradient', $mode: 'notDefault' },
              {
                type: 'radial',
                position: 'center',
                colorStops: [
                  {
                    position: 0,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 0.5,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                  {
                    position: 1,
                    color: {
                      model: 'rgb',
                      red: 0,
                      green: 228,
                      blue: 251,
                      alpha: 1,
                    },
                  },
                ],
              },
            ],
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['gradients']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', [
        { colorStops: [{}, { color: { red: 255 } }] },
        { colorStops: [{}, { color: { red: 255 } }] },
      ]);

      expect(engine.renderJSONTree()).toEqual({
        gradient: {
          $type: 'gradient',
          $value: {
            notDefault: {
              angle: 90,
              colorStops: [
                {
                  color: {
                    alpha: 1,
                    blue: 251,
                    green: 228,
                    model: 'rgb',
                    red: 0,
                  },
                  position: 0,
                },
                {
                  color: {
                    alpha: 1,
                    blue: 251,
                    green: 228,
                    model: 'rgb',
                    red: 0,
                  },
                  position: 0.5,
                },
                {
                  color: {
                    alpha: 1,
                    blue: 251,
                    green: 228,
                    model: 'rgb',
                    red: 0,
                  },
                  position: 1,
                },
              ],
              type: 'linear',
            },
          },
        },
        gradients: {
          $type: 'gradients',
          $value: {
            default: [
              {
                angle: 90,
                colorStops: [
                  {
                    color: {
                      alpha: 1,
                      blue: 251,
                      green: 228,
                      model: 'rgb',
                      red: 0,
                    },
                    position: 0,
                  },
                  {
                    color: {
                      alpha: 1,
                      blue: 251,
                      green: 228,
                      model: 'rgb',
                      red: 255,
                    },
                    position: 0.5,
                  },
                  {
                    color: {
                      alpha: 1,
                      blue: 251,
                      green: 228,
                      model: 'rgb',
                      red: 0,
                    },
                    position: 1,
                  },
                ],
                type: 'linear',
              },
              {
                colorStops: [
                  {
                    color: {
                      alpha: 1,
                      blue: 251,
                      green: 228,
                      model: 'rgb',
                      red: 0,
                    },
                    position: 0,
                  },
                  {
                    color: {
                      alpha: 1,
                      blue: 251,
                      green: 228,
                      model: 'rgb',
                      red: 255,
                    },
                    position: 0.5,
                  },
                  {
                    color: {
                      alpha: 1,
                      blue: 251,
                      green: 228,
                      model: 'rgb',
                      red: 0,
                    },
                    position: 1,
                  },
                ],
                position: 'center',
                type: 'radial',
              },
            ],
          },
        },
      });
    });

    it('should update the color of a shadows', () => {
      const tokens: SpecifyDesignTokenFormat = {
        shadows: {
          $type: 'shadows',
          $value: {
            default: [
              {
                type: 'outer',
                color: {
                  model: 'rgb',
                  red: 0,
                  green: 0,
                  blue: 0,
                  alpha: 0.02,
                },
                offsetX: {
                  value: 0,
                  unit: 'px',
                },
                offsetY: {
                  value: 1,
                  unit: 'px',
                },
                blurRadius: {
                  value: 2,
                  unit: 'px',
                },
                spreadRadius: {
                  value: 0,
                  unit: 'px',
                },
              },
              {
                type: 'outer',
                color: {
                  model: 'rgb',
                  red: 0,
                  green: 0,
                  blue: 0,
                  alpha: 0.04,
                },
                offsetX: {
                  value: 0,
                  unit: 'px',
                },
                offsetY: {
                  value: 2,
                  unit: 'px',
                },
                blurRadius: {
                  value: 2,
                  unit: 'px',
                },
                spreadRadius: {
                  value: 0,
                  unit: 'px',
                },
              },
            ],
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['shadows']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', [
        { color: { red: 255 }, offsetY: { value: 0 } },
        { color: { red: 255 }, offsetX: { value: 10 } },
      ]);

      expect(engine.renderJSONTree()).toEqual({
        shadows: {
          $type: 'shadows',
          $value: {
            default: [
              {
                type: 'outer',
                color: {
                  model: 'rgb',
                  red: 255,
                  green: 0,
                  blue: 0,
                  alpha: 0.02,
                },
                offsetX: {
                  value: 0,
                  unit: 'px',
                },
                offsetY: {
                  value: 0,
                  unit: 'px',
                },
                blurRadius: {
                  value: 2,
                  unit: 'px',
                },
                spreadRadius: {
                  value: 0,
                  unit: 'px',
                },
              },
              {
                type: 'outer',
                color: {
                  model: 'rgb',
                  red: 255,
                  green: 0,
                  blue: 0,
                  alpha: 0.04,
                },
                offsetX: {
                  value: 10,
                  unit: 'px',
                },
                offsetY: {
                  value: 2,
                  unit: 'px',
                },
                blurRadius: {
                  value: 2,
                  unit: 'px',
                },
                spreadRadius: {
                  value: 0,
                  unit: 'px',
                },
              },
            ],
          },
        },
      });
    });

    it('should update the timing function of a transition to a steps timing function', () => {
      const tokens: SpecifyDesignTokenFormat = {
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: [0.20282747403427392, -1, 0.9697411674570271, -1],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['transition']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', {
        timingFunction: {
          stepsCount: 10,
          jumpTerm: 'jump-end',
        },
      });

      expect(engine.renderJSONTree()).toEqual({
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: {
                stepsCount: 10,
                jumpTerm: 'jump-end',
              },
            },
          },
        },
      });
    });

    it('should update the timing function of a transition and set another value for the cubic bezier', () => {
      const tokens: SpecifyDesignTokenFormat = {
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: [0.20282747403427392, -1, 0.9697411674570271, -1],
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['transition']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', {
        timingFunction: [0],
      });

      expect(engine.renderJSONTree()).toEqual({
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: [0, -1, 0.9697411674570271, -1],
            },
          },
        },
      });
    });

    it('should update the timing function of a transition and set another value for the deep alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        cubicBezier: { $type: 'cubicBezier', $value: { notDefault: [0, 1, 0, 1] } },
        cubicBezierAlias: {
          $type: 'cubicBezier',
          $value: { default: { $mode: 'notDefault', $alias: 'cubicBezier' } },
        },
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: { $alias: 'cubicBezierAlias', $mode: 'default' },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['transition']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('default', {
        timingFunction: [1],
      });

      expect(engine.renderJSONTree()).toEqual({
        cubicBezier: { $type: 'cubicBezier', $value: { notDefault: [0, 1, 0, 1] } },
        cubicBezierAlias: {
          $type: 'cubicBezier',
          $value: { default: { $mode: 'notDefault', $alias: 'cubicBezier' } },
        },
        transition: {
          $type: 'transition',
          $value: {
            default: {
              duration: {
                value: 250,
                unit: 'ms',
              },
              delay: {
                value: 125,
                unit: 'ms',
              },
              timingFunction: [1, 1, 0, 1],
            },
          },
        },
      });
    });

    it('should update the value without touching to the other mode', () => {
      const tokens: SpecifyDesignTokenFormat = {
        color: {
          $type: 'color',
          $value: {
            light: {
              model: 'hex',
              hex: '#ffffff',
              alpha: 1,
            },
            dark: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('light', {
        hex: '#000000',
      });

      expect(engine.renderJSONTree()).toEqual({
        color: {
          $type: 'color',
          $value: {
            light: {
              model: 'hex',
              hex: '#000000',
              alpha: 1,
            },
            dark: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0,
            },
          },
        },
      });
    });

    it('should update the value without touching to the other mode and override the alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        group: {
          nested: {
            color: {
              $type: 'color',
              $value: { default: { model: 'rgb', red: 0, green: 255, blue: 255, alpha: 1 } },
            },
          },
        },
        color: {
          $type: 'color',
          $value: {
            light: {
              $alias: 'group.nested.color',
              $mode: 'default',
            },
            dark: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['color']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('light', {
        red: 255,
      });

      expect(engine.renderJSONTree()).toEqual({
        group: {
          nested: {
            color: {
              $type: 'color',
              $value: { default: { model: 'rgb', red: 0, green: 255, blue: 255, alpha: 1 } },
            },
          },
        },
        color: {
          $type: 'color',
          $value: {
            light: {
              model: 'rgb',
              red: 255,
              green: 255,
              blue: 255,
              alpha: 1,
            },
            dark: {
              model: 'rgb',
              red: 0,
              green: 0,
              blue: 0,
              alpha: 0,
            },
          },
        },
      });
    });

    it('should change the style of a border for a string', () => {
      const tokens: SpecifyDesignTokenFormat = {
        border: {
          $type: 'border',
          $value: {
            notDefault: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'groove',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['border']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', { style: 'dashed' });

      expect(engine.renderJSONTree()).toEqual({
        border: {
          $type: 'border',
          $value: {
            notDefault: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'dashed',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should change the style of a border for an object', () => {
      const tokens: SpecifyDesignTokenFormat = {
        border: {
          $type: 'border',
          $value: {
            notDefault: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'dashed',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['border']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue('notDefault', {
        style: { dashArray: [{ value: 12, unit: 'px' }], lineCap: 'butt' },
      });

      expect(engine.renderJSONTree()).toEqual({
        border: {
          $type: 'border',
          $value: {
            notDefault: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: { dashArray: [{ value: 12, unit: 'px' }], lineCap: 'butt' },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it("should update the modes of the tokens and throw because it is not matching the collection's mode", () => {
      const tokens: SpecifyDesignTokenFormat = {
        myCollection: {
          $collection: { $modes: ['light', 'dark'] },
          color: {
            $type: 'color',
            $value: {
              light: {
                model: 'hex',
                hex: '#ffffff',
                alpha: 1,
              },
              dark: {
                model: 'rgb',
                red: 0,
                green: 0,
                blue: 0,
                alpha: 0,
              },
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myCollection', 'color']));

      if (!tokenState) throw new Error('unreachable');

      expect(() =>
        tokenState.updateModeValue(
          'lighter',
          {
            model: 'hex',
            hex: '#000000',
            alpha: 1,
          },
          { allowModeCreation: true },
        ),
      ).toThrow(
        'Couldn\'t match mode "lighter" on token "myCollection.color" that belongs to collection "myCollection" where modes are: "light", "dark"',
      );
    });

    it('should update the style of a border token with an alias inside for an object', () => {
      const tokens: SpecifyDesignTokenFormat = {
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: {
              lineCap: 'square',
              dashArray: [{ value: 12, unit: 'px' }],
            },
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                $alias: 'borderStyle',
                $mode: 'default',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myBorder']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          style: {
            lineCap: 'round',
            dashArray: [
              {
                value: 24,
                unit: 'px',
              },
            ],
          },
        },
        { allowModeCreation: true, overrideAliases: true },
      );

      expect(engine.renderJSONTree()).toEqual({
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: {
              lineCap: 'square',
              dashArray: [{ value: 12, unit: 'px' }],
            },
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                lineCap: 'round',
                dashArray: [
                  {
                    value: 24,
                    unit: 'px',
                  },
                ],
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should update the style of a border token with an alias inside for a string', () => {
      const tokens: SpecifyDesignTokenFormat = {
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: 'solid',
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                $alias: 'borderStyle',
                $mode: 'default',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myBorder']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          style: 'dotted',
        },
        { allowModeCreation: true, overrideAliases: true },
      );

      expect(engine.renderJSONTree()).toEqual({
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: 'solid',
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: 'dotted',
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should update the style of a border token with an alias inside for a string and an object', () => {
      const tokens: SpecifyDesignTokenFormat = {
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: 'solid',
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                $alias: 'borderStyle',
                $mode: 'default',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myBorder']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          style: {
            lineCap: 'round',
            dashArray: [
              {
                value: 24,
                unit: 'px',
              },
            ],
          },
        },
        { allowModeCreation: true, overrideAliases: true },
      );

      expect(engine.renderJSONTree()).toEqual({
        borderStyle: {
          $type: 'borderStyle',
          $value: {
            default: 'solid',
          },
        },
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                dashArray: [
                  {
                    unit: 'px',
                    value: 24,
                  },
                ],
                lineCap: 'round',
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });

    it('should update the style object of a border token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                lineCap: 'round',
                dashArray: [
                  {
                    value: 12,
                    unit: 'px',
                  },
                ],
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      };

      const engine = createSDTFEngine(tokens);
      const tokenState = engine.query.getTokenState(new TreePath(['myBorder']));

      if (!tokenState) throw new Error('unreachable');

      tokenState.updateModeValue(
        'default',
        {
          style: {
            lineCap: 'square',
            dashArray: [
              {
                value: 24,
                unit: 'px',
              },
            ],
          },
        },
        { allowModeCreation: true, overrideAliases: true },
      );

      expect(engine.renderJSONTree()).toEqual({
        myBorder: {
          $type: 'border',
          $value: {
            default: {
              color: {
                model: 'hsb',
                alpha: 0.05,
                hue: 37.28,
                saturation: 4.85,
                brightness: 77.96,
              },
              style: {
                lineCap: 'square',
                dashArray: [
                  {
                    value: 24,
                    unit: 'px',
                  },
                ],
              },
              width: {
                value: 7,
                unit: 'px',
              },
              rectangleCornerRadii: null,
            },
          },
        },
      });
    });
  });

  describe.concurrent('updateValue', () => {
    it('should update the value of a string TokenState with default options', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'string',
          $value: {
            default: 'aString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.modesResolvability).toStrictEqual({ default: true });

      const updatedValue = {
        en: 'anotherString',
        fr: 'uneAutreChaine',
      };

      tokenState.updateValue(updatedValue);

      expect(tokenState.value).toEqual(updatedValue);
      expect(tokenState.isFullyResolvable).toBe(true);
      expect(tokenState.modesResolvability).toStrictEqual({ en: true, fr: true });
    });
    it('should update the value of a raw token to a top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { en: 'aFutureAlias', fr: 'unFuturAlias' } },
        aStringAlias: {
          $type: 'string',
          $value: { default: 'aFutureAlias' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const updatedValue = {
        $alias: 'aString',
      };
      expect(() => tokenState.updateValue(updatedValue)).toThrow(
        "Can't update a value with a top level alias",
      );
    });
    it('should throw because of a top level alias ', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aString' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const beforeAliasReferences = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });

      expect(beforeAliasReferences).toEqual([
        {
          isResolvable: true,
          from: {
            mode: null,
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
          },
          to: { mode: null, treePath: new TreePath(['aString']) },
        },
      ]);

      const updatedValue = {
        fr: 'unAncienAlias',
        en: 'anOldAlias',
      };
      expect(() => tokenState.updateValue(updatedValue)).toThrow();
    });

    it('should update the value of a raw token to a mode level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: { default: 'aFutureAlias' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const updatedValue = {
        default: { $alias: 'aString', $mode: 'default' },
      };
      tokenState.updateValue(updatedValue);
      expect(tokenState.value).toEqual(updatedValue);
      expect(tokenState.isTopLevelAlias).toBe(false);
      expect(tokenState.isFullyResolvable).toBe(true);
      expect(tokenState.modesResolvability).toStrictEqual({ default: true });

      const results = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });

      expect(results).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
            mode: 'default',
          },
          to: { treePath: new TreePath(['aString']), mode: 'default' },
        },
      ]);
    });
    it('should update the value of a mode level alias to a raw token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: { default: { $alias: 'aString', $mode: 'default' } },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const beforeAliasReferences = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });

      expect(beforeAliasReferences).toEqual([
        {
          isResolvable: true,
          from: {
            mode: 'default',
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
          },
          to: { mode: 'default', treePath: new TreePath(['aString']) },
        },
      ]);

      const updatedValue = {
        default: 'aPreviousAlias',
      };
      tokenState.updateValue(updatedValue);

      expect(tokenState.value).toEqual(updatedValue);
      expect(tokenState.isTopLevelAlias).toBe(false);
      expect(tokenState.isFullyResolvable).toBe(true);
      expect(tokenState.modesResolvability).toStrictEqual({ default: true });

      const aliasReferences = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });

      expect(aliasReferences).toEqual([]);
    });
    it('should update the value of a raw token to both resolvable and unresolvable aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: { default: 'aFutureAlias' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const updatedValue = {
        default: { $alias: 'aString', $mode: 'default' },
        custom: { $alias: 'anotherString', $mode: 'default' },
      };

      tokenState.updateValue(updatedValue);

      expect(tokenState.value).toEqual(updatedValue);
      expect(tokenState.isTopLevelAlias).toBe(false);
      expect(tokenState.isFullyResolvable).toBe(false);
      expect(tokenState.modesResolvability).toStrictEqual({
        default: true,
        custom: false,
      });

      const results = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });

      expect(results).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
            mode: 'default',
          },
          to: { treePath: new TreePath(['aString']), mode: 'default' },
        },
        {
          isResolvable: false,
          reason: 'Token at path "anotherString" with mode "default" does not exist',
          from: {
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
            mode: 'custom',
          },
          to: { treePath: new TreePath(['anotherString']), mode: 'default' },
        },
      ]);
    });
    it('should fail updating the value when the value is not a valid token value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const updatedValue = {
        default: 123,
      };
      expect(() => {
        tokenState.updateValue(updatedValue);
      }).toThrow();
    });
  });
  describe.concurrent('resolveValueAliases', () => {
    it('should  throw because of a top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aStringSource: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aStringSource' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => tokenState.resolveValueAliases()).toThrow(
        "Can't update a value for a top level alias",
      );
    });
    it('should resolve a mode level alias string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString', customMode: 'anotherString' } },
        aStringAlias: {
          $type: 'string',
          $value: {
            aliasMode: {
              $alias: 'aString',
              $mode: 'customMode',
            },
            rawMode: 'aRawString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.resolveValueAliases();

      expect(tokenState.value).toEqual({
        rawMode: 'aRawString',
        aliasMode: 'anotherString',
      });
    });
    it('should resolve a value level alias dimension TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: { $type: 'number', $value: { default: 12 } },
        aDimension: {
          $type: 'dimension',
          $value: {
            large: {
              unit: 'px',
              value: { $alias: 'aNumber', $mode: 'default' },
            },
            small: { unit: 'px', value: 4 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.resolveValueAliases();

      expect(tokenState.value).toEqual({
        large: {
          unit: 'px',
          value: 12,
        },
        small: { unit: 'px', value: 4 },
      });
    });
    it('should resolve a value of radii composed of radius value level aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: { $type: 'number', $value: { small: 12, large: 24 } },
        aRadius: {
          $type: 'radius',
          $value: {
            small: {
              unit: 'px',
              value: { $alias: 'aNumber', $mode: 'small' },
            },
            large: {
              unit: 'px',
              value: { $alias: 'aNumber', $mode: 'large' },
            },
          },
        },
        aReference: {
          $type: 'radii',
          $value: {
            small: [
              { $alias: 'aRadius', $mode: 'small' },
              { $alias: 'aRadius', $mode: 'small' },
            ],
            large: [
              { $alias: 'aRadius', $mode: 'large' },
              { $alias: 'aRadius', $mode: 'large' },
            ],
          },
        },
        aRadii: {
          $type: 'radii',
          $value: {
            small: [
              { $alias: 'aRadius', $mode: 'small' },
              { $alias: 'aRadius', $mode: 'small' },
            ],
            medium: [
              { value: 16, unit: 'px' },
              { value: 16, unit: 'px' },
            ],
            large: { $alias: 'aReference', $mode: 'large' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aRadii']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.resolveValueAliases();

      expect(tokenState.value).toStrictEqual({
        medium: [
          { value: 16, unit: 'px' },
          { value: 16, unit: 'px' },
        ],
        small: [
          { unit: 'px', value: 12 },
          { unit: 'px', value: 12 },
        ],
        large: [
          { unit: 'px', value: 24 },
          { unit: 'px', value: 24 },
        ],
      });
    });
    it('should resolve a top level alias composed of mode and value level aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: {
          $type: 'number',
          $value: {
            small: 12,
            medium: 16,
          },
        },
        aLargeValueOnly: {
          $type: 'number',
          $value: {
            default: 22,
          },
        },
        anExtraLargeValueOnly: {
          $type: 'number',
          $value: {
            extraLarge: 30,
          },
        },
        mediumDimension: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: { $alias: 'aNumber', $mode: 'medium' },
            },
          },
        },
        aReference: {
          $type: 'dimension',
          $value: {
            xSmall: {
              unit: 'px',
              value: 8,
            },
            small: {
              unit: 'px',
              value: { $alias: 'aNumber', $mode: 'small' },
            },
            medium: { $alias: 'mediumDimension', $mode: 'default' },
            large: {
              unit: 'px',
              value: { $alias: 'aLargeValueOnly', $mode: 'default' },
            },
            xLarge: {
              unit: 'px',
              value: { $alias: 'anExtraLargeValueOnly', $mode: 'extraLarge' },
            },
          },
        },
        aDimension: {
          $type: 'dimension',
          $value: {
            xSmall: {
              $alias: 'aReference',
              $mode: 'xSmall',
            },
            small: {
              $alias: 'aReference',
              $mode: 'small',
            },
            medium: {
              $alias: 'aReference',
              $mode: 'medium',
            },
            large: {
              $alias: 'aReference',
              $mode: 'large',
            },
            xLarge: {
              $alias: 'aReference',
              $mode: 'xLarge',
            },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.resolveValueAliases();

      expect(tokenState.value).toEqual({
        large: {
          unit: 'px',
          value: 22,
        },
        medium: {
          unit: 'px',
          value: 16,
        },
        small: {
          unit: 'px',
          value: 12,
        },
        xLarge: {
          unit: 'px',
          value: 30,
        },
        xSmall: {
          unit: 'px',
          value: 8,
        },
      });
    });
  });
  describe.concurrent('updateModeValue', () => {
    it('should update the mode value of a raw token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaîne' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const updatedValue = 'an updated string';
      tokenState.updateModeValue('en', updatedValue);
      expect(tokenState.value).toStrictEqual({
        en: updatedValue,
        fr: 'une chaîne',
      });
    });
    it('should update the mode value of a token with mode level aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: {
            raw: 'a raw string',
            aliased: { $alias: 'aString', $mode: 'default' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const updatedValue = 'an updated string';
      tokenState.updateModeValue('aliased', updatedValue);

      expect(tokenState.value).toStrictEqual({
        raw: 'a raw string',
        aliased: updatedValue,
      });
      expect(tokenState.modes).toStrictEqual(['aliased', 'raw']);
      expect(tokenState.modesResolvability).toStrictEqual({ raw: true, aliased: true });

      const references = treeState.getAllAliasReferences();

      expect(references).toEqual([]);
    });
    it('should fail updating the mode value when is a top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aString' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.updateModeValue('default', 'aPreviousAlias');
      }).toThrow("Can't update a value for a top level alias");
    });
    it('should fail updating the mode value when the given mode does not exists', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => tokenState.updateModeValue('invalidMode', 'aPreviousAlias')).toThrow(
        'Mode "invalidMode" does not exist in token "aString"',
      );
    });

    it('should update the mode value when the given mode does not exists with the allow mode creation option', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.updateModeValue('invalidMode', 'aPreviousAlias', { allowModeCreation: true });
      expect(tokenState.value).toEqual({ default: 'aString', invalidMode: 'aPreviousAlias' });
    });
    it('should update the mode value when a color in a textStyle is null', () => {
      const tokens: SpecifyDesignTokenFormat = {
        foo: {
          $type: 'textStyle',
          $value: {
            default: {
              font: {
                family: 'Inter',
                postScriptName: 'Inter-Regular',
                weight: 400,
                style: 'normal',
                files: [],
              },
              fontSize: {
                unit: 'px',
                value: 8,
              },
              color: null,
              lineHeight: {
                value: 64,
                unit: 'px',
              },
              fontFeatures: null,
              letterSpacing: {
                value: -1,
                unit: 'px',
              },
              paragraphSpacing: null,
              textAlignHorizontal: null,
              textAlignVertical: null,
              textDecoration: null,
              textIndent: null,
              textTransform: null,
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['foo']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const updatedValue = {
        color: null,
        fontSize: {
          unit: null,
          value: 12,
        },
      };
      tokenState.updateModeValue('default', updatedValue);
      expect(tokenState.value).toStrictEqual({
        default: {
          font: {
            family: 'Inter',
            postScriptName: 'Inter-Regular',
            weight: 400,
            style: 'normal',
            files: [],
          },
          lineHeight: {
            value: 64,
            unit: 'px',
          },
          fontFeatures: null,
          letterSpacing: {
            value: -1,
            unit: 'px',
          },
          paragraphSpacing: null,
          textAlignHorizontal: null,
          textAlignVertical: null,
          textDecoration: null,
          textIndent: null,
          textTransform: null,
          ...updatedValue,
        },
      });
    });
  });
  describe.concurrent('createModeValue', () => {
    it('should create a mode value of a raw token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { fr: 'une chaîne' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      const enValue = 'an updated string';
      tokenState.createModeValue('en', enValue);

      expect(tokenState.value).toStrictEqual({
        en: enValue,
        fr: 'une chaîne',
      });
      expect(tokenState.modes).toStrictEqual(['en', 'fr']);
      expect(tokenState.modesResolvability).toStrictEqual({ en: true, fr: true });
    });
    it('should create a mode value pointing to an unresolvable alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: {
            raw: 'a raw string',
            default: { $alias: 'aString', $mode: 'default' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.createModeValue('custom', {
        $alias: 'anUndefinedString',
        $mode: 'default',
      });

      expect(tokenState.value).toStrictEqual({
        raw: 'a raw string',
        default: { $alias: 'aString', $mode: 'default' },
        custom: { $alias: 'anUndefinedString', $mode: 'default' },
      });
      expect(tokenState.isTopLevelAlias).toBe(false);
      expect(tokenState.isFullyResolvable).toBe(false);
      expect(tokenState.modesResolvability).toStrictEqual({
        raw: true,
        default: true,
        custom: false,
      });

      const results = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aStringAlias']),
      });

      expect(results).toEqual([
        {
          isResolvable: true,
          from: {
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
            mode: 'default',
          },
          to: { treePath: new TreePath(['aString']), mode: 'default' },
        },
        {
          isResolvable: false,
          reason: 'Token at path "anUndefinedString" with mode "default" does not exist',
          from: {
            treePath: new TreePath(['aStringAlias']),
            valuePath: new ValuePath([]),
            mode: 'custom',
          },
          to: { treePath: new TreePath(['anUndefinedString']), mode: 'default' },
        },
      ]);
    });
    it('should fail creating the mode value when is a top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aString' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.createModeValue('default', 'aValue');
      }).toThrow('Cannot create a mode on a top level alias: "aStringAlias"');
    });
    it('should fail creating the mode value when the given mode already exists', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.createModeValue('default', 'aValue');
      }).toThrow('Mode "default" already exists in token "aString"');
    });
    it('should fail creating the mode value when the token belongs to a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default'] },
          aString: {
            $type: 'string',
            $value: { default: 'aString' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aCollection', 'aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.createModeValue('custom', 'aValue');
      }).toThrow(
        'Cannot create mode "custom" on token "aCollection.aString" that belongs to collection "aCollection" where modes are: "default"',
      );
    });
  });
  describe.concurrent('deleteModeValue', () => {
    it('should delete the mode value of a raw token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaîne' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.deleteModeValue('en');
      expect(tokenState.modes).toStrictEqual(['fr']);
      expect(tokenState.value).toStrictEqual({
        fr: 'une chaîne',
      });
    });
    it('should delete the mode value of a mode level alias token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { en: 'aString', de: 'aGermanString' } },
        aLocalization: {
          $type: 'string',
          $value: {
            en: { $alias: 'aString', $mode: 'en' },
            de: { $alias: 'aString', $mode: 'de' },
            fr: 'une chaîne',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aLocalization']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.deleteModeValue('en');

      expect(tokenState.modes).toStrictEqual(['de', 'fr']);
      expect(tokenState.value).toStrictEqual({
        fr: 'une chaîne',
        de: { $alias: 'aString', $mode: 'de' },
      });

      const aliasReferences = treeState.getAliasReferencesFrom({
        treePath: new TreePath(['aLocalization']),
      });
      expect(aliasReferences).toStrictEqual([
        {
          from: {
            mode: 'de',
            treePath: new TreePath(['aLocalization']),
            valuePath: new ValuePath([]),
          },
          isResolvable: true,
          to: {
            mode: 'de',
            treePath: new TreePath(['aString']),
          },
        },
      ]);
    });
    it('should fail deleting the mode value when is a top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
        aStringAlias: {
          $type: 'string',
          $value: { $alias: 'aString' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.deleteModeValue('default');
      }).toThrow('Cannot delete a mode on a top level alias: "aStringAlias"');
    });
    it('should fail deleting the mode value when the given mode does not exists', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.deleteModeValue('invalidMode');
      }).toThrow('Mode "invalidMode" does not exist in token "aString"');
    });
    it('should fail deleting the last mode of a token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: { $type: 'string', $value: { default: 'aString' } },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.deleteModeValue('default');
      }).toThrow('Cannot delete the last mode of a token: "aString"');
    });
    it('should fail deleting the mode value when the token belongs to a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['default', 'custom'] },
          aString: {
            $type: 'string',
            $value: { default: 'aString', custom: 'aCustomString' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aCollection', 'aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.deleteModeValue('custom');
      }).toThrow(
        'Cannot delete mode "custom" on token "aCollection.aString" that belongs to collection "aCollection" where modes are: "default", "custom"',
      );
    });
  });
  describe.concurrent('move', () => {
    it('should move a token at the root level', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aToken: {
            $type: 'string',
            $value: { default: 'aString' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aGroup', 'aToken']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.move(TreePath.empty());

      expect(tokenState.path.length).toEqual(1);
      expect(tokenState.path.at(0)).toEqual('aToken');
    });
    it('should move a token between groups', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aToken: {
            $type: 'string',
            $value: { en: 'a string' },
          },
        },
        bGroup: {},
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aGroup', 'aToken']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      tokenState.move(new TreePath(['bGroup']));

      expect(tokenState.path.length).toEqual(2);
      expect(tokenState.path).toEqual(new TreePath(['bGroup', 'aToken']));
    });
    it("should fail when the target group doesn't exist", () => {
      const tokens: SpecifyDesignTokenFormat = {
        aGroup: {
          aToken: {
            $type: 'string',
            $value: { en: 'a string' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aGroup', 'aToken']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.move(new TreePath(['bGroup']));
      }).toThrow('Node "bGroup" does not exist.');
    });
    it('should update top level aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aToken: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaîne' },
        },
        aGroup: {
          bToken: {
            $type: 'string',
            $value: { $alias: 'aToken' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const state = treeState.getTokenState(new TreePath(['aToken']));
      if (!state) throw new Error('Token state is unresolvable');

      state.move(new TreePath(['aGroup']));

      expect(state.path).toEqual(new TreePath(['aGroup', 'aToken']));

      const newState = treeState.getTokenState(new TreePath(['aGroup', 'bToken']));
      if (!newState) throw new Error('Token state is unresolvable');
      expect(newState.value).toEqual({
        $alias: 'aGroup.aToken',
      });
    });
    it('should update mode level aliases', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aToken: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaîne' },
        },
        aGroup: {
          bToken: {
            $type: 'string',
            $value: {
              mode1: 'random string',
              mode2: {
                $alias: 'aToken',
                $mode: 'en',
              },
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const aTokenState = treeState.getTokenState(new TreePath(['aToken']));
      if (!aTokenState) throw new Error('Token state is unresolvable');

      aTokenState.move(new TreePath(['aGroup']));

      expect(aTokenState.path).toEqual(new TreePath(['aGroup', 'aToken']));

      const bTokenState = treeState.getTokenState(new TreePath(['aGroup', 'bToken']));
      if (!bTokenState) throw new Error('Token state is unresolvable');

      expect(bTokenState.value).toEqual({
        mode1: 'random string',
        mode2: {
          $alias: 'aGroup.aToken',
          $mode: 'en',
        },
      });
    });
    it('should move a token from a collection to a group', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
          aToken: {
            $type: 'string',
            $value: { en: 'a string', fr: 'une chaîne' },
          },
        },
        aGroup: {},
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const aTokenState = treeState.getTokenState(new TreePath(['aCollection', 'aToken']));
      if (!aTokenState) throw new Error('Token state is unresolvable');

      aTokenState.move(new TreePath(['aGroup']));

      expect(aTokenState.path).toEqual(new TreePath(['aGroup', 'aToken']));
    });
    it('should move a token from a group to a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
        },
        aGroup: {
          aToken: {
            $type: 'string',
            $value: { en: 'a string', fr: 'une chaîne' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);
      const aTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aToken']));
      if (!aTokenState) throw new Error('Token state is unresolvable');

      aTokenState.move(new TreePath(['aCollection']));
      expect(aTokenState.path).toEqual(new TreePath(['aCollection', 'aToken']));
    });
    it('should fail when a token moved to a collection missed modes', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
        },
        aGroup: {
          aToken: {
            $type: 'string',
            $value: { fr: 'une chaîne' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);
      const aTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aToken']));
      if (!aTokenState) throw new Error('Token state is unresolvable');

      expect(() => aTokenState.move(new TreePath(['aCollection']))).toThrow(
        'Token "aGroup.aToken" has modes "fr" but is used in the collection "aCollection" defining modes "en,fr"',
      );
    });
    it('should fail when a unresolvable top level alias move to a collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['small', 'large'] },
        },
        anUnresolvableToken: {
          $type: 'dimension',
          $value: { $alias: 'undefinedToken' },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);
      const aTokenState = treeState.getTokenState(new TreePath(['anUnresolvableToken']));
      if (!aTokenState) throw new Error('Token state is unresolvable');

      expect(() => aTokenState.move(new TreePath(['aCollection']))).toThrow(
        'Modes of token "anUnresolvableToken" cannot be computed since it points to an unresolvable token but is used in the collection "aCollection" defining modes "small,large"',
      );
    });
    it('should move a token from a group to a another group in collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['en', 'fr'] },
          aGroupInACollection: {},
        },
        aGroup: {
          aToken: {
            $type: 'string',
            $value: { en: 'a string', fr: 'une chaîne' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);
      const aTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aToken']));
      if (!aTokenState) throw new Error('Token state is unresolvable');

      aTokenState.move(new TreePath(['aCollection', 'aGroupInACollection']));
      expect(aTokenState.path).toEqual(
        new TreePath(['aCollection', 'aGroupInACollection', 'aToken']),
      );
    });
    it('should fail to move a token from a group to a another group in collection', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aCollection: {
          $collection: { $modes: ['fr'] },
          aGroupInACollection: {},
        },
        aGroup: {
          aToken: {
            $type: 'string',
            $value: { en: 'a string', fr: 'une chaîne' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);
      const aTokenState = treeState.getTokenState(new TreePath(['aGroup', 'aToken']));
      if (!aTokenState) throw new Error('Token state is unresolvable');

      expect(() => aTokenState.move(new TreePath(['aCollection', 'aGroupInACollection']))).toThrow(
        'Token "aGroup.aToken" has modes "en,fr" but is used in the collection "aCollection" defining modes "fr"',
      );
    });
    it('should fail to move a token if the target path is a token', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aToken: {
          $type: 'string',
          $value: { en: 'a string', fr: 'une chaîne' },
        },
        aGroup: {
          aToken: {
            $type: 'number',
            $value: { default: 8 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const tokenState = treeState.getTokenState(new TreePath(['aGroup', 'aToken']));

      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => tokenState.move(new TreePath([]))).toThrow('Path "aToken" is already taken.');
    });
  });

  describe.concurrent('getJSONValue', () => {
    it('should return the JSON value of a string TokenState with default options', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: {
            default: 'aString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getJSONValue()).toEqual({
        default: 'aString',
      });
    });
    it('should return the resolved JSON value of a string TokenState with default options', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aReference: { $type: 'string', $value: { default: 'aString' } },
        aString: {
          $type: 'string',
          $value: { $alias: 'aReference' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getJSONValue()).toEqual({
        default: 'aString',
      });
    });
    it('should return the initial JSON value of an aliased string TokenState with resolveAliases: false options', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aReference: { $type: 'string', $value: { default: 'aString' } },
        aString: {
          $type: 'string',
          $value: { $alias: 'aReference' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(
        tokenState.getJSONValue({
          resolveAliases: false,
        }),
      ).toEqual({ $alias: 'aReference' });
    });
    it('should return the JSON value of a string TokenState on custom mode', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: {
            myMode: 'aString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getJSONValue({ resolveAliases: true, targetMode: 'myMode' })).toEqual(
        'aString',
      );
    });
    it('should return the JSON value of a renamed value containing aliases', () => {
      const treeState = createTreeStateFromTokenTree({});

      treeState.addToken(new TreePath(['aString']), {
        $type: 'string',
        $value: {
          default: 'aString',
        },
      });

      const maybeSourceState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeSourceState) throw new Error('Token state is unresolvable');

      treeState.addToken(new TreePath(['aStringAlias']), {
        $type: 'string',
        $value: { $alias: 'aString' },
      });

      maybeSourceState.rename('aRenamedString');

      const maybeAliasState = treeState.getTokenState(new TreePath(['aStringAlias']));
      if (!maybeAliasState) throw new Error('Token state is unresolvable');

      expect(
        maybeAliasState.getJSONValue({
          resolveAliases: false,
        }),
      ).toStrictEqual({ $alias: 'aRenamedString' });
    });
    it('should fail to return the JSON value on custom mode when the mode does not exist', () => {
      const tokens: SpecifyDesignTokenFormat = {
        content: {
          aString: {
            $type: 'string',
            $value: {
              myMode: 'aString',
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['content', 'aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.getJSONValue({
          resolveAliases: true,
          targetMode: 'unknownMode',
        });
      }).toThrow('Mode "unknownMode" does not exist on token "content.aString".');
    });
    it('should fail to return the JSON value when allowUnresolvable is false and the token is unresolvable', () => {
      const tokens: SpecifyDesignTokenFormat = {
        content: {
          aString: {
            $type: 'string',
            $value: {
              myMode: {
                $alias: 'aUnknownReference',
                $mode: 'unknownMode',
              },
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['content', 'aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(() => {
        tokenState.getJSONValue({
          resolveAliases: true,
          allowUnresolvable: false,
        });
      }).toThrow('Token "content.aString" has unresolvable references: "aUnknownReference".');
    });
    it('should return the JSON value when allowUnresolvable is false and the aliases are deeply resolvable', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: {
          $type: 'number',
          $value: { default: 4 },
        },
        aColor: {
          $type: 'color',
          $value: {
            default: {
              model: 'hex',
              hex: '#000000',
              alpha: 1,
            },
          },
        },
        aDimension: {
          $type: 'dimension',
          $value: {
            default: {
              value: { $alias: 'aNumber', $mode: 'default' },
              unit: 'px',
            },
          },
        },
        aShadow: {
          $type: 'shadow',
          $value: {
            default: {
              color: { $alias: 'aColor', $mode: 'default' },
              offsetX: { value: 0, unit: 'px' },
              offsetY: { value: 0, unit: 'px' },
              blurRadius: { $alias: 'aDimension', $mode: 'default' },
              spreadRadius: { value: 0, unit: 'px' },
              type: 'outer',
            },
          },
        },
        aShadows: {
          $type: 'shadows',
          $value: {
            default: [
              {
                $alias: 'aShadow',
                $mode: 'default',
              },
            ],
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aShadows']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(
        tokenState.getJSONValue({
          resolveAliases: true,
          allowUnresolvable: false,
          targetMode: 'default',
        }),
      ).toEqual([
        {
          offsetX: { value: 0, unit: 'px' },
          offsetY: { value: 0, unit: 'px' },
          spreadRadius: { value: 0, unit: 'px' },
          type: 'outer',
          color: { model: 'hex', hex: '#000000', alpha: 1 },
          blurRadius: { unit: 'px', value: 4 },
        },
      ]);
    });
  });
  describe.concurrent('getJSONToken', () => {
    it('should return the JSON token of a string TokenState with default options', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: {
            default: 'aString',
          },
          $description: 'A string token',
          $extensions: { dope: true },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getJSONToken()).toEqual({
        $type: 'string',
        $value: {
          default: 'aString',
        },
        $description: 'A string token',
        $extensions: { dope: true },
      });
    });
  });
  describe.concurrent('getJSONProperties', () => {
    it('should return the JSON properties of a raw string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: { default: 'a string' },
          $description: 'A string token',
          $extensions: { dope: true },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getJSONProperties()).toEqual({
        $type: 'string',
        $value: { default: 'a string' },
        $description: 'A string token',
        $extensions: { dope: true },
      });
    });
    it('should return the JSON properties of an aliased string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aReference: { $type: 'string', $value: { default: 'a string' } },
        aString: {
          $type: 'string',
          $value: { $alias: 'aReference' },
          $description: 'An aliased string token',
          $extensions: { dope: true },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.getJSONProperties()).toEqual({
        $type: 'string',
        $value: { $alias: 'aReference' },
        $description: 'An aliased string token',
        $extensions: { dope: true },
      });
    });
  });
  describe.concurrent('toJSON', () => {
    it('should return the initial JSON token of a string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: {
            default: 'aString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.toJSON()).toEqual({
        $type: 'string',
        $value: {
          default: 'aString',
        },
      });
    });
    it('should return the initial JSON token of an aliased string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aReference: { $type: 'string', $value: { default: 'aString' } },
        aString: {
          $type: 'string',
          $value: { $alias: 'aReference' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.toJSON()).toEqual({
        $type: 'string',
        $value: { $alias: 'aReference' },
      });
    });
  });

  describe.concurrent('matchByType', () => {
    it('should match token by type', () => {
      const tokens: SpecifyDesignTokenFormat = {
        dimToken: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 12 },
            large: { unit: 'px', value: 24 },
          },
        },
        transition: {
          $type: 'transition',
          $value: {
            default: {
              delay: { unit: 's', value: 12 },
              duration: { unit: 's', value: 12 },
              timingFunction: [0.1, 0.2, 0.3, 0.4],
            },
          },
        },
        dimUnit: {
          $type: 'dimensionUnit',
          $value: {
            default: 'pt',
          },
        },
      };

      const engine = createSDTFEngine(tokens);

      const [dimToken] = engine.query.run({ where: { token: 'dimToken', select: true } });
      const [transition] = engine.query.run({ where: { token: 'transition', select: true } });
      const [dimUnit] = engine.query.run({ where: { token: 'dimUnit', select: true } });

      expect((dimToken as TokenState).matchByType({ dimension: v => v.name }, _ => undefined)).toBe(
        'dimToken',
      );
      expect(
        (transition as TokenState).matchByType({ transition: v => v.name }, _ => undefined),
      ).toBe('transition');
      expect(
        (dimUnit as TokenState).matchByType({ dimensionUnit: v => v.name }, _ => undefined),
      ).toBe('dimUnit');

      expect(
        (dimToken as TokenState).matchByType<string | number>({ font: v => v.name }, _ => 9),
      ).toBe(9);
      expect(
        (transition as TokenState).matchByType<string | number>({ font: v => v.name }, _ => 10),
      ).toBe(10);
      expect(
        (dimUnit as TokenState).matchByType<string | number>({ font: v => v.name }, _ => 11),
      ).toBe(11);
    });
  });
  describe.concurrent('matchJSONValueByType', () => {
    it('should match token json value by type', () => {
      const tokens: SpecifyDesignTokenFormat = {
        dimToken: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 12 },
            large: { unit: 'px', value: 24 },
          },
        },
        transition: {
          $type: 'transition',
          $value: {
            default: {
              delay: { unit: 's', value: 12 },
              duration: { unit: 's', value: 12 },
              timingFunction: [0.1, 0.2, 0.3, 0.4],
            },
          },
        },
        dimUnit: {
          $type: 'dimensionUnit',
          $value: {
            default: 'pt',
          },
        },
      };

      const engine = createSDTFEngine(tokens);

      const [dimToken] = engine.query.run({ where: { token: 'dimToken', select: true } });
      const [transition] = engine.query.run({ where: { token: 'transition', select: true } });
      const [dimUnit] = engine.query.run({ where: { token: 'dimUnit', select: true } });

      expect(
        (dimToken as TokenState).matchJSONValueByType({ dimension: v => v }, _ => undefined),
      ).toEqual({
        large: {
          unit: 'px',
          value: 24,
        },
        small: {
          unit: 'px',
          value: 12,
        },
      });

      expect(
        (dimToken as TokenState).matchJSONValueByType(
          { dimension: v => undefined },
          _ => undefined,
        ),
      ).toEqual(undefined);

      expect(
        (dimToken as TokenState).matchJSONValueByType(
          { dimension: (_, mode) => (mode === 'small' ? 1 : undefined) },
          _ => undefined,
        ),
      ).toEqual({ small: 1 });

      expect(
        (transition as TokenState).matchJSONValueByType({ transition: v => v }, _ => undefined),
      ).toEqual({
        default: {
          delay: {
            unit: 's',
            value: 12,
          },
          duration: {
            unit: 's',
            value: 12,
          },
          timingFunction: [0.1, 0.2, 0.3, 0.4],
        },
      });
      expect(
        (dimUnit as TokenState).matchJSONValueByType({ dimensionUnit: v => v }, _ => undefined),
      ).toEqual({
        default: 'pt',
      });

      expect((dimToken as TokenState).matchJSONValueByType({ font: v => v }, _ => 9)).toBe(9);
      expect((transition as TokenState).matchJSONValueByType({ font: v => v }, _ => 10)).toBe(10);
      expect((dimUnit as TokenState).matchJSONValueByType({ font: v => v }, _ => 11)).toBe(11);
    });
  });
  describe.concurrent('toTokenStateParams', () => {
    it('should return the token state params of a string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: {
            default: 'aString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.toTokenStateParams()).toStrictEqual({
        path: new TreePath(['aString']),
        name: 'aString',
        $description: undefined,
        $extensions: undefined,
        $type: 'string',
        definition: expect.any(Object),
        isTopLevelAlias: false,
        analyzedValuePrimitiveParts: [
          {
            type: 'primitive',
            valuePath: new ValuePath([]),
            localMode: 'default',
            value: 'aString',
          },
        ],
        isFullyResolvable: true,
        modesResolvabilityMap: expect.any(Object),
      });
    });
  });
  describe.concurrent('toAnalyzedToken', () => {
    it('should return the analyzed token of a raw string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aString: {
          $type: 'string',
          $value: {
            default: 'aString',
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.toAnalyzedToken()).toStrictEqual({
        path: new TreePath(['aString']),
        name: 'aString',
        $description: undefined,
        $extensions: undefined,
        $type: 'string',
        $value: null,
        definition: expect.any(Object),
        isTopLevelAlias: false,
        modes: ['default'],
        computedModes: [],
        analyzedValuePrimitiveParts: [
          {
            type: 'primitive',
            valuePath: new ValuePath([]),
            localMode: 'default',
            value: 'aString',
          },
        ],
        analyzedValueAliasParts: [],
        isFullyResolvable: true,
        modesResolvability: { ['default']: true },
      });
    });
    it('should return the analyzed token of an aliased on mode string TokenState', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aReference: { $type: 'string', $value: { default: 'aString' } },
        aString: {
          $type: 'string',
          $value: {
            raw: 'aRawString',
            aliased: { $alias: 'aReference', $mode: 'default' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const tokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!tokenState) throw new Error('Token state is unresolvable');

      expect(tokenState.toAnalyzedToken()).toStrictEqual({
        path: new TreePath(['aString']),
        name: 'aString',
        $description: undefined,
        $extensions: undefined,
        $type: 'string',
        $value: null,
        definition: expect.any(Object),
        isTopLevelAlias: false,
        modes: ['aliased', 'raw'],
        computedModes: [],
        analyzedValuePrimitiveParts: [
          {
            type: 'primitive',
            valuePath: new ValuePath([]),
            localMode: 'raw',
            value: 'aRawString',
          },
        ],
        analyzedValueAliasParts: [
          {
            type: 'modeLevelAlias',
            isResolvable: true,
            localMode: 'aliased',
            alias: { path: new TreePath(['aReference']), targetMode: 'default' },
          },
        ],
        isFullyResolvable: true,
        modesResolvability: { raw: true, aliased: true },
      });
    });
  });

  describe.concurrent('token type matchers ', () => {
    it('should match a string token type', () => {
      const tokens: SpecifyDesignTokenFormat = {};
      const treeState = createTreeStateFromTokenTree(tokens);
      const params = createTokenStateParams(new TreePath(['token']), {
        type: 'string',
        isTopLevelAlias: false,
        primitiveParts: [
          {
            value: 'a string value',
          },
        ],
        isFullyResolvable: true,
        modesResolvability: [['default', true]],
      });

      const tokenState = new TokenState(treeState, params);

      expect(tokenState.isString()).toBe(true);

      if (tokenState.isString()) {
        tokenState.type;
        type _R = Expect<Equal<typeof tokenState.type, 'string'>>;
      }
    });
  });
});
