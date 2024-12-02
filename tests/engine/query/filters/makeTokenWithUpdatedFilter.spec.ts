import { describe, it, expect } from 'vitest';
import {
  createSDTFEngine,
  specifyUpdatedAtTokenExtension,
  SpecifyDesignTokenFormat,
} from '../../../../src/index.js';

import { makeTokenWithUpdatedFilter } from '../../../../src/engine/query/filters/makeTokenWithUpdatedFilter.js';

describe.concurrent('makeTokenWithUpdatedFilter', () => {
  const tokens: SpecifyDesignTokenFormat = {
    aStringWithUpdated: {
      $type: 'string',
      $value: {
        default: 'aStringWithUpdated',
      },
      $extensions: {
        [specifyUpdatedAtTokenExtension]: '2021-08-01T00:00:00.000Z',
      },
    },
    aStringWithAnotherUpdated: {
      $type: 'string',
      $value: {
        default: 'aStringWithAnotherUpdated',
      },
      $extensions: {
        [specifyUpdatedAtTokenExtension]: '2021-08-03T00:00:00.000Z',
      },
    },
    aStringWithoutUpdated: {
      $type: 'string',
      $value: {
        default: 'aStringWithoutUpdated',
      },
    },
  };
  it('should not filter tokens if updated is undefined', () => {
    const updated = undefined;

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithUpdatedFilter(updated);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(Object.keys(tokens).length);
  });
  it('should filter tokens where updatedAt extension does not exist', () => {
    const updated = { from: '2020-01-01T00:00:00.000Z' };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithUpdatedFilter(updated);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('aStringWithUpdated');
    expect(results[1].name).toBe('aStringWithAnotherUpdated');
  });
  it('should filter tokens where updatedAt.from is defined', () => {
    const updated = { from: '2021-08-02T00:00:00.000Z' };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithUpdatedFilter(updated);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('aStringWithAnotherUpdated');
  });
  it('should filter tokens where updatedAt.to is defined', () => {
    const updated = { to: '2021-08-02T00:00:00.000Z' };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithUpdatedFilter(updated);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('aStringWithUpdated');
  });
  it('should filter tokens where updatedAt.from and updatedAt.to range is defined', () => {
    const updated = {
      from: '2021-08-02T00:00:00.000Z',
      to: '2021-08-03T00:00:00.000Z',
    };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithUpdatedFilter(updated);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('aStringWithAnotherUpdated');
  });
});
