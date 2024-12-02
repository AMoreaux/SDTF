import { describe, it, expect } from 'vitest';

import { designTokenFixtures } from './designTokenType.fixtures.js';

import { PickSpecifyDesignToken } from '../../src/index.js';
import { Expect, Equal } from '../_utils.js';

import {
  SpecifyDesignTokenTypeName,
  validateSpecifyAliasableDesignToken,
  validateSpecifyDesignTokenTypeName,
  validateSpecifyNonAliasableDesignToken,
  getDesignTokenDefinition,
} from '../../src/definitions/designTokenDefinitions.js';

describe.concurrent('designTokenDefinitions', () => {
  describe('validateSpecifyAliasableDesignToken', () => {
    it('should validate a minimal token', () => {
      const input: PickSpecifyDesignToken<'string'> = {
        $type: 'string',
        $value: {
          default: { $alias: 'some.string-alias', $mode: 'dope' },
        },
      };
      const result = validateSpecifyAliasableDesignToken(input);
      result.$type;
      expect(result).toStrictEqual(input);
    });
    it('should validate a minimal token using top level aliasing', () => {
      const input = {
        $type: 'color',
        $value: {
          $alias: 'some.color-alias',
        },
      };
      const result = validateSpecifyAliasableDesignToken(input);
      expect(result).toStrictEqual(input);
    });
    it('should fail validating a token with a missing $type', () => {
      const input = {
        $value: '',
      };
      expect(() => {
        validateSpecifyAliasableDesignToken(input);
      }).toThrowErrorMatchingSnapshot();
    });
    it('should fail validating a token with a missing $value', () => {
      const input = {
        $type: 'string',
      };
      expect(() => {
        validateSpecifyAliasableDesignToken(input);
      }).toThrowErrorMatchingSnapshot();
    });
    it('should validate a token with $description and $extensions', () => {
      const input: PickSpecifyDesignToken<'string'> = {
        $type: 'string',
        $value: { default: 'someString' },
        $description: 'some description',
        $extensions: {
          someExtension: 'someValue',
        },
      };
      const result = validateSpecifyAliasableDesignToken(input);
      expect(result).toStrictEqual(input);
    });
    it('should fail validating a token with an invalid $description', () => {
      const input = {
        $type: 'string',
        $value: { default: 'someString' },
        $description: 123,
      };
      expect(() => {
        validateSpecifyAliasableDesignToken(input);
      }).toThrowErrorMatchingSnapshot();
    });
    it('should fail validating a token with an invalid $extensions', () => {
      expect(() => {
        validateSpecifyAliasableDesignToken({
          $type: 'string',
          $value: { default: 'someString' },
          $extensions: 123,
        });
      }).toThrowErrorMatchingSnapshot();

      expect(() => {
        validateSpecifyAliasableDesignToken({
          $type: 'string',
          $value: 'someString',
          $extensions: {
            someExtension: () => {},
          },
        });
      }).toThrowErrorMatchingSnapshot();
    });
    it('should INCORRECTLY validate a token with an invalid deeply nested $extensions', () => {
      // This is a chosen performance optimization, we don't want to validate deeply nested objects
      const invalidInput: PickSpecifyDesignToken<'string'> = {
        $type: 'string',
        $value: { default: 'someString' },
        $extensions: {
          someExtension: {
            someOtherExtension: () => {},
          },
        },
      };
      const result = validateSpecifyAliasableDesignToken(invalidInput);
      expect(result).toStrictEqual(invalidInput);
    });
    it('should validate all available token types', ({ expect }) => {
      designTokenFixtures.forEach(token => {
        const result = validateSpecifyAliasableDesignToken(token);
        expect(result).toStrictEqual(token);
      });
      expect.assertions(designTokenFixtures.length);
    });
  });
  describe('validateSpecifyNonAliasableDesignToken', () => {
    it('should fail validating a token with an alias', () => {
      const input = {
        $type: 'color',
        $value: {
          $alias: 'some.color-alias',
        },
      };
      expect(() => {
        validateSpecifyNonAliasableDesignToken(input);
      }).toThrowErrorMatchingSnapshot();
    });
    it('should validate all available token types', ({ expect }) => {
      designTokenFixtures.forEach(token => {
        const result = validateSpecifyNonAliasableDesignToken(token);
        expect(result).toStrictEqual(token);
      });
      expect.assertions(designTokenFixtures.length);
    });
  });
  describe('getDesignTokenDefinition', () => {
    it('should return a token definition', () => {
      const result = getDesignTokenDefinition('string');

      expect(result.type).toBe('string');
    });
    it('should fail when the token type does not exist', () => {
      expect(() => {
        getDesignTokenDefinition(
          // @ts-expect-error - intentionally invalid token type
          'notATokenType',
        );
      }).toThrow('Unknown design token type: "notATokenType".');
    });
  });
  describe('validateSpecifyDesignTokenTypeName', () => {
    it('should validate a valid token type name', () => {
      const result = validateSpecifyDesignTokenTypeName('string');

      type R = Expect<Equal<typeof result, SpecifyDesignTokenTypeName>>;
    });
    it('should fail validating a token type name containing "."', () => {
      expect(() => {
        validateSpecifyDesignTokenTypeName('a.color');
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
