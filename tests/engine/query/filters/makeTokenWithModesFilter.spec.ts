import { describe, it, expect } from 'vitest';
import {
  createSDTFEngine,
  ModesSelector,
  SpecifyDesignTokenFormat,
} from '../../../../src/index.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

import { makeTokenWithModesFilter } from '../../../../src/engine/query/filters/makeTokenWithModesFilter.js';

describe.concurrent('makeTokenWithModesFilter', () => {
  const tokens: SpecifyDesignTokenFormat = {
    string: {
      $type: 'string',
      $value: {
        fr: 'Bonjour',
        en: 'Hello',
        de: 'Hallo',
      },
    },
    dimension: {
      $type: 'dimension',
      $value: {
        small: { value: 4, unit: 'px' },
        medium: { value: 8, unit: 'px' },
        large: { value: 16, unit: 'px' },
      },
    },
    color: {
      $type: 'color',
      $value: {
        light: { model: 'hex', hex: '#FFFFFF', alpha: 1 },
        dark: { model: 'hex', hex: '#000000', alpha: 1 },
      },
    },
  };
  it('should not filter tokens when modes is undefined', () => {
    const modesSelector = undefined;

    const filterFn = makeTokenWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);

    expect(results).toEqual(allNodes);
  });
  it('should filter tokens matching the included modes', () => {
    const modesSelector: ModesSelector = {
      include: ['fr'],
    };

    const filterFn = makeTokenWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);
    expect(results).toHaveLength(1);
    expect(results[0].path).toEqual(new TreePath(['string']));
  });
  it('should filter tokens matching the excluded modes', () => {
    const modesSelector: ModesSelector = {
      exclude: ['fr', 'light'],
    };

    const filterFn = makeTokenWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);
    expect(results).toHaveLength(1);
    expect(results.map(node => node.path)).toEqual([new TreePath(['dimension'])]);
  });
  it('should return an empty match if mode is used for both include and exclude', () => {
    const modesSelector: ModesSelector = {
      include: ['fr'],
      exclude: ['fr'],
    };

    const filterFn = makeTokenWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);
    expect(results).toEqual([]);
  });
  it('should filter tokens matching the included and excluded modes', () => {
    const modesSelector: ModesSelector = {
      include: ['fr', 'en'],
      exclude: ['light'],
    };

    const filterFn = makeTokenWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);
    expect(results).toHaveLength(1);
    expect(results.map(node => node.path)).toEqual([new TreePath(['string'])]);
  });
});
