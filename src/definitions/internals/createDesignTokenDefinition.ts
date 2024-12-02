import { z } from 'zod';
import { ValuePath } from '../../engine/state/path/ValuePath.js';

import {
  matchTokenTypeAgainstMapping,
  MatchTokenTypeAgainstMappingReturnType,
  TokenTypesMapping,
  validateTokenTypesMapping,
} from './tokenTypesMapping.js';
import { ZodDesignTokenSignature, makeSpecifyDesignTokenSchema } from './designTokenSignature.js';

import { JSONValuePath } from '../../utils/JSONDefinitions.js';

export type DesignTokenDefinition<
  Type extends string,
  ASchema extends z.Schema = z.Schema,
  RSchema extends z.Schema = z.Schema,
  TMapping extends TokenTypesMapping = TokenTypesMapping,
> = {
  type: Type;
  tokenTypesMapping: TMapping;
  aliasableValueZodSchema: ASchema;
  resolvedValueZodSchema: RSchema;
  aliasableTokenZodSchema: ZodDesignTokenSignature<Type, ASchema, true>;
  resolvedTokenZodSchema: ZodDesignTokenSignature<Type, RSchema, false>;
  matchTokenTypeAgainstMapping: (
    type: string,
    path: ValuePath,
    getDiscriminatorValue?: (discriminatorKeyPath: JSONValuePath) => string | undefined,
  ) => MatchTokenTypeAgainstMappingReturnType;
};

export function createDesignTokenDefinition<
  Type extends string,
  ASchema extends z.Schema,
  RSchema extends z.Schema,
  TMapping extends TokenTypesMapping,
>(params: {
  type: Type;
  aliasableValueZodSchema: ASchema;
  resolvedValueZodSchema: RSchema;
  tokenTypesMapping?: TMapping;
}): DesignTokenDefinition<Type, ASchema, RSchema, TMapping> {
  const computedTypesMapping = validateTokenTypesMapping(
    !params.tokenTypesMapping ? { _tokenType: params.type } : params.tokenTypesMapping,
  ) as TMapping;

  const aliasableTokenZodSchema = makeSpecifyDesignTokenSchema(
    params.type,
    params.aliasableValueZodSchema,
    true,
  );
  const resolvedTokenZodSchema = makeSpecifyDesignTokenSchema(
    params.type,
    params.resolvedValueZodSchema,
    false,
  );

  return {
    type: params.type,
    tokenTypesMapping: computedTypesMapping,
    aliasableValueZodSchema: params.aliasableValueZodSchema,
    resolvedValueZodSchema: params.resolvedValueZodSchema,
    aliasableTokenZodSchema,
    resolvedTokenZodSchema,
    matchTokenTypeAgainstMapping: (type, path, getDiscriminatorValue = () => undefined) => {
      return matchTokenTypeAgainstMapping(type, computedTypesMapping, path, getDiscriminatorValue);
    },
  };
}
