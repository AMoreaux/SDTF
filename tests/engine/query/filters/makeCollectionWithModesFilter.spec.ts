import { describe, it, expect } from 'vitest';
import {
  createSDTFEngine,
  ModesSelector,
  SpecifyDesignTokenFormat,
} from '../../../../src/index.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

import { makeCollectionWithModesFilter } from '../../../../src/engine/query/filters/makeCollectionWithModesFilter.js';

describe.concurrent('makeCollectionWithModesFilter', () => {
  const tokens: SpecifyDesignTokenFormat = {
    content: {
      $collection: { $modes: ['fr', 'en', 'de'] },
      title: {
        $type: 'string',
        $value: {
          fr: 'Bonjour',
          en: 'Hello',
          de: 'Hallo',
        },
      },
    },
    dimension: {
      $collection: { $modes: ['small', 'medium', 'large'] },
      spacing: {
        $description: 'The spacing of the page',
        base: {
          $type: 'dimension',
          $description: 'The base spacing of the page',
          $value: {
            small: { value: 4, unit: 'px' },
            medium: { value: 8, unit: 'px' },
            large: { value: 16, unit: 'px' },
          },
        },
      },
    },
  };

  it('should not filter tokens when modes is undefined', () => {
    const modesSelector = undefined;

    const filterFn = makeCollectionWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllCollectionStates();

    const results = allNodes.filter(filterFn);

    expect(results).toEqual(allNodes);
  });
  it('should filter tokens matching the included modes', () => {
    const modesSelector: ModesSelector = {
      include: ['fr'],
    };

    const filterFn = makeCollectionWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllCollectionStates();

    const results = allNodes.filter(filterFn);
    expect(results).toHaveLength(1);
    expect(results[0].path).toEqual(new TreePath(['content']));
  });
  it('should filter tokens matching the excluded modes', () => {
    const modesSelector: ModesSelector = {
      exclude: ['fr'],
    };

    const filterFn = makeCollectionWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllCollectionStates();

    const results = allNodes.filter(filterFn);
    expect(results).toHaveLength(1);
    expect(results[0].path).toEqual(new TreePath(['dimension']));
  });
  it('should filter tokens matching the included and excluded modes', () => {
    const modesSelector: ModesSelector = {
      include: ['fr'],
      exclude: ['small'],
    };

    const filterFn = makeCollectionWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllCollectionStates();

    const results = allNodes.filter(filterFn);
    expect(results).toHaveLength(1);
    expect(results[0].path).toEqual(new TreePath(['content']));
  });
  it('should return an empty match if mode is used for both include and exclude', () => {
    const modesSelector: ModesSelector = {
      include: ['fr'],
      exclude: ['fr'],
    };

    const filterFn = makeCollectionWithModesFilter(modesSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllCollectionStates();

    const results = allNodes.filter(filterFn);
    expect(results).toEqual([]);
  });
});
