import { describe, it, expect } from 'vitest';
import {
  createSDTFEngine,
  SpecifyDesignTokenFormat,
  specifySourceIdTokenExtension,
  TokenSourceIds,
} from '../../../../src/index.js';

import { makeTokenWithSourceIdsFilter } from '../../../../src/engine/query/filters/makeTokenWithSourceIdsFilter.js';

describe.concurrent('makeTokenWithSourceIdsFilter', () => {
  const tokens: SpecifyDesignTokenFormat = {
    aStringWithSourceId: {
      $type: 'string',
      $value: {
        default: 'aStringWithSourceId',
      },
      $extensions: {
        [specifySourceIdTokenExtension]: 'aSourceId',
      },
    },
    aStringWithAnotherSourceId: {
      $type: 'string',
      $value: {
        default: 'aStringWithAnotherSourceId',
      },
      $extensions: {
        [specifySourceIdTokenExtension]: 'anotherSourceId',
      },
    },
    aStringWithoutSourceId: {
      $type: 'string',
      $value: {
        default: 'aStringWithoutSourceId',
      },
    },
  };
  it('should not filter tokens if sourceIds is undefined', () => {
    const sourceIds: TokenSourceIds = undefined;

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithSourceIdsFilter(sourceIds);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(Object.keys(tokens).length);
  });
  it('should filter tokens where sourceId extension does not exist', () => {
    const sourceIds: TokenSourceIds = { include: ['aSourceId'] };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithSourceIdsFilter(sourceIds);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('aStringWithSourceId');
  });
  it('should filter token including sourceIds', () => {
    const sourceIds: TokenSourceIds = { include: ['aSourceId'] };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithSourceIdsFilter(sourceIds);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('aStringWithSourceId');
  });
  it('should filter token excluding sourceIds', () => {
    const sourceIds: TokenSourceIds = { exclude: ['aSourceId'] };

    const engine = createSDTFEngine(tokens);
    const filter = makeTokenWithSourceIdsFilter(sourceIds);
    const allNodes = engine.query.getAllTokenStates();

    const results = allNodes.filter(filter);

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe('aStringWithAnotherSourceId');
    expect(results[1].name).toBe('aStringWithoutSourceId');
  });
});
