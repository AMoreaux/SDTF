import { describe, it, expect } from 'vitest';

import {
  matchIsModeAndValueLevelAliasSignature,
  matchIsTopLevelAliasSignature,
  SDTF_PATH_SEPARATOR,
  specifyModeAndValueLevelAliasSignatureSchema,
  specifyTopLevelAliasSignatureSchema,
  WithTopLevelAlias,
} from '../../../src/index.js';
import { Equal, Expect } from '../../_utils.js';

import {
  matchIsDesignTokenAliasSignature,
  specifyAliasStringValueSchema,
  stripDesignTokenAliasValue,
} from '../../../src/definitions/internals/designTokenAlias.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('Top level alias', () => {
  describe.concurrent('specifyTopLevelAliasSignatureSchema', () => {
    it('should return an object with $alias property', () => {
      const result = specifyTopLevelAliasSignatureSchema.safeParse({ $alias: 'myAlias' });
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual({ $alias: 'myAlias' });
    });
    it('should return an error if $alias property is missing', () => {
      const result = specifyTopLevelAliasSignatureSchema.safeParse({});
      expect(result.success).toBe(false);
      expect((result as any).error.message).toContain('$alias');
    });
    it('should return an error if $alias property is not a string', () => {
      const result = specifyTopLevelAliasSignatureSchema.safeParse({ $alias: 123 });
      expect(result.success).toBe(false);
      expect((result as any).error.message).toContain('$alias');
    });
    it('should not allow additional properties', () => {
      const result = specifyTopLevelAliasSignatureSchema.safeParse({
        $alias: 'myAlias',
        foo: 'bar',
      });
      expect(result.success).toBe(false);
    });
    it('should check type of WithTopLevelAlias', () => {
      type WithAlias = WithTopLevelAlias<string>;
      type Expected = Expect<Equal<WithAlias, string | { $alias: string }>>;
    });
  });

  describe.concurrent('matchIsTopLevelAliasSignature', () => {
    it('should return true for an object with $alias property and no $mode property', () => {
      const result = matchIsTopLevelAliasSignature({ $alias: 'myAlias' });
      expect(result).toBe(true);
    });
    it('should return false for null', () => {
      const result = matchIsTopLevelAliasSignature(null);
      expect(result).toBe(false);
    });
    it('should return false for an array', () => {
      const result = matchIsTopLevelAliasSignature([]);
      expect(result).toBe(false);
    });
    it('should return false for a string', () => {
      const result = matchIsTopLevelAliasSignature('myAlias');
      expect(result).toBe(false);
    });
    it('should return false for an object with $mode property', () => {
      const result = matchIsTopLevelAliasSignature({ $alias: 'myAlias', $mode: 'default' });
      expect(result).toBe(false);
    });
    it('should return false for an object without $alias property', () => {
      const result = matchIsTopLevelAliasSignature({ foo: 'bar' });
      expect(result).toBe(false);
    });
    it('should return false for an object with a non-string $alias property', () => {
      const result = matchIsTopLevelAliasSignature({ $alias: 123 });
      expect(result).toBe(false);
    });
  });
});

describe.concurrent('Mode and Value level alias', () => {
  describe.concurrent('specifyModeAndValueLevelAliasSignatureSchema', () => {
    it('should return an object with $alias and $mode properties', () => {
      const result = specifyModeAndValueLevelAliasSignatureSchema.safeParse({
        $alias: 'myAlias',
        $mode: 'default',
      });
      expect(result.success).toBe(true);
      expect((result as any).data).toEqual({ $alias: 'myAlias', $mode: 'default' });
    });
    it('should throw an error if $alias property is missing', () => {
      const result = specifyModeAndValueLevelAliasSignatureSchema.safeParse({ $mode: 'default' });
      expect(result.success).toBe(false);
      expect((result as any).error.message).toContain('$alias');
    });
    it('should throw an error if $alias property is not a string', () => {
      const result = specifyModeAndValueLevelAliasSignatureSchema.safeParse({
        $alias: 123,
        $mode: 'default',
      });
      expect(result.success).toBe(false);
      expect((result as any).error.message).toContain('$alias');
    });
    it('should throw an error if $mode property is missing', () => {
      const result = specifyModeAndValueLevelAliasSignatureSchema.safeParse({ $alias: 'myAlias' });
      expect(result.success).toBe(false);
      expect((result as any).error.message).toContain('$mode');
    });
    it('should throw an error if $mode property is not a string', () => {
      const result = specifyModeAndValueLevelAliasSignatureSchema.safeParse({
        $alias: 'myAlias',
        $mode: 123,
      });
      expect(result.success).toBe(false);
      expect((result as any).error.message).toContain('$mode');
    });
    it('should not allow additional properties', () => {
      const result = specifyModeAndValueLevelAliasSignatureSchema.safeParse({
        $alias: 'myAlias',
        $mode: 'default',
        foo: 'bar',
      });
      expect(result.success).toBe(false);
    });
  });

  describe.concurrent('matchIsModeAndValueLevelAliasSignature', () => {
    it('should return true for an object with $alias and $mode properties and a string $mode value', () => {
      const result = matchIsModeAndValueLevelAliasSignature({
        $alias: 'myAlias',
        $mode: 'default',
      });
      expect(result).toBe(true);
    });
    it('should return false for null', () => {
      const result = matchIsModeAndValueLevelAliasSignature(null);
      expect(result).toBe(false);
    });
    it('should return false for an array', () => {
      const result = matchIsModeAndValueLevelAliasSignature([]);
      expect(result).toBe(false);
    });
    it('should return false for a string', () => {
      const result = matchIsModeAndValueLevelAliasSignature('myAlias');
      expect(result).toBe(false);
    });
    it('should return false for an object without $alias property', () => {
      const result = matchIsModeAndValueLevelAliasSignature({ $mode: 'default' });
      expect(result).toBe(false);
    });
    it('should return false for an object without $mode property', () => {
      const result = matchIsModeAndValueLevelAliasSignature({ $alias: 'myAlias' });
      expect(result).toBe(false);
    });
    it('should return false for an object with a non-string $mode property', () => {
      const result = matchIsModeAndValueLevelAliasSignature({ $alias: 'myAlias', $mode: 123 });
      expect(result).toBe(false);
    });
    it('should return false for an object with a non-string $alias property', () => {
      const result = matchIsModeAndValueLevelAliasSignature({ $alias: 123, $mode: 'default' });
      expect(result).toBe(false);
    });
  });
});

