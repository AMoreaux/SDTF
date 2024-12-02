import { describe, it, expect, vi } from 'vitest';
import { SpecifyDesignTokenFormat } from '../../../../src/index.js';
import { traverseTokenTree } from '../../../../src/engine/parser/internals/traverseTokenTree.js';

describe.concurrent('traverseTokenTree', () => {
  it('should traverse a token tree and grab all properties', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aColorCollection: {
        $collection: {
          $modes: ['light', 'dark'],
        },
        $description: 'A collection of colors',
        $extensions: {
          'com.specifyapp.extensions.color': '1.0.0',
        },
        aColor: {
          $type: 'color',
          $value: {
            light: { model: 'hex', hex: '#ffffff', alpha: 1 },
            dark: { model: 'hex', hex: '#000000', alpha: 1 },
          },
          $description: 'A color',
          $extensions: {
            'com.specifyapp.extensions.active': true,
          },
        },
      },
      aGroup: {
        $description: 'A group',
        $extensions: {
          'com.specifyapp.extensions.active': true,
        },
      },
    };

    const onToken = vi.fn();
    const onCollection = vi.fn();
    const onGroup = vi.fn();

    traverseTokenTree(tokenTree as any, {
      onToken,
      onCollection,
      onGroup,
    });

    expect(onToken).toHaveBeenCalledTimes(1);
    expect(onToken).toHaveBeenCalledWith(['aColorCollection', 'aColor'], {
      $type: 'color',
      $value: {
        light: { model: 'hex', hex: '#ffffff', alpha: 1 },
        dark: { model: 'hex', hex: '#000000', alpha: 1 },
      },
      $description: 'A color',
      $extensions: {
        'com.specifyapp.extensions.active': true,
      },
    });

    expect(onCollection).toHaveBeenCalledTimes(1);
    expect(onCollection).toHaveBeenCalledWith(['aColorCollection'], {
      $collection: {
        $modes: ['light', 'dark'],
      },
      $description: 'A collection of colors',
      $extensions: {
        'com.specifyapp.extensions.color': '1.0.0',
      },
    });

    expect(onGroup).toHaveBeenCalledTimes(1);
    expect(onGroup).toHaveBeenCalledWith(['aGroup'], {
      $description: 'A group',
      $extensions: {
        'com.specifyapp.extensions.active': true,
      },
    });
  });
});
