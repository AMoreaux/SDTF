import { z } from 'zod';
import { ValuePath } from '../../engine/state/path/ValuePath.js';
import { diffOrderedArrays } from '../../utils/diffOrderedArrays.js';

export type MatchTokenTypeAgainstMappingReturnType =
  | {
      success: true;
    }
  | {
      success: false;
      expectedType: string;
    };

export function matchTokenTypeAgainstMapping(
  type: string,
  mapping: TokenTypesMapping,
  path: ValuePath,
  getDiscriminatorValue: (discriminatorKeyPath: Array<string>) => string | undefined = () =>
    undefined,
  originalPath: ValuePath = path,
): MatchTokenTypeAgainstMappingReturnType {
  // TODO: can be better
  const [selector, ...tail] = path.toArray();
  if (isMapOfTypesMapping(mapping)) {
    if (selector === undefined)
      throw new Error('Expected "selector" in path to be defined to match against a "_mapOf"');
    if (mapping._mapOf[selector] === undefined)
      throw new Error('Expected "_mapOf[selector]" to be defined');
    return matchTokenTypeAgainstMapping(
      type,
      mapping._mapOf[selector],
      new ValuePath(tail),
      getDiscriminatorValue,
      originalPath,
    );
  }
  if (isArrayOfTypesMapping(mapping)) {
    return matchTokenTypeAgainstMapping(
      type,
      mapping._arrayOf[0],
      new ValuePath(tail),
      getDiscriminatorValue,
      originalPath,
    );
  }
  if (isUnionOfTypesMapping(mapping)) {
    const result = mapping._unionOf.reduce<{
      success: boolean;
      expectedType: string;
    }>(
      (acc, m) => {
        if (acc.success) return acc;

        let localSuccess = false;
        let expectedType =
          (acc as any).expectedType && (acc as any).expectedType.length > 0
            ? `${(acc as any).expectedType}, `
            : '';
        try {
          const result = matchTokenTypeAgainstMapping(
            type,
            m,
            path,
            getDiscriminatorValue,
            originalPath,
          );
          if (result.success) {
            localSuccess = true;
          }
          if (!result.success) {
            expectedType += result.expectedType;
          }
        } catch (error) {}

        return { success: acc.success || localSuccess, expectedType };
      },
      { success: false, expectedType: '' },
    );

    if (result.success) return { success: true };
    return { success: false, expectedType: result.expectedType };
  }
  if (isDiscriminatedUnionOfTypesMapping(mapping)) {
    const keyPath = [
      ...diffOrderedArrays(originalPath.toArray(), path.toArray()),
      mapping._discriminator,
    ];
    const discriminator = getDiscriminatorValue(keyPath);
    if (discriminator === undefined) throw new Error('Expected "discriminator" to be defined');
    const mapOfTypes = mapping._discriminatedUnionOf.find(m => {
      const discriminatorField = m._mapOf[mapping._discriminator];
      if (isPrimitiveTypesMapping(discriminatorField)) {
        return discriminatorField._primitive === discriminator;
      }
      throw new Error('Expected "_mapOf[discriminator]" to be a primitive');
    });
    if (mapOfTypes === undefined) throw new Error('Expected "mapOfTypes" to be defined');
    return matchTokenTypeAgainstMapping(
      type,
      mapOfTypes,
      path,
      getDiscriminatorValue,
      originalPath,
    );
  }
  if (isTupleOfTypesMapping(mapping)) {
    if (selector === undefined) throw new Error('Expected "selector" to be defined');
    const numberSelector = typeof selector === 'string' ? parseInt(selector, 10) : selector;
    if (isNaN(numberSelector)) throw new Error('Expected "selector" to be a number');
    return matchTokenTypeAgainstMapping(
      type,
      mapping._tuple[numberSelector],
      // TODO: Used 3 times
      new ValuePath(tail),
      getDiscriminatorValue,
      originalPath,
    );
  }
  if (isPrimitiveTypesMapping(mapping)) {
    return mapping._primitive === type
      ? { success: true }
      : { success: false, expectedType: JSON.stringify(mapping._primitive) };
  }
  if (isTokenTypeTypesMapping(mapping)) {
    if (path.length > 0) throw new Error('Expected "path" to be empty to resolve a token type');
    return mapping._tokenType === type
      ? { success: true }
      : { success: false, expectedType: mapping._tokenType };
  }
  throw new Error('Unknown mapping type');
}

type MapOfTypesMapping = { _mapOf: { [key: string]: TokenTypesMapping } };
export function isMapOfTypesMapping(data: unknown): data is MapOfTypesMapping {
  if (typeof data !== 'object' || data === null) return false;
  if (!('_mapOf' in data)) return false;
  // if (typeof (data as any)._mapOf !== 'object' || (data as any)._mapOf === null) return false;
  return true;
}

type ArrayOfTypesMapping = { _arrayOf: Array<TokenTypesMapping> };
export function isArrayOfTypesMapping(data: unknown): data is ArrayOfTypesMapping {
  if (typeof data !== 'object' || data === null) return false;
  if (!('_arrayOf' in data)) return false;
  // if (!Array.isArray((data as any)._arrayOf)) return false;
  return true;
}

