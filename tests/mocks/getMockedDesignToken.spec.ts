import { describe, it } from 'vitest';

import { getMockedDesignToken } from '../../src/mocks/getMockedDesignToken.js';
import {
  specifyDesignTokenTypeNames,
  validateSpecifyNonAliasableDesignToken,
} from '../../src/definitions/designTokenDefinitions.js';

describe('getMockedDesignToken', () => {
  it('Should return a mocked Design Token for any given token type', ({ expect }) => {
    specifyDesignTokenTypeNames.forEach(tokenTypeName => {
      const token = getMockedDesignToken({
        type: tokenTypeName as any,
      });
      expect(token).toHaveProperty('$type');
      expect(token).toHaveProperty('$value');
      expect(token.$type).toBe(tokenTypeName);

      const result = validateSpecifyNonAliasableDesignToken(token);
      expect(result).toStrictEqual(token);
    });
    expect.assertions(specifyDesignTokenTypeNames.length * 4);
  });
});
