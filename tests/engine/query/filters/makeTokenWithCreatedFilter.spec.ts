import { describe, it, expect } from 'vitest';
import {
  createSDTFEngine,
  specifyCreatedAtTokenExtension,
  SpecifyDesignTokenFormat,
} from '../../../../src/index.js';

import { makeTokenWithCreatedFilter } from '../../../../src/engine/query/filters/makeTokenWithCreatedFilter.js';

describe.concurrent('makeTokenWithCreatedFilter', () => {
  const tokens: SpecifyDesignTokenFormat = {
    aStringWithCreated: {
      $type: 'string',
      $value: {
        default: 'aStringWithCreated',
      },
      $extensions: {
        [specifyCreatedAtTokenExtension]: '2021-08-01T00:00:00.000Z',
      },
    },
    aStringWithAnotherCreated: {
      $type: 'string',
      $value: {
        default: 'aStringWithAnotherCreated',
      },
      $extensions: {
        [specifyCreatedAtTokenExtension]: '2021-08-03T00:00:00.000Z',
      },
    },
    aStringWithoutCreated: {
      $type: 'string',
      $value: {
        default: 'aStringWithoutCreated',
      },
    },
  };
  it('should not filter tokens if created is undefined', () => {
    const created = undefined;

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithCreatedFilter(created);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(Object.keys(tokens).length);
  });
  it('should filter tokens where createdAt extension does not exist', () => {
    const created = { from: '2020-01-01T00:00:00.000Z' };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithCreatedFilter(created);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('aStringWithCreated');
    expect(results[1].name).toBe('aStringWithAnotherCreated');
  });
  it('should filter tokens where createdAt.from is defined', () => {
    const created = { from: '2021-08-02T00:00:00.000Z' };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithCreatedFilter(created);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('aStringWithAnotherCreated');
  });
  it('should filter tokens where createdAt.to is defined', () => {
    const created = { to: '2021-08-02T00:00:00.000Z' };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithCreatedFilter(created);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('aStringWithCreated');
  });
  it('should filter tokens where createdAt.from and createdAt.to range is defined', () => {
    const created = {
      from: '2021-08-02T00:00:00.000Z',
      to: '2021-08-03T00:00:00.000Z',
    };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithCreatedFilter(created);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('aStringWithAnotherCreated');
  });
});
