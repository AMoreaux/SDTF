import { describe, it, expect, vi } from 'vitest';
import { ValuePath } from '../../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../../_utils.js';
import {
  InnerValue,
  PickSpecifyDesignToken,
  RawValueSignature,
  ResolvableModeLevelAlias,
  ResolvableTopLevelAlias,
  ResolvableValueLevelAlias,
  SDTFError,
  SpecifyDesignTokenFormat,
  SpecifyDesignTokenTypeName,
  StatefulValueResult,
  TokenState,
  TopLevelValue,
  TopLevelValueSignature,
  UnresolvableModeLevelAlias,
  UnresolvableTopLevelAlias,
  UnresolvableValueLevelAlias,
} from '../../../../src/index.js';
import { createTreeStateFromTokenTree } from '../../../_utils/createTreeStateFromTokenTree.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

const globalTreeState = createTreeStateFromTokenTree({
  hello: {
    $type: 'number',
    $value: { default: 1 },
  },
});
const globalTokenState = globalTreeState.getTokenState(new TreePath(['hello']));
if (!globalTokenState) throw new Error('tokenResult is not resolved');

describe.concurrent('InnerValue', () => {
  describe.concurrent('constructor', () => {
    it('should construct an InnerValue with a raw value', () => {
      const result = new InnerValue({} as any, globalTokenState);

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);
    });
    it('should construct an InnerValue with a ResolvableValueLevelAlias', () => {
      const result = new InnerValue(new ResolvableValueLevelAlias({} as any), globalTokenState);

      expect(result.isResolvableValueLevelAlias).toBe(true);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);
    });
    it('should construct an InnerValue with a UnresolvableValueLevelAlias', () => {
      const result = new InnerValue(new UnresolvableValueLevelAlias({} as any), globalTokenState);

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(true);
    });
  });
  describe.concurrent('ofType', () => {
    it('should override the type of InnerValue while returning the same value', () => {
      const result = new InnerValue({}, globalTokenState).ofType('string');

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);

      const stringResult = result.unwrap();

      type R = Expect<Equal<typeof stringResult, string>>;
    });
  });

  describe.concurrent('resolveDeepValue', () => {
    it('should return the raw value', () => {
      type ApproxDimension = {
        unit: string;
        value: number;
      };

      const result = new InnerValue<ApproxDimension | ResolvableValueLevelAlias>(
        {
          unit: 'px',
          value: 4,
        },
        globalTokenState,
      )
        .resolveDeepValue()
        .unwrap();

      expect(result).toEqual({
        unit: 'px',
        value: 4,
      });
      type R = Expect<Equal<typeof result, ApproxDimension>>;
    });
    it('should resolve a resolvable aliased value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            small: {
              unit: 'px',
              value: 4,
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!maybeTokenState) throw new Error('Expected resolved result');

      type ApproxDimension = {
        unit: InnerValue<string>;
        value: InnerValue<number>;
      };

      const result = new InnerValue<ApproxDimension | ResolvableValueLevelAlias>(
        new ResolvableValueLevelAlias({
          localMode: 'default',
          targetMode: 'small',
          valuePath: new ValuePath(['offsetX']),
          tokenState: maybeTokenState,
        }),
        maybeTokenState,
      )
        .resolveDeepValue()
        .unwrap();

      expect(result.unit.unwrap()).toBe('px');
      expect(result.value.unwrap()).toBe(4);
    });
    it('should return the unresolvableValueLevelAlias instance', () => {
      type ApproxDimension = {
        unit: string;
        value: number;
      };

      const result = new InnerValue<
        ApproxDimension | ResolvableValueLevelAlias | UnresolvableValueLevelAlias
      >(
        new UnresolvableValueLevelAlias({
          localMode: 'default',
          targetMode: 'small',
          valuePath: new ValuePath(['offsetX']),
          targetPath: new TreePath(['aDimension']),
        }),
        globalTokenState,
      )
        .resolveDeepValue()
        .unwrap();

      expect(result).toBeInstanceOf(UnresolvableValueLevelAlias);
      expect((result as UnresolvableValueLevelAlias).valuePath).toEqual(new ValuePath(['offsetX']));
      expect((result as UnresolvableValueLevelAlias).localMode).toBe('default');
      expect((result as UnresolvableValueLevelAlias).targetMode).toBe('small');
      expect((result as UnresolvableValueLevelAlias).targetPath).toEqual(
        new TreePath(['aDimension']),
      );
      type R = Expect<Equal<typeof result, ApproxDimension | UnresolvableValueLevelAlias>>;
    });
    it('should return the unresolvableValueLevelAlias instance through a nested resolution', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            small: { $alias: 'aDimensionAlias', $mode: 'default' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const result = new InnerValue(
        new ResolvableValueLevelAlias({
          valuePath: new ValuePath(['offsetX']),
          localMode: 'default',
          targetMode: 'small',
          tokenState: maybeTokenState,
        }),
        maybeTokenState,
      )
        .resolveDeepValue()
        .unwrap();

      expect(result).toBeInstanceOf(UnresolvableValueLevelAlias);
      expect((result as UnresolvableValueLevelAlias).valuePath).toEqual(new ValuePath(['offsetX']));
      expect((result as UnresolvableValueLevelAlias).localMode).toBe('default');
      expect((result as UnresolvableValueLevelAlias).targetMode).toBe('default');
      expect((result as UnresolvableValueLevelAlias).targetPath).toEqual(
        new TreePath(['aDimensionAlias']),
      );
    });
  });
  describe.concurrent('mapUnresolvableValueLevelAlias', () => {
    it('should map a UnresolvableValueLevelAlias to a string', () => {
      const neverCalledCallback = vi.fn();
      const result = new InnerValue(
        new UnresolvableValueLevelAlias({
          localMode: 'light',
          targetMode: 'dark',
          valuePath: new ValuePath(['a', 'b']),
          targetPath: new TreePath(['c', 'd']),
        }),
        globalTokenState,
      )
        .mapUnresolvableValueLevelAlias(
          unref => `${unref.targetPath.toString()} at mode ${unref.targetMode}`,
        )
        .mapResolvableValueLevelAlias(() => neverCalledCallback());

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);

      expect(result.unwrap()).toBe('c.d at mode dark');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should not map anything not matching an UnresolvableValueLevelAlias', () => {
      const neverCalledCallback = vi.fn();

      const result = new InnerValue({} as any, globalTokenState)
        .mapUnresolvableValueLevelAlias(() => neverCalledCallback())
        .mapResolvableValueLevelAlias(() => neverCalledCallback());

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);
      expect(result.unwrap()).toEqual({});
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });
  describe.concurrent('mapResolvableValueLevelAlias', () => {
    it('should map a ResolvableValueLevelAlias to a string', () => {
      const neverCalledCallback = vi.fn();
      const result = new InnerValue(
        new ResolvableValueLevelAlias({
          localMode: 'light',
          targetMode: 'dark',
          valuePath: new ValuePath(['a', 'b']),
          tokenState: {} as any,
        }),
        globalTokenState,
      )
        .mapResolvableValueLevelAlias(
          unref => `${unref.valuePath.toString()} at mode ${unref.targetMode}`,
        )
        .mapUnresolvableValueLevelAlias(() => neverCalledCallback());

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);

      expect(result.unwrap()).toBe('a.b at mode dark');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should not map anything not matching an ResolvableValueLevelAlias', () => {
      const neverCalledCallback = vi.fn();

      const result = new InnerValue({} as any, globalTokenState)
        .mapResolvableValueLevelAlias(() => neverCalledCallback())
        .mapUnresolvableValueLevelAlias(() => neverCalledCallback());

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);
      expect(result.unwrap()).toEqual({});
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });
  describe.concurrent('mapPrimitiveValue', () => {
    it('should map a token primitive if placed first', () => {
      const result = new InnerValue('a', globalTokenState).mapPrimitiveValue(() => 'b');

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);
      expect(result.unwrap()).toBe('b');
    });
    it('EDGE CASE - should map any non-alias returned value from mapUnresolvableValueLevelAlias if placed last', () => {
      const result = new InnerValue(new UnresolvableValueLevelAlias({} as any), globalTokenState)
        .mapUnresolvableValueLevelAlias(() => 'unresolvable')
        .mapPrimitiveValue(p => p);

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);
      expect(result.unwrap()).toBe('unresolvable');
    });
    it('EDGE CASE - should map any non-alias returned value from mapResolvableValueLevelAlias if placed last', () => {
      const result = new InnerValue(new ResolvableValueLevelAlias({} as any), globalTokenState)
        .mapResolvableValueLevelAlias(() => 'resolvable')
        .mapPrimitiveValue(p => p);

      expect(result.isResolvableValueLevelAlias).toBe(false);
      expect(result.isUnresolvableValueLevelAlias).toBe(false);
      expect(result.unwrap()).toBe('resolvable');
    });
  });
  describe.concurrent('unwrap', () => {
    it('should unwrap a raw value', () => {
      const result = new InnerValue('a', globalTokenState).unwrap();

      expect(result).toBe('a');
      type R = Expect<Equal<typeof result, string>>;
    });
    it('should unwrap a ResolvableValueLevelAlias', () => {
      const result = new InnerValue(
        new ResolvableValueLevelAlias({} as any),
        globalTokenState,
      ).unwrap();

      expect(result).toBeInstanceOf(ResolvableValueLevelAlias);
      type R = Expect<Equal<typeof result, ResolvableValueLevelAlias>>;
    });
    it('should unwrap a UnresolvableValueLevelAlias', () => {
      const result = new InnerValue(
        new UnresolvableValueLevelAlias({} as any),
        globalTokenState,
      ).unwrap();

      expect(result).toBeInstanceOf(UnresolvableValueLevelAlias);
      type R = Expect<Equal<typeof result, UnresolvableValueLevelAlias>>;
    });
  });

  describe.concurrent('unwrapValue', () => {
    it('should unwrap a raw value', () => {
      const result = new InnerValue('a', globalTokenState).unwrapValue();

      expect(result).toBe('a');
      type R = Expect<Equal<typeof result, string>>;
    });
    it('should fail unwrapping a ResolvableValueLevelAlias', () => {
      const treeState = createTreeStateFromTokenTree({
        aDimension: {
          $type: 'dimension',
          $value: {
            small: {
              unit: 'px',
              value: 4,
            },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      expect(() =>
        new InnerValue(
          new ResolvableValueLevelAlias({
            localMode: 'default',
            targetMode: 'small',
            valuePath: new ValuePath(['offsetX']),
            tokenState: maybeTokenState,
          }),
          globalTokenState,
        ).unwrapValue(),
      ).toThrow('Cannot unwrap raw value of "aDimension" because it is an alias.');
    });
    it('should fail unwrapping a UnresolvableValueLevelAlias', () => {
      expect(() =>
        new InnerValue(
          new UnresolvableValueLevelAlias({
            localMode: 'default',
            targetMode: 'small',
            valuePath: new ValuePath(['offsetX']),
            targetPath: new TreePath(['aDimension']),
          }),
          globalTokenState,
        ).unwrapValue(),
      ).toThrow('Cannot unwrap raw value of "aDimension" because it is an alias.');
    });
  });
});

describe.concurrent('TopLevelValue', () => {
  describe.concurrent('constructor', () => {
    it('should construct a TopLevelValue with a raw value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            small: {
              unit: 'px',
              value: 4,
            },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);
      const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue((tokens.aDimension as any).$value, maybeTokenState);

      expect(topLevelValue.unwrap()).toEqual({
        small: {
          unit: 'px',
          value: 4,
        },
      });
    });
    it('should construct a TopLevelValue with a ResolvableModeLevelAlias', () => {
      const treeState = createTreeStateFromTokenTree({
        aDimension: {
          $type: 'dimension',
          $value: {
            small: {
              unit: 'px',
              value: 4,
            },
          },
        },
        anotherDimension: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'aDimension', $mode: 'small' },
          },
        },
      });

      const sourceToken = treeState.getTokenState(new TreePath(['aDimension']));
      if (!sourceToken) throw new Error('tokenResult is not resolved');

      const aliasToken = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!aliasToken) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          default: new ResolvableModeLevelAlias({
            localMode: 'default',
            targetMode: 'small',
            tokenState: sourceToken,
          }),
        },
        aliasToken,
      );

      expect(topLevelValue.unwrap().default).toBeInstanceOf(ResolvableModeLevelAlias);
    });
    it('should construct a TopLevelValue with an UnresolvableModeLevelAlias', () => {
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'aDimension', $mode: 'small' },
          },
        },
      });

      const aliasToken = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!aliasToken) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          default: new UnresolvableModeLevelAlias({
            localMode: 'default',
            targetMode: 'small',
            targetPath: new TreePath(['aDimension']),
          }),
        },
        aliasToken,
      );

      expect(topLevelValue.unwrap().default).toBeInstanceOf(UnresolvableModeLevelAlias);
    });
  });
  describe.concurrent('hasMode', () => {
    it('should return true if mode exists', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: {
          $type: 'string',
          $value: {
            en: 'a string',
            es: 'una cadena',
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          en: 'a string',
          es: 'una cadena',
        },
        maybeTokenState,
      );

      expect(topLevelValue.hasMode('en')).toBe(true);
    });
    it('should return false if mode does not exist', () => {
      const treeState = createTreeStateFromTokenTree({
        aString: {
          $type: 'string',
          $value: {
            en: 'a string',
            es: 'una cadena',
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          en: 'a string',
          es: 'una cadena',
        },
        maybeTokenState,
      );

      expect(topLevelValue.hasMode('fr')).toBe(false);
    });
  });
  describe.concurrent('focusOnMode', () => {
    it('should return a topLevelValue with only the specified mode', () => {
      const rawValue: PickSpecifyDesignToken<'string'>['$value'] = {
        en: 'a string',
        es: 'una cadena',
        fr: 'une chaine',
      };
      const treeState = createTreeStateFromTokenTree({
        aString: {
          $type: 'string',
          $value: rawValue,
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(rawValue as any, maybeTokenState);

      const result = topLevelValue.focusOnMode('en');

      expect(result.unwrap()).toStrictEqual({
        en: 'a string',
      });
    });
    it('should fail when trying to access an unknown mode', () => {
      const rawValue: PickSpecifyDesignToken<'string'>['$value'] = {
        en: 'a string',
        es: 'una cadena',
        fr: 'une chaine',
      };
      const treeState = createTreeStateFromTokenTree({
        aString: {
          $type: 'string',
          $value: rawValue,
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aString']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(rawValue as any, maybeTokenState);

      expect(() => topLevelValue.focusOnMode('de')).toThrowError(
        'Mode "de" is not defined in token "aString"',
      );
    });
  });
  describe.concurrent('pickMode', () => {
    it('should pick a mode', () => {
      const rawValue: PickSpecifyDesignToken<'dimension'>['$value'] = {
        small: { unit: 'px', value: 4 },
        large: { unit: 'px', value: 8 },
      };
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: rawValue,
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(rawValue as any, maybeTokenState);

      expect(topLevelValue.pickMode('small')).toStrictEqual({
        unit: 'px',
        value: 4,
      });
    });
    it('should fail if mode does not exist', () => {
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 4 },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          small: { unit: 'px', value: 4 } as any,
        },
        maybeTokenState,
      );

      expect(() => topLevelValue.pickMode('large')).toThrowError(
        'Mode "large" is not defined in token "anotherDimension"',
      );
    });
  });
  describe.concurrent('mapModes', () => {
    it('should map modes on a raw value', () => {
      const dimensionValue: PickSpecifyDesignToken<'dimension'>['$value'] = {
        small: { unit: 'px', value: 4 },
        large: { unit: 'px', value: 8 },
      };

      const treeState = createTreeStateFromTokenTree({
        aDimension: {
          $type: 'dimension',
          $value: dimensionValue,
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(dimensionValue as any, maybeTokenState);

      const spy = vi.fn((mode: string) => {
        return mode;
      });

      const result = topLevelValue.mapModes(spy).unwrap();

      expect(result).toStrictEqual({ small: 'small', large: 'large' });
      type R = Expect<Equal<typeof result, { [k: string]: string }>>;

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 'small');
      expect(spy).toHaveBeenNthCalledWith(2, 'large');
    });
    it('should map modes on a value with mode level aliases', () => {
      const dimensionValue: PickSpecifyDesignToken<'dimension'>['$value'] = {
        small: { $alias: 'aSourceDimension', $mode: 'default' },
        large: { $alias: 'anotherSourceDimension', $mode: 'default' }, // unresolvable
      };
      const tokens: SpecifyDesignTokenFormat = {
        aSourceDimension: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: 2,
            },
          },
        },
        aDimension: {
          $type: 'dimension',
          $value: dimensionValue,
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(dimensionValue as any, maybeTokenState);

      const spy = vi.fn((mode: string) => {
        return mode;
      });

      const result = topLevelValue.mapModes(spy).unwrap();

      expect(result).toStrictEqual({ small: 'small', large: 'large' });
      type R = Expect<Equal<typeof result, { [k: string]: string }>>;

      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenNthCalledWith(1, 'small');
      expect(spy).toHaveBeenNthCalledWith(2, 'large');
    });
  });

  describe.concurrent('resolveDeepValue', () => {
    it('should resolve a raw value', () => {
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: {
            small: { $alias: 'aDimension', $mode: 'default' },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const neverCalledCallback = vi.fn();
      const result = new TopLevelValue(
        {
          small: {
            unit: 'px',
            value: 4,
          } as any,
        },
        maybeTokenState,
      )
        .resolveDeepValue()
        .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
        .mapResolvableModeLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(result).toStrictEqual({
        small: {
          unit: 'px',
          value: 4,
        },
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should resolve a resolvable mode level aliased value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aNumber: {
          $type: 'number',
          $value: { default: 4 },
        },
        aDimension: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: { $alias: 'aNumber', $mode: 'default' },
            },
          },
        },
        anotherDimension: {
          $type: 'dimension',
          $value: {
            small: { $alias: 'aDimension', $mode: 'default' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const sourceTokenResult = treeState.getTokenState(new TreePath(['aDimension']));
      if (!sourceTokenResult) throw new Error('sourceTokenResult is undefined');

      const aliasTokenResult = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!aliasTokenResult) throw new Error('aliasTokenResult is undefined');

      const neverCalledCallback = vi.fn();

      const result = new TopLevelValue(
        {
          small: new ResolvableModeLevelAlias({
            localMode: 'small',
            targetMode: 'default',
            tokenState: sourceTokenResult,
          }),
        },
        aliasTokenResult,
      )
        .resolveDeepValue()
        .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
        .mapResolvableModeLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(result).toStrictEqual({
        small: {
          unit: expect.any(InnerValue),
          value: expect.any(InnerValue),
        },
      });
      expect(result.small.unit.unwrap()).toBe('px');
      expect(result.small.value.unwrap() instanceof ResolvableValueLevelAlias).toBeTruthy();

      expect((result as any).small.value.unwrap().tokenState.value.default).toBe(4);
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should not resolve an unresolvable mode level aliased value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        anotherDimension: {
          $type: 'dimension',
          $value: {
            small: { $alias: 'aDimension', $mode: 'default' },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const neverCalledCallback = vi.fn();
      const result = new TopLevelValue(
        {
          small: new UnresolvableModeLevelAlias({
            localMode: 'small',
            targetMode: 'default',
            targetPath: new TreePath(['aDimension']),
          }),
        },
        maybeTokenState,
      )
        .resolveDeepValue()
        .mapResolvableModeLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(result).toStrictEqual({
        small: expect.any(UnresolvableModeLevelAlias),
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });
  describe.concurrent('mapUnresolvableModeLevelAlias', () => {
    it('should map a UnresolvableModeLevelAlias to a string', () => {
      const neverCalledCallback = vi.fn();
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'aDimension', $mode: 'small' },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          default: new UnresolvableModeLevelAlias({
            localMode: 'default',
            targetMode: 'small',
            targetPath: new TreePath(['aDimension']),
          }),
        },
        maybeTokenState,
      )
        .mapRawValue(() => neverCalledCallback())
        .mapUnresolvableModeLevelAlias(
          unref => `${unref.targetPath.toString()} at mode ${unref.targetMode}`,
        )
        .mapResolvableModeLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(topLevelValue.default).toBe('aDimension at mode small');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should not map anything not matching an UnresolvableModeLevelAlias', () => {
      const neverCalledCallback = vi.fn();
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: {
            default: { unit: 'px', value: 4 },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          default: { unit: 'px', value: 4 } as any,
        },
        maybeTokenState,
      )
        .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
        .mapResolvableModeLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(topLevelValue.default).toStrictEqual({
        unit: 'px',
        value: 4,
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });
  describe.concurrent('mapResolvableModeLevelAlias', () => {
    it('should map a ResolvableModeLevelAlias to a string', () => {
      const neverCalledCallback = vi.fn();
      const treeState = createTreeStateFromTokenTree({
        aDimension: {
          $type: 'dimension',
          $value: { small: { unit: 'px', value: 4 } },
        },
        anotherDimension: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'aDimension', $mode: 'small' },
          },
        },
      });

      const sourceTokenResult = treeState.getTokenState(new TreePath(['aDimension']));
      if (!sourceTokenResult) throw new Error('tokenResult is not resolved');

      const aliasTokenResult = treeState.getTokenState(new TreePath(['aDimension']));
      if (!aliasTokenResult) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          default: new ResolvableModeLevelAlias({
            localMode: 'default',
            targetMode: 'small',
            tokenState: sourceTokenResult,
          }),
        },
        aliasTokenResult,
      )
        .mapRawValue(() => neverCalledCallback())
        .mapResolvableModeLevelAlias(
          ref => `${ref.tokenState.path.toString()} at mode ${ref.targetMode}`,
        )
        .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(topLevelValue.default).toBe('aDimension at mode small');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should not map anything not matching an ResolvableModeLevelAlias', () => {
      const neverCalledCallback = vi.fn();
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: {
            default: { unit: 'px', value: 4 },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          default: { unit: 'px', value: 4 } as any,
        },
        maybeTokenState,
      )
        .mapResolvableModeLevelAlias(() => neverCalledCallback())
        .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(topLevelValue.default).toStrictEqual({
        unit: 'px',
        value: 4,
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });
  describe.concurrent('mapRawValue', () => {
    it('should map a raw value to a string', () => {
      const neverCalledCallback = vi.fn();
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: {
            default: { unit: 'px', value: 4 },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          default: { unit: 'px', value: 4 } as any,
        },
        maybeTokenState,
      )
        .mapRawValue((value: any) => `${value.value}${value.unit}`)
        .mapResolvableModeLevelAlias(() => neverCalledCallback())
        .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(topLevelValue.default).toBe('4px');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('EDGE CASE - it should remap the output of a mapResolvableModeLevelAlias', () => {
      const neverCalledCallback = vi.fn();
      const treeState = createTreeStateFromTokenTree({
        aDimension: {
          $type: 'dimension',
          $value: { small: { unit: 'px', value: 4 } },
        },
        anotherDimension: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'aDimension', $mode: 'small' },
          },
        },
      });

      const sourceTokenResult = treeState.getTokenState(new TreePath(['aDimension']));
      if (!sourceTokenResult) throw new Error('Expected resolved sourceTokenResult');

      const aliasTokenResult = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!aliasTokenResult) throw new Error('Expected resolved aliasTokenResult');

      const topLevelValue = new TopLevelValue(
        {
          default: new ResolvableModeLevelAlias({
            localMode: 'default',
            targetMode: 'small',
            tokenState: sourceTokenResult,
          }),
        },
        aliasTokenResult,
      )
        .mapRawValue(() => neverCalledCallback())
        .mapResolvableModeLevelAlias(
          ref => `${ref.tokenState.path.toString()} at mode ${ref.targetMode}`,
        )
        .mapUnresolvableModeLevelAlias(() => neverCalledCallback())
        .mapRawValue((value: any) => value.toUpperCase())
        .unwrap();

      expect(topLevelValue.default).toBe('ADIMENSION AT MODE SMALL');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });

  describe.concurrent('mapRawValueWithTokenState', () => {
    expect.assertions(10);

    it('should resolve the deep value and pass the right mode and token state', () => {
      const neverCalledCallback = () => {
        throw new Error('Unreachable');
      };

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

      const token = treeState.getTokenState<'dimension'>(new TreePath(['alias2']));

      if (!token) throw new Error('Should be resolved');

      token
        .getStatefulValueResult()
        .mapTopLevelValue(topValue => {
          topValue
            .resolveDeepValue()
            .mapRawValueWithTokenState((raw, mode, tokenState) => {
              expect(mode).toBe('large');
              expect(tokenState.path.toString()).toBe('value');
              expect(raw.value.unwrap() instanceof ResolvableValueLevelAlias).toBeTruthy();
              expect(raw.unit.unwrap()).toBe('px');
            })
            .mapUnresolvableModeLevelAlias(neverCalledCallback);
        })
        .mapUnresolvableTopLevelAlias(neverCalledCallback)
        .mapResolvableTopLevelAlias(neverCalledCallback);
    });

    it('should resolve the deep value and pass the right mode and token state even with unresolvable alias', () => {
      const neverCalledCallback = () => {
        throw new Error('Unreachable');
      };

      const tokens: SpecifyDesignTokenFormat = {
        alias0: {
          $type: 'dimension',
          $value: {
            large: { value: 12, unit: '%' },
          },
        },
        alias1: {
          $type: 'dimension',
          $value: {
            world: { $alias: 'value', $mode: 'large' },
          },
        },
        alias2: {
          $type: 'dimension',
          $value: {
            default: { $alias: 'alias1', $mode: 'world' },
            default2: { $alias: 'alias0', $mode: 'large' },
          },
        },
      };

      const treeState = createTreeStateFromTokenTree(tokens);

      const token = treeState.getTokenState<'dimension'>(new TreePath(['alias2']));

      if (!token) throw new Error('Should be resolved');

      token
        .getStatefulValueResult()
        .mapTopLevelValue(topValue => {
          topValue
            .resolveDeepValue()
            .mapRawValueWithTokenState((raw, mode, tokenState) => {
              expect(mode).toBe('large');
              expect(tokenState.path.toString()).toBe('alias0');
              expect(raw.value.unwrap()).toBe(12);
              expect(raw.unit.unwrap()).toBe('%');
            })
            .mapUnresolvableModeLevelAlias((alias, mode) => {
              expect(mode).toBe('default');
              expect(alias.targetPath, 'alias1');
            });
        })
        .mapUnresolvableTopLevelAlias(neverCalledCallback)
        .mapResolvableTopLevelAlias(neverCalledCallback);
    });
  });
  describe.concurrent('reduce', () => {
    it('should apply a reduce on a token value', () => {
      const rawValue: PickSpecifyDesignToken<'dimension'>['$value'] = {
        small: { unit: 'px', value: 4 },
        large: { unit: 'px', value: 8 },
      };
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: rawValue,
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(rawValue as any, maybeTokenState);

      const result = topLevelValue.reduce((acc, mode, value) => {
        return acc + (value as any).value;
      }, 0);

      expect(result).toBe(12);
    });
  });
  describe.concurrent('unwrap', () => {
    it('should unwrap a raw value', () => {
      const treeState = createTreeStateFromTokenTree({
        anotherDimension: {
          $type: 'dimension',
          $value: {
            default: { unit: 'px', value: 4 },
          },
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const topLevelValue = new TopLevelValue(
        {
          default: { unit: 'px', value: 4 } as any,
        },
        maybeTokenState,
      );

      expect(topLevelValue.unwrap()).toStrictEqual({
        default: { unit: 'px', value: 4 },
      });
    });
  });
  describe.concurrent('unwrapValue', () => {
    it('should unwrap a raw value signature', () => {
      const topLevel = new TopLevelValue({ mode1: 1, mode2: 2 }, globalTokenState);
      const result = topLevel.unwrapValue();

      type _R = Expect<
        Equal<typeof result, { [mode: string]: RawValueSignature<SpecifyDesignTokenTypeName> }>
      >;
      expect(result).toEqual({ mode1: 1, mode2: 2 });
    });

    it('should throw because we have a resolvable mode level alias', () => {
      const topLevel = new TopLevelValue(
        {
          mode1: new ResolvableModeLevelAlias({
            localMode: 'mode1',
            targetMode: 'target',
            tokenState: globalTokenState,
          }),
          mode2: 2,
        },
        globalTokenState,
      );

      expect(() => topLevel.unwrapValue()).toThrow(
        'Cannot unwrap raw value of "hello" because it is an alias.',
      );
    });

    it('should throw because we have an unresolvable mode level alias', () => {
      const topLevel = new TopLevelValue(
        {
          mode1: new UnresolvableModeLevelAlias({
            localMode: 'mode1',
            targetMode: 'mode',
            targetPath: new TreePath(['hello']),
          }),
          mode2: 2,
        },
        globalTokenState,
      );
      expect(() => topLevel.unwrapValue()).toThrow(
        'Cannot unwrap raw value of "hello" because it is an alias.',
      );
    });
  });
});

describe.concurrent('StatefulValueResult', () => {
  describe.concurrent('constructor', () => {
    it('should construct a StatefulValueResult with a raw value', () => {
      const rawValue: PickSpecifyDesignToken<'dimension'>['$value'] = {
        small: { unit: 'px', value: 4 },
      };

      const treeState = createTreeStateFromTokenTree({
        aDimension: {
          $type: 'dimension',
          $value: rawValue,
        },
      });

      const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is not resolved');

      const result = new StatefulValueResult(
        new TopLevelValue(rawValue as any, maybeTokenState),
        maybeTokenState,
      );

      expect(result.isResolvableTopLevelAlias).toBe(false);
      expect(result.isUnresolvableTopLevelAlias).toBe(false);
      expect(result.isTopLevelValue).toBe(true);

      expect(result.unwrap()).toBeInstanceOf(TopLevelValue);
    });
    it('should construct a StatefulValueResult with a ResolvableTopLevelAlias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            default: { unit: 'px', value: 4 },
          },
        },
        anotherDimension: {
          $type: 'dimension',
          $value: { $alias: 'aDimension' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const sourceTokenResult = treeState.getTokenState(new TreePath(['aDimension']));
      if (!sourceTokenResult) throw new Error('sourceTokenResult is undefined');

      const aliasTokenResult = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!aliasTokenResult) throw new Error('aliasTokenResult is undefined');

      const result = new StatefulValueResult(
        new ResolvableTopLevelAlias({
          tokenState: sourceTokenResult,
        }),
        aliasTokenResult,
      );

      expect(result.isResolvableTopLevelAlias).toBe(true);
      expect(result.isUnresolvableTopLevelAlias).toBe(false);
      expect(result.isTopLevelValue).toBe(false);

      expect(result.unwrap()).toBeInstanceOf(ResolvableTopLevelAlias);
    });
    it('should construct a StatefulValueResult with a UnresolvableTopLevelAlias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        anotherDimension: {
          $type: 'dimension',
          $value: { $alias: 'aDimension' }, // unresolvable
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new UnresolvableTopLevelAlias({
          targetPath: new TreePath(['aDimension']),
        }),
        maybeTokenState,
      );

      expect(result.isResolvableTopLevelAlias).toBe(false);
      expect(result.isUnresolvableTopLevelAlias).toBe(true);
      expect(result.isTopLevelValue).toBe(false);

      expect(result.unwrap()).toBeInstanceOf(UnresolvableTopLevelAlias);
    });
  });
  describe.concurrent('resolveDeepValue', () => {
    it('should resolve a resolvable top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            default: {
              unit: 'px',
              value: 4,
            },
          },
        },
        anotherDimension: {
          $type: 'dimension',
          $value: { $alias: 'aDimension' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const sourceTokenResult = treeState.getTokenState(new TreePath(['aDimension']));
      if (!sourceTokenResult) throw new Error('sourceTokenResult is undefined');

      const aliasTokenResult = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!aliasTokenResult) throw new Error('aliasTokenResult is undefined');

      const result = new StatefulValueResult(
        new ResolvableTopLevelAlias({
          tokenState: sourceTokenResult,
        }),
        aliasTokenResult,
      )
        .resolveDeepValue()
        .mapTopLevelValue(topLevelValue => topLevelValue.unwrap())
        .mapResolvableTopLevelAlias((): never => {
          throw Error('unexpected');
        })
        .mapUnresolvableTopLevelAlias((): never => {
          throw Error('unexpected');
        })
        .unwrap();

      expect(result).toStrictEqual({
        default: {
          unit: expect.any(InnerValue),
          value: expect.any(InnerValue),
        },
      });
    });
    it('should resolve a topLevelValue', () => {
      const tokens: SpecifyDesignTokenFormat = {
        anotherDimension: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 4 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new TopLevelValue(
          { small: { unit: 'px', value: 4 } } as any,
          maybeTokenState as TokenState<'dimension'>,
        ),
        maybeTokenState as TokenState<'dimension'>,
      )
        .resolveDeepValue()
        .mapTopLevelValue(topLevelValue => topLevelValue.unwrap())
        .mapResolvableTopLevelAlias((): never => {
          throw Error('unexpected');
        })
        .mapUnresolvableTopLevelAlias((): never => {
          throw Error('unexpected');
        })
        .unwrap();

      expect(result).toStrictEqual({
        small: {
          unit: 'px',
          value: 4,
        },
      });
      type R = Expect<Equal<typeof result, TopLevelValueSignature<'dimension', never>>>;
    });
    it('should return an unresolvable top level alias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        anotherDimension: {
          $type: 'dimension',
          $value: {
            $alias: 'aDimension', // unresolvable
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new UnresolvableTopLevelAlias({
          targetPath: new TreePath(['aDimension']),
        }),
        maybeTokenState,
      )
        .resolveDeepValue()
        .mapTopLevelValue((): never => {
          throw Error('unexpected');
        })
        .mapResolvableTopLevelAlias((): never => {
          throw Error('unexpected');
        })
        .mapUnresolvableTopLevelAlias(unresolvableTopLevelAlias => unresolvableTopLevelAlias)
        .unwrap();

      expect(result).toBeInstanceOf(UnresolvableTopLevelAlias);
      type R = Expect<Equal<typeof result, UnresolvableTopLevelAlias>>;
    });
  });
  describe.concurrent('mapUnresolvableTopLevelAlias', () => {
    it('should map a UnresolvableTopLevelAlias to a string', () => {
      const neverCalledCallback = vi.fn();
      const tokens: SpecifyDesignTokenFormat = {
        anotherDimension: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 4 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new UnresolvableTopLevelAlias({
          targetPath: new TreePath(['aDimension']),
        }),
        maybeTokenState,
      )
        .mapUnresolvableTopLevelAlias(() => 'unresolvable')
        .mapResolvableTopLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(result).toBe('unresolvable');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should not map anything not matching an UnresolvableTopLevelAlias', () => {
      const neverCalledCallback = vi.fn();
      const tokens: SpecifyDesignTokenFormat = {
        anotherDimension: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 4 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new TopLevelValue({ small: { unit: 'px', value: 4 } } as any, maybeTokenState),
        maybeTokenState,
      )
        .mapUnresolvableTopLevelAlias(() => neverCalledCallback())
        .mapResolvableTopLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(result).toBeInstanceOf(TopLevelValue);
      expect(result.unwrap()).toStrictEqual({
        small: { unit: 'px', value: 4 },
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });
  describe.concurrent('mapResolvableTopLevelAlias', () => {
    it('should map a ResolvableTopLevelAlias to a string', () => {
      const neverCalledCallback = vi.fn();
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            default: { unit: 'px', value: 4 },
          },
        },
        anotherDimension: {
          $type: 'dimension',
          $value: { $alias: 'aDimension' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const sourceTokenResult = treeState.getTokenState(new TreePath(['aDimension']));
      if (!sourceTokenResult) throw new Error('sourceTokenResult is undefined');

      const aliasTokenResult = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!aliasTokenResult) throw new Error('aliasTokenResult is undefined');

      const result = new StatefulValueResult(
        new ResolvableTopLevelAlias({
          tokenState: sourceTokenResult,
        }),
        aliasTokenResult,
      )
        .mapResolvableTopLevelAlias(() => 'resolvable')
        .mapUnresolvableTopLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(result).toBe('resolvable');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should not map anything not matching an ResolvableTopLevelAlias', () => {
      const neverCalledCallback = vi.fn();
      const tokens: SpecifyDesignTokenFormat = {
        anotherDimension: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 4 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new TopLevelValue({ small: { unit: 'px', value: 4 } } as any, maybeTokenState),
        maybeTokenState,
      )
        .mapResolvableTopLevelAlias(() => neverCalledCallback())
        .mapUnresolvableTopLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(result).toBeInstanceOf(TopLevelValue);
      expect(result.unwrap()).toStrictEqual({
        small: { unit: 'px', value: 4 },
      });
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });
  describe.concurrent('mapTopLevelValue', () => {
    it('should map a TopLevelValue to a string', () => {
      const neverCalledCallback = vi.fn();
      const tokens: SpecifyDesignTokenFormat = {
        anotherDimension: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 4 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new TopLevelValue({ small: { unit: 'px', value: 4 } } as any, maybeTokenState),
        maybeTokenState,
      )
        .mapTopLevelValue(() => 'topLevelValue')
        .mapResolvableTopLevelAlias(() => neverCalledCallback())
        .mapUnresolvableTopLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(result).toBe('topLevelValue');
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
    it('should not map anything not matching a TopLevelValue', () => {
      const neverCalledCallback = vi.fn();
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 4 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new ResolvableTopLevelAlias({
          tokenState: maybeTokenState,
        }),
        maybeTokenState,
      )
        .mapTopLevelValue(() => neverCalledCallback())
        .mapUnresolvableTopLevelAlias(() => neverCalledCallback())
        .unwrap();

      expect(result).toBeInstanceOf(ResolvableTopLevelAlias);
      expect(neverCalledCallback).not.toHaveBeenCalled();
    });
  });
  describe.concurrent('unwrap', () => {
    it('should unwrap a raw value', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            small: { unit: 'px', value: 4 },
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new TopLevelValue({ small: { unit: 'px', value: 4 } } as any, maybeTokenState),
        maybeTokenState,
      )
        .mapTopLevelValue(() => 'topLevelValue')
        .mapResolvableTopLevelAlias(() => undefined)
        .mapUnresolvableTopLevelAlias(() => undefined);

      expect(result.unwrap()).toBe('topLevelValue');
    });
    it('should unwrap a ResolvableTopLevelAlias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        aDimension: {
          $type: 'dimension',
          $value: {
            default: { unit: 'px', value: 4 },
          },
        },
        anotherDimension: {
          $type: 'dimension',
          $value: { $alias: 'aDimension' },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const sourceTokenResult = treeState.getTokenState(new TreePath(['aDimension']));
      if (!sourceTokenResult) throw new Error('sourceTokenResult is undefined');

      const aliasTokenResult = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!aliasTokenResult) throw new Error('aliasTokenResult is undefined');

      const result = new StatefulValueResult(
        new ResolvableTopLevelAlias({
          tokenState: sourceTokenResult,
        }),
        aliasTokenResult,
      )
        .mapResolvableTopLevelAlias(() => 'resolvable')
        .mapUnresolvableTopLevelAlias(() => undefined)
        .mapTopLevelValue(() => undefined);

      expect(result.unwrap()).toBe('resolvable');
    });
    it('should unwrap a UnresolvableTopLevelAlias', () => {
      const tokens: SpecifyDesignTokenFormat = {
        anotherDimension: {
          $type: 'dimension',
          $value: {
            $alias: 'aDimension', // unresolvable
          },
        },
      };
      const treeState = createTreeStateFromTokenTree(tokens);

      const maybeTokenState = treeState.getTokenState(new TreePath(['anotherDimension']));
      if (!maybeTokenState) throw new Error('tokenResult is undefined');

      const result = new StatefulValueResult(
        new UnresolvableTopLevelAlias({
          targetPath: new TreePath(['aDimension']),
        }),
        maybeTokenState,
      )
        .mapUnresolvableTopLevelAlias(() => 'unresolvable')
        .mapResolvableTopLevelAlias(() => undefined)
        .mapTopLevelValue(() => undefined);

      expect(result.unwrap()).toBe('unresolvable');
    });
  });

  describe.concurrent('unwrapValue', () => {
    it('should unwrap a StatefulValueResult value', () => {
      const topLevel = new StatefulValueResult(
        new TopLevelValue({ mode1: 1, mode2: 2 }, globalTokenState),
        globalTokenState,
      );
      const result = topLevel.unwrapValue();

      type _R = Expect<Equal<typeof result, TopLevelValue>>;
      expect(result).toBeInstanceOf(TopLevelValue);
    });

    it('should throw because we have a resolvable alias', () => {
      const topLevel = new StatefulValueResult(
        new ResolvableTopLevelAlias({ tokenState: globalTokenState }),
        globalTokenState,
      );
      expect(() => topLevel.unwrapValue()).toThrow(
        new SDTFError(
          'SDTF_STATEFUL_VALUE_INVALID_VALUE_TYPE',
          `Cannot unwrap raw value of "hello" because it is an alias.`,
        ),
      );
    });

    it('should throw because we have an unresolvable alias', () => {
      const topLevel = new StatefulValueResult(
        new UnresolvableTopLevelAlias({ targetPath: new TreePath(['hello']) }),
        globalTokenState,
      );
      expect(() => topLevel.unwrapValue()).toThrow(
        new SDTFError(
          'SDTF_STATEFUL_VALUE_INVALID_VALUE_TYPE',
          `Cannot unwrap raw value of "hello" because it is an alias.`,
        ),
      );
    });
  });
});
