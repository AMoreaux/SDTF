import { describe, it, expect } from 'vitest';
import {
  specifyDesignTokenValueModeSchema,
  validateSpecifyDesignTokenValueMode,
} from '../../../src/definitions/internals/designTokenMode.js';

describe('designTokenMode', () => {
  describe.concurrent('validateSpecifyDesignTokenValueMode', () => {
    it('should validate a non-empty string', () => {
      const input = 'someMode';
      const result = validateSpecifyDesignTokenValueMode(input);
      expect(result).toBe(input);
    });
  });
  describe.concurrent('specifyDesignTokenValueModeSchema', () => {
    it('should validate a non-empty string', () => {
      const input = 'someMode';
      const result = specifyDesignTokenValueModeSchema.parse(input);
      expect(result).toBe(input);
    });
    it('fail validating when the string is empty', () => {
      const input = '';
      expect(() => specifyDesignTokenValueModeSchema.parse(input)).toThrow(
        '$mode must be a non-empty string',
      );
    });
    it('fail validating when the string starts with a "$"', () => {
      const input = '$someMode';
      expect(() => specifyDesignTokenValueModeSchema.parse(input))
        .toThrowErrorMatchingInlineSnapshot(`
        [ZodError: [
          {
            "code": "custom",
            "message": "$mode cannot start with a \\\"$\\\"",
            "path": []
          }
        ]]
      `);
    });
  });
});
