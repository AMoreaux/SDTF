import { describe, it, expect } from 'vitest';
import { findOrRegisterTokenState } from '../../../src/engine/builder/findOrRegisterTokenState.js';
import {
  analyzeTokenTree,
  createTreeState,
  SpecifyDesignTokenFormat,
  TokenState,
  TreeNodesState,
} from '../../../src/index.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('findOrRegisterTokenState', () => {
  it('should find an already registered token state in tokensState', () => {
    const tokenTree: SpecifyDesignTokenFormat = {
      aGroup: {
        aString: { $type: 'string', $value: { default: 'a string value' } },
      },
    };

    const analyzedTokenTree = analyzeTokenTree(tokenTree);

    const globalState = new TreeNodesState();
    const treeState = createTreeState(analyzedTokenTree, {
      globalState,
    });

    const tokenState = findOrRegisterTokenState(
      'aGroup.aString',
      globalState.tokens,
      analyzedTokenTree.analyzedTokens,
      treeState,
    );

    expect(tokenState).toBeInstanceOf(TokenState);
    expect(tokenState.path).toStrictEqual(new TreePath(['aGroup', 'aString']));
    expect(tokenState.value).toStrictEqual({ default: 'a string value' });
  });
  it('should find and register a non registered token state from analyzedTokens', () => {
    const analyzedTokenTree = analyzeTokenTree({
      aGroup: { aString: { $type: 'string', $value: { default: 'a string value' } } },
    });

    const globalState = new TreeNodesState();
    const treeState = createTreeState(analyzedTokenTree, {
      globalState,
    });

    const tokenState = findOrRegisterTokenState(
      'aGroup.aString',
      globalState.tokens,
      analyzedTokenTree.analyzedTokens,
      treeState,
    );

    expect(tokenState).toBeInstanceOf(TokenState);
    expect(tokenState.path).toStrictEqual(new TreePath(['aGroup', 'aString']));
    expect(tokenState.value).toStrictEqual({ default: 'a string value' });
  });
  it('should fail when tokenPath is not found in neither locations', () => {
    const analyzedTokenTree = analyzeTokenTree({
      aGroup: { aString: { $type: 'string', $value: { default: 'a string value' } } },
    });

    const globalState = new TreeNodesState();
    const treeState = createTreeState(analyzedTokenTree, {
      globalState,
    });

    expect(() => {
      findOrRegisterTokenState(
        'aGroup.aStringNotFound',
        globalState.tokens,
        analyzedTokenTree.analyzedTokens,
        treeState,
      );
    }).toThrowError('AnalyzedToken not found for token with path: aGroup.aStringNotFound');
  });
});