type UnionOfTypesMapping = { _unionOf: Array<TokenTypesMapping> };
export function isUnionOfTypesMapping(data: unknown): data is UnionOfTypesMapping {
  if (typeof data !== 'object' || data === null) return false;
  if (!('_unionOf' in data)) return false;
  // if (!Array.isArray((data as any)._unionOf)) return false;
  return true;
}

type DiscriminatedUnionOfTypesMapping = {
  _discriminator: string;
  _discriminatedUnionOf: Array<{
    _mapOf: { [key: string]: TokenTypesMapping };
  }>;
};
export function isDiscriminatedUnionOfTypesMapping(
  data: unknown,
): data is DiscriminatedUnionOfTypesMapping {
  if (typeof data !== 'object' || data === null) return false;
  if (!('_discriminatedUnionOf' in data)) return false;
  // Managed by Zod validation on input
  // if (!Array.isArray((data as any)._discriminatedUnionOf)) return false;
  // if (!('_discriminator' in data)) return false;
  // if (typeof (data as any)._discriminator !== 'string') return false;
  return true;
}
type TupleOfTypesMapping = { _tuple: Array<TokenTypesMapping> };
export function isTupleOfTypesMapping(data: unknown): data is TupleOfTypesMapping {
  if (typeof data !== 'object' || data === null) return false;
  if (!('_tuple' in data)) return false;
  // Managed by Zod validation on input
  // if (!Array.isArray((data as any)._tuple)) return false;
  return true;
}

type PrimitiveTypesMapping = { _primitive: string | number | boolean | bigint | null };
export function isPrimitiveTypesMapping(data: unknown): data is PrimitiveTypesMapping {
  if (typeof data !== 'object' || data === null) return false;
  if (!('_primitive' in data)) return false;
  // Managed by Zod validation on input
  // if (
  //   typeof (data as any)._primitive !== 'string' &&
  //   typeof (data as any)._primitive !== 'number' &&
  //   typeof (data as any)._primitive !== 'boolean' &&
  //   typeof (data as any)._primitive !== 'bigint' &&
  //   (data as any)._primitive !== null
  // )
  //   return false;
  return true;
}

type TokenTypeTypesMapping = { _tokenType: string };
export function isTokenTypeTypesMapping(data: unknown): data is TokenTypeTypesMapping {
  if (typeof data !== 'object' || data === null) return false;
  if (!('_tokenType' in data)) return false;
  // Managed by Zod validation on input
  // if (typeof (data as any)._tokenType !== 'string') return false;
  return true;
}

export type TokenTypesMapping =
  | MapOfTypesMapping
  | ArrayOfTypesMapping
  | UnionOfTypesMapping
  | DiscriminatedUnionOfTypesMapping
  | TupleOfTypesMapping
  | PrimitiveTypesMapping
  | TokenTypeTypesMapping;

/* ------------------------------------------
   Definition validation
--------------------------------------------- */
const mapOfTypesMappingSchema = z
  .object({
    _mapOf: z.record(
      z.string(),
      z.lazy(() => tokenTypesMappingSchema),
    ),
  })
  .strict();
const arrayOfTypesMappingSchema = z
  .object({
    _arrayOf: z
      .array(z.lazy(() => tokenTypesMappingSchema))
      .nonempty()
      .max(1),
  })
  .strict();
const unionOfTypesMappingSchema = z
  .object({
    _unionOf: z
      .array(z.lazy(() => tokenTypesMappingSchema))
      .nonempty()
      .min(2),
  })
  .strict();
const discriminatedUnionOfTypesMappingSchema = z
  .object({
    _discriminator: z.string(),
    _discriminatedUnionOf: z.array(mapOfTypesMappingSchema).min(2),
  })
  .strict()
  .refine(
    data => {
      if (!data._discriminator) return false;
      if (!data._discriminatedUnionOf || !Array.isArray(data._discriminatedUnionOf)) return false;
      return data._discriminatedUnionOf.every(item => {
        if (!item._mapOf) return false;
        return Object.keys(item._mapOf).includes(data._discriminator);
      });
    },
    {
      message: 'Discriminator must be present in all variants',
    },
  );
const tupleOfTypesMappingSchema = z
  .object({
    _tuple: z.array(z.lazy(() => tokenTypesMappingSchema)),
  })
  .strict();
const primitiveTypesMappingSchema = z
  .object({
    _primitive: z.union([z.string(), z.number(), z.boolean(), z.bigint(), z.null()]),
  })
  .strict();
const tokenTypeTypesMappingSchema = z
  .object({
    _tokenType: z.string(),
  })
  .strict();

const tokenTypesMappingSchema: z.ZodType<TokenTypesMapping> = z.union([
  z.lazy(() => mapOfTypesMappingSchema),
  z.lazy(() => arrayOfTypesMappingSchema),
  z.lazy(() => unionOfTypesMappingSchema),
  z.lazy(() => discriminatedUnionOfTypesMappingSchema),
  z.lazy(() => tupleOfTypesMappingSchema),
  z.lazy(() => primitiveTypesMappingSchema),
  z.lazy(() => tokenTypeTypesMappingSchema),
]);

export function validateTokenTypesMapping(data: unknown): TokenTypesMapping {
  return tokenTypesMappingSchema.parse(data);
}
