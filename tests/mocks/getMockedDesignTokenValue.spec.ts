import { describe, it, expect } from 'vitest';

import { getMockedDesignTokenValue } from '../../src/mocks/getMockedDesignTokenValue.js';
import {
  specifyDesignTokenTypeNames,
  validateSpecifyNonAliasableDesignToken,
} from '../../src/definitions/designTokenDefinitions.js';
import { SpecifyDesignToken } from '../../src/index.js';

describe('getMockedDesignTokenValue', () => {
  it('Should return a value for any given token type', ({ expect }) => {
    specifyDesignTokenTypeNames.forEach((tokenTypeName: any) => {
      const value = getMockedDesignTokenValue(tokenTypeName);
      expect(value).toBeDefined();
      const token: SpecifyDesignToken = {
        $type: tokenTypeName,
        $value: { default: value },
      };
      const result = validateSpecifyNonAliasableDesignToken(token);
      expect(result.$type).toStrictEqual(tokenTypeName);
      expect(result.$value).toStrictEqual(token.$value);
    });
    expect.assertions(specifyDesignTokenTypeNames.length * 3);
  });
  it('Should fail on unknown token type', () => {
    const invalidType = 'invalidType';
    expect(() =>
      getMockedDesignTokenValue(
        // @ts-expect-error
        invalidType,
      ),
    ).toThrow(`Unknown token type: "${invalidType}"`);
  });
});
