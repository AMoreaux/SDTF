import { describe, it, expect } from 'vitest';
import { deepResolveAnalyzedTokenModes } from '../../../../src/engine/parser/internals/deepResolveAnalyzedTokenModes.js';
import { ValuePath } from '../../../../src/engine/state/path/ValuePath.js';
import { TreeNodeSet } from '../../../../src/index.js';

import { AnalyzedToken } from '../../../../src/engine/parser/internals/parseRawToken.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('deepResolveAnalyzedTokenModes', () => {
  it('should return undefined if no token is found', () => {
    const result = deepResolveAnalyzedTokenModes('stringPath', new TreeNodeSet());

    expect(result).toBe(undefined);
  });
  it('should return local modes when exist', () => {
    const analyzedTokens = new TreeNodeSet<AnalyzedToken>();
    const analyzedToken: AnalyzedToken = {
      path: new TreePath(['a', 'token']),
      name: 'token',
      modes: ['mode 1', 'mode 2'],
      $type: 'string',
      $extensions: undefined,
      $description: undefined,
      $value: {
        'mode 1': 'mode 1 value',
        'mode 2': 'mode 2 value',
      },
      definition: {} as any,
      isTopLevelAlias: false,
      analyzedValueAliasParts: [],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'mode 1',
          valuePath: new ValuePath([]),
          value: 'mode 1 value',
        },
        {
          type: 'primitive',
          localMode: 'mode 2',
          valuePath: new ValuePath([]),
          value: 'mode 2 value',
        },
      ],
      computedModes: undefined,
    };
    analyzedTokens.add(analyzedToken);

    const result = deepResolveAnalyzedTokenModes('a.token', analyzedTokens);

    expect(result).toStrictEqual(['mode 1', 'mode 2']);
  });
  it('should return computed modes when exist', () => {
    const analyzedTokens = new TreeNodeSet<AnalyzedToken>();
    const analyzedToken: AnalyzedToken = {
      path: new TreePath(['a', 'token']),
      name: 'token',
      modes: null,
      $type: 'string',
      $extensions: undefined,
      $description: undefined,
      $value: {
        $alias: 'topLevelAlias',
      },
      definition: {} as any,
      isTopLevelAlias: false,
      analyzedValueAliasParts: [
        {
          type: 'topLevelAlias',
          alias: {
            path: new TreePath(['topLevelAlias']),
          },
          isResolvable: true,
        },
      ],
      analyzedValuePrimitiveParts: [],
      computedModes: ['mode 1', 'mode 2'],
    };
    analyzedTokens.add(analyzedToken);

    const result = deepResolveAnalyzedTokenModes('a.token', analyzedTokens);

    expect(result).toStrictEqual(['mode 1', 'mode 2']);
  });
  it('should dive to the next alias when no local nor computed modes exist, and update the computedModes value', () => {
    const analyzedTokens = new TreeNodeSet<AnalyzedToken>();

    const targetAnalyzedToken: AnalyzedToken = {
      path: new TreePath(['aTopLevelAlias']),
      name: 'aTopLevelAlias',
      modes: ['mode 1', 'mode 2'],
      $type: 'string',
      $extensions: undefined,
      $description: undefined,
      $value: {
        'mode 1': 'mode 1 value',
        'mode 2': 'mode 2 value',
      },
      definition: {} as any,
      isTopLevelAlias: false,
      analyzedValueAliasParts: [],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'mode 1',
          valuePath: new ValuePath([]),
          value: 'mode 1 value',
        },
        {
          type: 'primitive',
          localMode: 'mode 2',
          valuePath: new ValuePath([]),
          value: 'mode 2 value',
        },
      ],
      computedModes: undefined,
    };
    analyzedTokens.add(targetAnalyzedToken);

    const sourceAnalyzedToken: AnalyzedToken = {
      path: new TreePath(['a', 'token']),
      name: 'token',
      modes: null,
      $type: 'string',
      $extensions: undefined,
      $description: undefined,
      $value: {
        $alias: 'aTopLevelAlias',
      },
      definition: {} as any,
      isTopLevelAlias: false,
      analyzedValueAliasParts: [
        {
          type: 'topLevelAlias',
          alias: {
            path: new TreePath(['aTopLevelAlias']),
          },
        },
      ],
      analyzedValuePrimitiveParts: [],
      computedModes: undefined,
    };
    analyzedTokens.add(sourceAnalyzedToken);

    const result = deepResolveAnalyzedTokenModes('a.token', analyzedTokens);

    const mutatedToken = analyzedTokens.getOne('a.token');
    expect((mutatedToken as any).computedModes).toStrictEqual(['mode 1', 'mode 2']);

    expect(result).toStrictEqual(['mode 1', 'mode 2']);
  });
  it('should dive to the next alias and return undefined if the aliased token does not exist', () => {
    const analyzedTokens = new TreeNodeSet<AnalyzedToken>();

    const analyzedToken: AnalyzedToken = {
      path: new TreePath(['a', 'token']),
      name: 'token',
      modes: null,
      $type: 'string',
      $extensions: undefined,
      $description: undefined,
      $value: {
        $alias: 'aTopLevelAlias',
      },
      definition: {} as any,
      isTopLevelAlias: false,
      analyzedValueAliasParts: [
        {
          type: 'topLevelAlias',
          alias: {
            path: new TreePath(['aTopLevelAlias']),
          },
        },
      ],
      analyzedValuePrimitiveParts: [],
      computedModes: undefined,
    };
    analyzedTokens.add(analyzedToken);

    const result = deepResolveAnalyzedTokenModes('a.token', analyzedTokens);

    expect(result).toBe(undefined);
  });
});
