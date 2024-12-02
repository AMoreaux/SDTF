import { z } from 'zod';

import { makeUnionWithModeAndValueLevelAliasValue } from '../internals/makeUnionWithModeAndValueLevelAliasValue.js';
import { WithModeAndValueLevelAlias } from '../internals/designTokenAlias.js';
import { createDesignTokenDefinition } from '../internals/createDesignTokenDefinition.js';
import { specifyHexadecimalColorStringTypeName } from '../designTokenTypeNames.js';

export const makeSpecifyHexadecimalColorStringValueSchema =
  makeUnionWithModeAndValueLevelAliasValue(
    z.custom<SpecifyHexadecimalColorStringValue>(
      data =>
        // matches a string that starts with "#", and has exactly 6 hexadecimal characters after it
        typeof data === 'string' && /^#[0-9A-F]{6}$/i.test(data),
    ),
  );
export type SpecifyHexadecimalColorStringValue = `#${string}`;
export type SpecifyHexadecimalColorStringValueWithAlias =
  WithModeAndValueLevelAlias<SpecifyHexadecimalColorStringValue>;
export const specifyHexadecimalColorStringDefinition = createDesignTokenDefinition({
  type: specifyHexadecimalColorStringTypeName,
  aliasableValueZodSchema: makeSpecifyHexadecimalColorStringValueSchema(true),
  resolvedValueZodSchema: makeSpecifyHexadecimalColorStringValueSchema(false),
});
