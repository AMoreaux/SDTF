import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createDesignTokenDefinition } from '../../../src/definitions/internals/createDesignTokenDefinition.js';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

describe.concurrent('createDesignTokenDefinition', () => {
  it('Should create a minimal definition', () => {
    const fakeDefinition = createDesignTokenDefinition({
      type: 'fake',
      aliasableValueZodSchema: z.string(),
      resolvedValueZodSchema: z.number(), // we use a different type to distinguish between aliasable and resolved - this is not representative of a real use case
    });

    // tokenTypesMapping takes the declared type as default
    expect(fakeDefinition.tokenTypesMapping).toStrictEqual({ _tokenType: 'fake' });

    expect(typeof fakeDefinition.aliasableValueZodSchema.parse).toBe('function');
    expect(typeof fakeDefinition.resolvedValueZodSchema.parse).toBe('function');
    expect(typeof fakeDefinition.aliasableTokenZodSchema.parse).toBe('function');
    expect(typeof fakeDefinition.resolvedTokenZodSchema.parse).toBe('function');

    expect(typeof fakeDefinition.matchTokenTypeAgainstMapping).toBe('function');
  });
  it('Should create a definition with a custom `tokenTypesMapping`', () => {
    const fakeDefinition = createDesignTokenDefinition({
      type: 'fake',
      aliasableValueZodSchema: z
        .object({
          aField: z.string(),
        })
        .strict(),
      resolvedValueZodSchema: z
        .object({
          aField: z.string(),
        })
        .strict(),
      tokenTypesMapping: {
        _mapOf: {
          aField: { _tokenType: 'string' },
        },
      },
    });

    // tokenTypesMapping takes the declared type as default
    expect(fakeDefinition.tokenTypesMapping).toStrictEqual({
      _mapOf: {
        aField: { _tokenType: 'string' },
      },
    });
    expect(
      fakeDefinition.matchTokenTypeAgainstMapping('string', new ValuePath(['aField'])),
    ).toStrictEqual({
      success: true,
    });
  });
  it('Should fail to create a definition with an invalid `tokenTypesMapping`', () => {
    expect(() =>
      createDesignTokenDefinition({
        type: 'invalid',
        aliasableValueZodSchema: z.string(),
        resolvedValueZodSchema: z.number(),
        tokenTypesMapping: {
          // @ts-expect-error
          invalid: true,
        },
      }),
    ).toThrowError();
  });
});
