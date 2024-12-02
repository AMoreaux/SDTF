import { describe, it, expect } from 'vitest';
import {
  createSDTFEngine,
  SpecifyDesignTokenFormat,
  TokenContainsAliases,
} from '../../../../src/index.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

import { makeTokenWithContainsAliasesFilter } from '../../../../src/engine/query/filters/makeTokenWithContainsAliasesFilter.js';

describe.concurrent('makeTokenWithContainsAliasesFilter', () => {
  const tokens: SpecifyDesignTokenFormat = {
    aNumber: {
      $type: 'number',
      $value: {
        small: 4,
        large: 16,
      },
    },
    anUnresolvableNumber: {
      $type: 'number',
      $value: {
        small: { $alias: 'UNKNOWN_TOKEN', $mode: 'UNKNOWN_MODE' },
      },
    },
    aDimension: {
      $type: 'dimension',
      $value: {
        small: {
          value: 4,
          unit: 'px',
        },
        large: {
          value: 16,
          unit: 'px',
        },
      },
    },
    aResolvableModeLevelAlias: {
      $type: 'dimension',
      $value: {
        smallMode: { $alias: 'aDimension', $mode: 'small' },
      },
    },
    anUnresolvableModeLevelAlias: {
      $type: 'dimension',
      $value: {
        smallMode: { $alias: 'UNKNOWN_TOKEN', $mode: 'UNKNOWN_MODE' },
      },
    },
    aResolvableValueLevelAlias: {
      $type: 'dimension',
      $value: {
        smallMode: {
          value: {
            $alias: 'aNumber',
            $mode: 'small',
          },
          unit: 'px',
        },
      },
    },
    anUnresolvableValueLevelAlias: {
      $type: 'dimension',
      $value: {
        smallMode: {
          value: {
            $alias: 'UNKNOWN_TOKEN',
            $mode: 'UNKNOWN_MODE',
          },
          unit: 'px',
        },
      },
    },
    aDeepUnresolvableValueLevelAlias: {
      $type: 'dimension',
      $value: {
        smallMode: {
          value: {
            $alias: 'anUnresolvableNumber',
            $mode: 'small',
          },
          unit: 'px',
        },
      },
    },
  };

  it('should not filter tokens when containsAliases is undefined', () => {
    const containsAliases: TokenContainsAliases = undefined;

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toStrictEqual(allNodes);
  });
  it('should filter tokens with aliases', () => {
    const containsAliases: TokenContainsAliases = true;

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(6);
    expect(results.map(node => node.path.toArray())).toStrictEqual([
      ['anUnresolvableNumber'],
      ['aResolvableModeLevelAlias'],
      ['anUnresolvableModeLevelAlias'],
      ['aResolvableValueLevelAlias'],
      ['anUnresolvableValueLevelAlias'],
      ['aDeepUnresolvableValueLevelAlias'],
    ]);
  });
  it('should filter tokens with no aliases', () => {
    const containsAliases = false;

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(2);
    expect(results.map(node => node.path.toArray())).toStrictEqual([['aNumber'], ['aDimension']]);
  });
  it('should filter tokens with aliases on mode level', () => {
    const containsAliases: TokenContainsAliases = { level: 'mode' };

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(3);
    expect(results.map(node => node.path.toArray())).toStrictEqual([
      ['anUnresolvableNumber'],
      ['aResolvableModeLevelAlias'],
      ['anUnresolvableModeLevelAlias'],
    ]);
  });
  it('should filter tokens with aliases on value level', () => {
    const containsAliases: TokenContainsAliases = { level: 'value' };

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(3);
    expect(results.map(node => node.path.toArray())).toStrictEqual([
      ['aResolvableValueLevelAlias'],
      ['anUnresolvableValueLevelAlias'],
      ['aDeepUnresolvableValueLevelAlias'],
    ]);
  });
  it('should filter tokens with resolvable aliases', () => {
    const containsAliases: TokenContainsAliases = { resolvability: 'resolvable' };

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(2);
    expect(results.map(node => node.path.toArray())).toStrictEqual([
      ['aResolvableModeLevelAlias'],
      ['aResolvableValueLevelAlias'],
    ]);
  });
  it('should filter tokens with unresolvable aliases', () => {
    const containsAliases: TokenContainsAliases = { resolvability: 'unresolvable' };

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(4);
    expect(results.map(node => node.path.toArray())).toStrictEqual([
      ['anUnresolvableNumber'],
      ['anUnresolvableModeLevelAlias'],
      ['anUnresolvableValueLevelAlias'],
      ['aDeepUnresolvableValueLevelAlias'],
    ]);
  });
  it('should filter tokens with aliases on mode level and resolvable aliases', () => {
    const containsAliases: TokenContainsAliases = { level: 'mode', resolvability: 'resolvable' };

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(1);
    expect(results.map(node => node.path.toArray())).toStrictEqual([['aResolvableModeLevelAlias']]);
  });
  it('should filter tokens with aliases on value level and unresolvable aliases', () => {
    const containsAliases: TokenContainsAliases = { level: 'value', resolvability: 'unresolvable' };

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(2);
    expect(results.map(node => node.path.toArray())).toStrictEqual([
      ['anUnresolvableValueLevelAlias'],
      ['aDeepUnresolvableValueLevelAlias'],
    ]);
  });
  it('should filter tokens with aliases on mode level and unresolvable aliases', () => {
    const containsAliases: TokenContainsAliases = { level: 'mode', resolvability: 'unresolvable' };

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(2);
    expect(results.map(node => node.path.toArray())).toStrictEqual([
      ['anUnresolvableNumber'],
      ['anUnresolvableModeLevelAlias'],
    ]);
  });
  it('should filter tokens with aliases on value level and resolvable aliases', () => {
    const containsAliases: TokenContainsAliases = { level: 'value', resolvability: 'resolvable' };

    const filterFn = makeTokenWithContainsAliasesFilter(containsAliases);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toHaveLength(1);
    expect(results.map(node => node.path.toArray())).toStrictEqual([
      ['aResolvableValueLevelAlias'],
    ]);
  });
});
