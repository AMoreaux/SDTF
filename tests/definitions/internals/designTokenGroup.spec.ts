import { describe, it, expect } from 'vitest';

import { validateSpecifyDesignTokenGroupProperties } from '../../../src/definitions/internals/designTokenGroup.js';

describe('validateSpecifyDesignTokenGroupProperties', () => {
  it('should validate an Group with $description and $extensions', () => {
    const input = {
      $description: 'some description',
      $extensions: { someValue: true },
    };
    const parsed = validateSpecifyDesignTokenGroupProperties(input);
    expect(parsed).toStrictEqual(input);
  });
  it('should validate a Group without $description nor $extensions', () => {
    const input = {
      colors: {
        primary: {
          $type: 'color',
          $value: {
            model: 'hex',
            hex: '#000000',
            alpha: 1,
          },
        },
      },
    };
    const result = validateSpecifyDesignTokenGroupProperties(input);
    expect(result).toStrictEqual({});
  });
  it('should strip out extra keys', () => {
    const input = {
      $description: 'some description',
      $foo: 'bar',
      baz: true,
    };

    const result = validateSpecifyDesignTokenGroupProperties(input);
    expect(result).toStrictEqual({
      $description: 'some description',
    });
  });
});
