import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { createTreeStateFromTokenTree } from '../../_utils/createTreeStateFromTokenTree.js';
import { TokenState } from '../../../src/index.js';

import { createTokenState } from '../../../src/engine/builder/createTokenState.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('createTokenState', () => {
  it('should create a token state', () => {
    const treeState = createTreeStateFromTokenTree({});

    const result = createTokenState(treeState, {
      path: new TreePath(['aGroup', 'aString']),
      name: 'aString',
      $type: 'string',
      $value: {
        default: 'a string value',
      },
      $description: 'A string token desc',
      $extensions: {},
      definition: {} as any,
      isTopLevelAlias: false,
      modes: ['default'],
      analyzedValueAliasParts: [],
      analyzedValuePrimitiveParts: [
        {
          type: 'primitive',
          localMode: 'default',
          valuePath: new ValuePath([]),
          value: 'a string value',
        },
      ],
      isFullyResolvable: true,
      modesResolvability: {
        default: true,
      },
    });

    expect(result).toBeInstanceOf(TokenState);
    expect(result.path).toStrictEqual(new TreePath(['aGroup', 'aString']));
    expect(result.path.toString()).toBe('aGroup.aString');
    expect(result.name).toBe('aString');
    expect(result.description).toBe('A string token desc');
    expect(result.extensions).toStrictEqual({});

    expect(result.value).toStrictEqual({
      default: 'a string value',
    });
  });

  it('should fail when analyzedToken.isFullyResolvable is undefined', () => {
    const treeState = createTreeStateFromTokenTree({});

    expect(() => {
      createTokenState(treeState, {
        path: new TreePath(['aGroup', 'aString']),
        name: 'aString',
        $type: 'string',
        $value: {
          default: 'a string value',
        },
        $description: 'A string token desc',
        $extensions: {},
        definition: {} as any,
        isTopLevelAlias: false,
        modes: ['default'],
        analyzedValueAliasParts: [],
        analyzedValuePrimitiveParts: [
          {
            type: 'primitive',
            localMode: 'default',
            valuePath: new ValuePath([]),
            value: 'a string value',
          },
        ],
        modesResolvability: {
          default: true,
        },
      });
    }).toThrowError('isFullyResolvable is undefined');
  });
  it('should fail when analyzedToken.modesResolvability is undefined', () => {
    const treeState = createTreeStateFromTokenTree({});

    expect(() => {
      createTokenState(treeState, {
        path: new TreePath(['aGroup', 'aString']),
        name: 'aString',
        $type: 'string',
        $value: {
          default: 'a string value',
        },
        $description: 'A string token desc',
        $extensions: {},
        definition: {} as any,
        isTopLevelAlias: false,
        modes: ['default'],
        analyzedValueAliasParts: [],
        analyzedValuePrimitiveParts: [
          {
            type: 'primitive',
            localMode: 'default',
            valuePath: new ValuePath([]),
            value: 'a string value',
          },
        ],
        isFullyResolvable: true,
      });
    }).toThrowError('modesResolvability is undefined');
  });
});
