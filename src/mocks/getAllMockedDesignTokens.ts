import {
  SpecifyAliasableDesignToken,
  SpecifyDesignTokenFormat,
  specifyDesignTokenTypeNames,
} from '../definitions/index.js';
import { getMockedDesignToken } from './getMockedDesignToken.js';

export function getAllMockedDesignTokens(
  options: {
    asArray?: boolean;
  } = {
    asArray: false,
  },
) {
  const tokens = specifyDesignTokenTypeNames.map(typeName =>
    getMockedDesignToken({ type: typeName }),
  );

  if (options.asArray) {
    return tokens as Array<SpecifyAliasableDesignToken>;
  }

  return tokens.reduce(
    (acc, token) => ({
      ...acc,
      [token.$type]: token,
    }),
    {} as SpecifyDesignTokenFormat,
  ) as SpecifyDesignTokenFormat;
}
