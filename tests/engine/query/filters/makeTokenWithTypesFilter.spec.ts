import { describe, it, expect } from 'vitest';
import {
  createSDTFEngine,
  getAllMockedDesignTokens,
  TokenTypesSelector,
} from '../../../../src/index.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

import { makeTokenWithTypesFilter } from '../../../../src/engine/query/filters/makeTokenWithTypesFilter.js';

describe.concurrent('makeTokenWithTypesFilter', () => {
  const tokens = getAllMockedDesignTokens({ asArray: false });

  it('should not filter when TokenTypesSelector is undefined', () => {
    const tokenTypeSelector = undefined;

    const filterFn = makeTokenWithTypesFilter(tokenTypeSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);
    expect(results).toEqual(allNodes);
  });
  it('should filter tokens matching the included types', () => {
    const tokenTypeSelector: TokenTypesSelector = {
      include: ['color'],
    };

    const filterFn = makeTokenWithTypesFilter(tokenTypeSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();
    const colorNodeResult = sdtfEngine.query.getTokenState(new TreePath(['color']));
    if (!colorNodeResult) throw new Error('unresolvable');

    expect(colorNodeResult.path).toEqual(new TreePath(['color']));

    const results = allNodes.filter(filterFn);
    expect(results).toEqual([colorNodeResult]);
  });
  it('should filter tokens matching the excluded types', () => {
    const tokenTypeSelector: TokenTypesSelector = {
      exclude: ['color'],
    };

    const filterFn = makeTokenWithTypesFilter(tokenTypeSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();
    const colorNodeResult = sdtfEngine.query.getTokenState(new TreePath(['color']));
    if (!colorNodeResult) throw new Error('unresolvable');

    expect(colorNodeResult.path).toEqual(new TreePath(['color']));

    const results = allNodes.filter(filterFn);
    expect(results).toHaveLength(allNodes.length - 1);

    const hasColorType = results.some(node => node.type === 'color');
    expect(hasColorType).toBe(false);
  });
  it('should return an empty match if type is used for both include and exclude', () => {
    const tokenTypeSelector: TokenTypesSelector = {
      include: ['color'],
      exclude: ['color'],
    };

    const filterFn = makeTokenWithTypesFilter(tokenTypeSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();

    const results = allNodes.filter(filterFn);
    expect(results).toStrictEqual([]);
  });
  it('should filter tokens matching the included and excluded types', () => {
    const tokenTypeSelector: TokenTypesSelector = {
      include: ['dimension'],
      exclude: ['color'],
    };

    const filterFn = makeTokenWithTypesFilter(tokenTypeSelector);

    const sdtfEngine = createSDTFEngine(tokens);
    const allNodes = sdtfEngine.query.getAllTokenStates();
    const dimensionNodeState = sdtfEngine.query.getTokenState(new TreePath(['dimension']));
    if (!dimensionNodeState) throw new Error('unresolvable');

    expect(dimensionNodeState.path).toEqual(new TreePath(['dimension']));

    const results = allNodes.filter(filterFn);
    expect(results).toHaveLength(1);

    expect(results[0].type).toBe('dimension');
  });
});