describe.concurrent('Generic alias', () => {
  describe.concurrent('specifyAliasStringValueSchema', () => {
    it('Should fail parsing a string containing "." only', () => {
      expect(() => specifyAliasStringValueSchema.parse('.')).toThrow();
      expect(() => specifyAliasStringValueSchema.parse('..')).toThrow();
      expect(() => specifyAliasStringValueSchema.parse('...')).toThrow();
    });
    it('Should fail parsing a string ending with "."', () => {
      expect(() => specifyAliasStringValueSchema.parse('alias.')).toThrow();
    });
    it('Should fail parsing a string starting with "."', () => {
      expect(() => specifyAliasStringValueSchema.parse('.alias')).toThrow();
    });
    it('Should fail parsing a string separated by more than one "."', () => {
      expect(() => specifyAliasStringValueSchema.parse('alias..child')).toThrow();
      expect(() => specifyAliasStringValueSchema.parse('alias...child')).toThrow();
    });
  });

  describe.concurrent('matchIsDesignTokenAlias', () => {
    it('Should match a non-empty string', () => {
      const result = matchIsDesignTokenAliasSignature({
        $alias: 'a-group with Spaces',
      });
      expect(result).toBe(true);
    });
    it('Should match a non-empty string with mode', () => {
      const result = matchIsDesignTokenAliasSignature({
        $alias: 'a-group with Spaces',
        $mode: 'dark',
      });
      expect(result).toBe(true);
    });
    it('Should match a non-empty string containing SDTF separator', () => {
      const result = matchIsDesignTokenAliasSignature({
        $alias:
          'alias' + SDTF_PATH_SEPARATOR + 'child' + SDTF_PATH_SEPARATOR + 'other-group with Spaces',
      });
      expect(result).toBe(true);
    });
    it('Should fail matching a string', () => {
      const result = matchIsDesignTokenAliasSignature('{an-invalid-alias}');
      expect(result).toBe(false);
    });
    it('Should fail matching a number', () => {
      const result = matchIsDesignTokenAliasSignature(123);
      expect(result).toBe(false);
    });
    it('Should fail matching a boolean', () => {
      const result = matchIsDesignTokenAliasSignature(true);
      expect(result).toBe(false);
    });
    it('Should fail matching null', () => {
      const result = matchIsDesignTokenAliasSignature(null);
      expect(result).toBe(false);
    });
    it('Should fail matching an object literal', () => {
      const result = matchIsDesignTokenAliasSignature({});
      expect(result).toBe(false);
    });
    it('Should fail matching an array', () => {
      const result = matchIsDesignTokenAliasSignature([]);
      expect(result).toBe(false);
    });
  });

  describe.concurrent('stripDesignTokenAliasValue', () => {
    it('Should strip a top level alias value', () => {
      const input = {
        $alias: 'alias',
      };
      const result = stripDesignTokenAliasValue(input);
      expect(result).toStrictEqual({
        isTopLevelAlias: true,
        alias: 'alias',
        currentPath: new TreePath(['alias']),
        designTokenName: 'alias',
        mode: undefined,
      });
    });
    it('Should strip a mode and level alias value with mode', () => {
      const input = {
        $alias: 'alias',
        $mode: 'dark',
      };
      const result = stripDesignTokenAliasValue(input);
      expect(result).toStrictEqual({
        isTopLevelAlias: false,
        alias: 'alias',
        currentPath: new TreePath(['alias']),
        designTokenName: 'alias',
        mode: 'dark',
      });
    });
    it('Should strip a complex alias value', () => {
      const input = {
        $alias: 'alias.child.other-group with Spaces',
      };
      const result = stripDesignTokenAliasValue(input);
      expect(result).toStrictEqual({
        isTopLevelAlias: true,
        alias: 'alias.child.other-group with Spaces',
        currentPath: new TreePath(['alias', 'child', 'other-group with Spaces']),
        designTokenName: 'other-group with Spaces',
        mode: undefined,
      });
    });
  });
});
