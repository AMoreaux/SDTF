import { describe, it, expect } from 'vitest';
import { z } from 'zod';

import { Equal, Expect } from '../../_utils.js';
import {
  SpecifyModeAndValueLevelAliasSignature,
  SpecifyTopLevelAliasSignature,
} from '../../../src/index.js';
import { TreeNodeExtensions } from '../../../src/definitions/internals/designTokenTree.js';

import {
  SpecifyDesignTokenSignature,
  matchIsDesignTokenSignature,
  makeSpecifyDesignTokenSchema,
  validateSpecifyGenericDesignTokenSignature,
} from '../../../src/definitions/internals/designTokenSignature.js';

describe.concurrent('designTokenSignature', () => {
  describe.concurrent('SpecifyDesignTokenSignature', () => {
    it('Should match the various return types', () => {
      type TopLevel = Expect<
        Equal<
          SpecifyDesignTokenSignature<string, unknown, string>,
          {
            $type: string;
            $value:
              | SpecifyTopLevelAliasSignature
              | { [mode: string]: unknown | SpecifyModeAndValueLevelAliasSignature };
            $description?: string;
            $extensions?: TreeNodeExtensions;
          }
        >
      >;

      type ContainedLevel = Expect<
        Equal<
          SpecifyDesignTokenSignature<string, unknown, 'dark'>['$value'],
          | SpecifyTopLevelAliasSignature
          | {
              dark: unknown | SpecifyModeAndValueLevelAliasSignature<'dark'>;
            }
        >
      >;
    });
  });
  describe.concurrent('matchIsDesignTokenSignature', () => {
    it('should return true if the object is a design token signature', () => {
      const result = matchIsDesignTokenSignature({
        $type: 'string',
        $value: { default: 'aString' },
      });
      expect(result).toBe(true);
    });
    it('Should match an object containing a defined "$value" and a string "$type"', () => {
      expect(matchIsDesignTokenSignature({ $value: 'someString', $type: 'string' })).toBe(true);
      expect(matchIsDesignTokenSignature({ $value: 0, $type: 'string' })).toBe(true);
      expect(matchIsDesignTokenSignature({ $value: false, $type: 'string' })).toBe(true);
      expect(matchIsDesignTokenSignature({ $value: null, $type: 'string' })).toBe(true);
    });
    it('Should not match an object not containing a defined "$value"', () => {
      expect(matchIsDesignTokenSignature({})).toBe(false);
      expect(matchIsDesignTokenSignature({ $value: undefined })).toBe(false);
    });
    it('Should not match any other JSON literal types', () => {
      expect(matchIsDesignTokenSignature('someString')).toBe(false);
      expect(matchIsDesignTokenSignature(0)).toBe(false);
      expect(matchIsDesignTokenSignature(1)).toBe(false);
      expect(matchIsDesignTokenSignature(false)).toBe(false);
      expect(matchIsDesignTokenSignature(true)).toBe(false);
      expect(matchIsDesignTokenSignature(null)).toBe(false);
      expect(matchIsDesignTokenSignature([])).toBe(false);
    });
  });

  describe.concurrent('makeSpecifyDesignTokenSchema', () => {
    it('should assemble an aliasable schema for a type with a value', () => {
      const schema = makeSpecifyDesignTokenSchema('someType', z.string(), true);
      const input = {
        $type: 'someType',
        $value: { default: 'someValue' },
      };
      const result = schema.parse(input);
      expect(result).toStrictEqual(input);

      const inputWithDescriptionAndExtensions = {
        ...input,
        $description: 'someDescription',
        $extensions: {
          someExtension: 'someValue',
        },
      };
      const resultWithDescriptionAndExtensions = schema.parse(inputWithDescriptionAndExtensions);
      expect(resultWithDescriptionAndExtensions).toStrictEqual(inputWithDescriptionAndExtensions);
    });
    it('should assemble an aliasable schema for a type with an alias', () => {
      const schema = makeSpecifyDesignTokenSchema('someType', z.string(), true);
      const input = {
        $type: 'someType',
        $value: { $alias: 'someAlias' },
      };
      const result = schema.parse(input);
      expect(result).toStrictEqual(input);

      const inputWithDescriptionAndExtensions = {
        ...input,
        $description: 'someDescription',
        $extensions: {
          someExtension: 'someValue',
        },
      };
      const resultWithDescriptionAndExtensions = schema.parse(inputWithDescriptionAndExtensions);
      expect(resultWithDescriptionAndExtensions).toStrictEqual(inputWithDescriptionAndExtensions);
    });
    it('should assemble an non-aliasable schema for a type with a value', () => {
      const schema = makeSpecifyDesignTokenSchema('someType', z.string(), false);
      const input = {
        $type: 'someType',
        $value: { default: 'someValue' },
      };
      const result = schema.parse(input);
      expect(result).toStrictEqual(input);

      const inputWithDescriptionAndExtensions = {
        ...input,
        $description: 'someDescription',
        $extensions: {
          someExtension: 'someValue',
        },
      };
      const resultWithDescriptionAndExtensions = schema.parse(inputWithDescriptionAndExtensions);
      expect(resultWithDescriptionAndExtensions).toStrictEqual(inputWithDescriptionAndExtensions);
    });
    it('should assemble an non-aliasable schema for a type with an alias and fail', () => {
      const schema = makeSpecifyDesignTokenSchema('someType', z.string(), false);
      const input = {
        $type: 'someType',
        $value: { $alias: 'someAlias' },
      };
      const result = schema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe.concurrent('validateSpecifyGenericDesignTokenSignature', () => {
    it('should validate a minimal valid design token signature', () => {
      const input = {
        $type: 'someType',
        $value: { default: 'someValue' },
      };
      const result = validateSpecifyGenericDesignTokenSignature(input);
      expect(result).toStrictEqual(input);
    });
    it('should validate a full valid design token signature', () => {
      const input = {
        $type: 'someType',
        $value: { default: 'someValue' },
        $description: 'someDescription',
        $extensions: { extended: true },
      };
      const result = validateSpecifyGenericDesignTokenSignature(input);
      expect(result).toStrictEqual(input);
    });
    it('should fail to validate a design token signature with extra keys', () => {
      const input = {
        $type: 'someType',
        $value: { default: 'someValue' },
        $description: 'someDescription',
        $extensions: {},
        $extraKey: 'someValue',
      };

      expect(() => {
        validateSpecifyGenericDesignTokenSignature(input);
      }).toThrow(`[
  {
    "code": "unrecognized_keys",
    "keys": [
      "$extraKey"
    ],
    "path": [],
    "message": "Unrecognized key(s) in object: '$extraKey'"
  }
]`);
    });
  });
});
