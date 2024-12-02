import { describe, it, expect } from 'vitest';
import { ValuePath } from '../../../../src/engine/state/path/ValuePath.js';
import { SpecifyDesignTokenFormat } from '../../../../src/index.js';

import { createTreeStateFromTokenTree } from '../../../_utils/createTreeStateFromTokenTree.js';

import {
  matchIsResolvableTopLevelAlias,
  matchIsUnresolvableTopLevelAlias,
  matchIsResolvableModeLevelAlias,
  matchIsUnresolvableModeLevelAlias,
  matchIsResolvableValueLevelAlias,
  matchIsUnresolvableValueLevelAlias,
  ResolvableTopLevelAlias,
  UnresolvableTopLevelAlias,
  ResolvableModeLevelAlias,
  UnresolvableModeLevelAlias,
  ResolvableValueLevelAlias,
  UnresolvableValueLevelAlias,
} from '../../../../src/engine/state/statefulValue/aliasing.js';
import { TreePath } from '../../../../src/engine/state/path/TreePath.js';

describe.concurrent('Stateful Value Aliasing', () => {
  describe.concurrent('ResolvableTopLevelAlias', () => {
    describe.concurrent('isFullyResolvable', () => {
      it('should return true if underlying tokenState.isFullyResolvable is true', () => {
        const tokens: SpecifyDesignTokenFormat = {
          aDimension: {
            $type: 'dimension',
            $value: { default: { unit: 'px', value: 10 } },
          },
          aRefDimension: {
            $type: 'dimension',
            $value: { $alias: 'aDimension' },
          },
        };
        const treeState = createTreeStateFromTokenTree(tokens);

        const maybeTokenState = treeState.getTokenState(new TreePath(['aRefDimension']));
        if (!maybeTokenState) throw new Error('Token state is unresolvable');

        const result = new ResolvableTopLevelAlias({
          tokenState: maybeTokenState,
        }).isFullyResolvable;

        expect(result).toBe(true);
      });
      it('EDGE CASE - should return false if underlying tokenState.isFullyResolvable is false', () => {
        const tokens: SpecifyDesignTokenFormat = {
          aRefDimension: {
            $type: 'dimension',
            $value: { $alias: 'aDimension' }, // unresolvable
          },
        };
        const treeState = createTreeStateFromTokenTree(tokens);

        const maybeTokenState = treeState.getTokenState(new TreePath(['aRefDimension']));
        if (!maybeTokenState) throw new Error('Token state is unresolvable');

        const result = new ResolvableTopLevelAlias({
          tokenState: maybeTokenState,
        }).isFullyResolvable;

        expect(result).toBe(false);
      });
    });
  });
  describe.concurrent('matchIsResolvableTopLevelAlias', () => {
    it('should return true if value is a ResolvableTopLevelAlias', () => {
      const result = matchIsResolvableTopLevelAlias(new ResolvableTopLevelAlias({} as any));

      expect(result).toBe(true);
    });
    it('should return false if value is not a ResolvableTopLevelAlias', () => {
      const result = matchIsResolvableTopLevelAlias({
        _kind: 'UnresolvableTopLevelAlias',
        targetPath: ['a', 'b'],
      });

      expect(result).toBe(false);
    });
  });
  describe.concurrent('matchIsUnresolvableTopLevelAlias', () => {
    it('should return true if value is a UnresolvableTopLevelAlias', () => {
      const result = matchIsUnresolvableTopLevelAlias(new UnresolvableTopLevelAlias({} as any));

      expect(result).toBe(true);
    });
    it('should return false if value is not a UnresolvableTopLevelAlias', () => {
      const result = matchIsUnresolvableTopLevelAlias({
        _kind: 'UnresolvableTopLevelAlias',
        targetPath: ['a', 'b'],
      });

      expect(result).toBe(false);
    });
  });
  describe.concurrent('ResolvableModeLevelAlias', () => {
    describe.concurrent('isFullyResolvable', () => {
      it('should return the underlying tokenState.modesResolvability[targetMode] state', () => {
        const tokens: SpecifyDesignTokenFormat = {
          aDimension: {
            $type: 'dimension',
            $value: {
              small: { unit: 'px', value: 4 },
              medium: { $alias: 'unknown.dimension', $mode: 'default' },
              large: { unit: 'px', value: { $alias: 'unknown.number', $mode: 'default' } },
            },
          },
        };
        const treeState = createTreeStateFromTokenTree(tokens);

        const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
        if (!maybeTokenState) throw new Error('Token state is unresolvable');

        expect(
          new ResolvableModeLevelAlias({
            localMode: 'whatever',
            targetMode: 'small',
            tokenState: maybeTokenState,
          }).isFullyResolvable,
        ).toBe(true);

        expect(
          new ResolvableModeLevelAlias({
            localMode: 'whatever',
            targetMode: 'medium',
            tokenState: maybeTokenState,
          }).isFullyResolvable,
        ).toBe(false);

        expect(
          new ResolvableModeLevelAlias({
            localMode: 'whatever',
            targetMode: 'large',
            tokenState: maybeTokenState,
          }).isFullyResolvable,
        ).toBe(false);
      });
      it('EDGE CASE - should return false if underlying tokenState.modesResolvability is undefined because of an unresolvable top level alias', () => {
        const tokens: SpecifyDesignTokenFormat = {
          aRefDimension: {
            $type: 'dimension',
            $value: { $alias: 'aDimension' }, // unresolvable
          },
        };
        const treeState = createTreeStateFromTokenTree(tokens);

        const maybeTokenState = treeState.getTokenState(new TreePath(['aRefDimension']));
        if (!maybeTokenState) throw new Error('Token state is unresolvable');

        const result = new ResolvableModeLevelAlias({
          localMode: 'light',
          targetMode: 'light',
          tokenState: maybeTokenState,
        }).isFullyResolvable;

        expect(result).toBe(false);
      });
    });
  });
  describe.concurrent('matchIsResolvableModeLevelAlias', () => {
    it('should return true if value is a ResolvableModeLevelAlias', () => {
      const result = matchIsResolvableModeLevelAlias(new ResolvableModeLevelAlias({} as any));

      expect(result).toBe(true);
    });
    it('should return false if value is not a ResolvableModeLevelAlias', () => {
      const result = matchIsResolvableModeLevelAlias({
        _kind: 'UnresolvableModeLevelAlias',
        targetPath: ['a', 'b'],
      });

      expect(result).toBe(false);
    });
  });
  describe.concurrent('matchIsUnresolvableModeLevelAlias', () => {
    it('should return true if value is a UnresolvableModeLevelAlias', () => {
      const result = matchIsUnresolvableModeLevelAlias(new UnresolvableModeLevelAlias({} as any));

      expect(result).toBe(true);
    });
    it('should return false if value is not a UnresolvableModeLevelAlias', () => {
      const result = matchIsUnresolvableModeLevelAlias({
        _kind: 'UnresolvableModeLevelAlias',
        targetPath: ['a', 'b'],
      });

      expect(result).toBe(false);
    });
  });
  describe.concurrent('ResolvableValueLevelAlias', () => {
    describe.concurrent('isFullyResolvable', () => {
      it('should return the underlying tokenState.modesResolvability[targetMode] state', () => {
        const tokens: SpecifyDesignTokenFormat = {
          aDimension: {
            $type: 'dimension',
            $value: {
              small: { unit: 'px', value: 4 },
              medium: { $alias: 'unknown.dimension', $mode: 'default' },
              large: { unit: 'px', value: { $alias: 'unknown.number', $mode: 'default' } },
            },
          },
        };
        const treeState = createTreeStateFromTokenTree(tokens);

        const maybeTokenState = treeState.getTokenState(new TreePath(['aDimension']));
        if (!maybeTokenState) throw new Error('Token state is unresolvable');

        expect(
          new ResolvableValueLevelAlias({
            valuePath: new ValuePath(['offsetX']),
            localMode: 'whatever',
            targetMode: 'small',
            tokenState: maybeTokenState,
          }).isFullyResolvable,
        ).toBe(true);

        expect(
          new ResolvableValueLevelAlias({
            valuePath: new ValuePath(['offsetX']),
            localMode: 'whatever',
            targetMode: 'medium',
            tokenState: maybeTokenState,
          }).isFullyResolvable,
        ).toBe(false);

        expect(
          new ResolvableValueLevelAlias({
            valuePath: new ValuePath(['offsetX']),
            localMode: 'whatever',
            targetMode: 'large',
            tokenState: maybeTokenState,
          }).isFullyResolvable,
        ).toBe(false);
      });
      it('EDGE CASE - should return false if underlying tokenState.modesResolvability is undefined because of an unresolvable top level alias', () => {
        const tokens: SpecifyDesignTokenFormat = {
          aRefDimension: {
            $type: 'dimension',
            $value: { $alias: 'aDimension' }, // unresolvable
          },
        };
        const treeState = createTreeStateFromTokenTree(tokens);

        const maybeTokenState = treeState.getTokenState(new TreePath(['aRefDimension']));
        if (!maybeTokenState) throw new Error('Token state is unresolvable');

        const result = new ResolvableValueLevelAlias({
          valuePath: new ValuePath(['offsetX']),
          localMode: 'light',
          targetMode: 'light',
          tokenState: maybeTokenState,
        }).isFullyResolvable;

        expect(result).toBe(false);
      });
    });
  });
  describe.concurrent('matchIsResolvableValueLevelAlias', () => {
    it('should return true if value is a ResolvableValueLevelAlias', () => {
      const result = matchIsResolvableValueLevelAlias(new ResolvableValueLevelAlias({} as any));

      expect(result).toBe(true);
    });
    it('should return false if value is not a ResolvableValueLevelAlias', () => {
      const result = matchIsResolvableValueLevelAlias({
        _kind: 'UnresolvableValueLevelAlias',
        targetPath: ['a', 'b'],
      });

      expect(result).toBe(false);
    });
  });
  describe.concurrent('matchIsUnresolvableValueLevelAlias', () => {
    it('should return true if value is a UnresolvableValueLevelAlias', () => {
      const result = matchIsUnresolvableValueLevelAlias(new UnresolvableValueLevelAlias({} as any));

      expect(result).toBe(true);
    });
    it('should return false if value is not a UnresolvableValueLevelAlias', () => {
      const result = matchIsUnresolvableValueLevelAlias({
        _kind: 'UnresolvableValueLevelAlias',
        targetPath: ['a', 'b'],
      });

      expect(result).toBe(false);
    });
  });
});
