import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

import { createMutationDefinition } from '../../../src/engine/mutations/createMutationDefinition.js';

describe('createMutationDefinition', () => {
  it('it should create a mutation definition and use its properties', () => {
    const mutation = createMutationDefinition({
      name: 'addPost',
      schema: z.object({
        title: z.string(),
      }),
    });

    const mockedMutation = vi.fn((title: string) => ({
      title,
      isValid: true,
    }));

    const execute = mutation.remapAndPipeWith(({ title }) => [title], mockedMutation);

    const res = execute({ title: 'Hello' });
    expect(res).toStrictEqual({ title: 'Hello', isValid: true });
    expect(mockedMutation).toHaveBeenCalledWith('Hello');

    expect(mutation.parse({ title: 'Hello' })).toStrictEqual({ title: 'Hello' });
  });
  it('should fail calling the piped mutation if the payload is invalid', () => {
    const mutation = createMutationDefinition({
      name: 'addPost',
      schema: z.object({
        title: z.string(),
      }),
    });

    const mockedMutation = vi.fn((title: string) => ({
      title,
      isValid: true,
    }));

    const execute = mutation.remapAndPipeWith(({ title }) => [title], mockedMutation);

    expect(() =>
      execute({
        // @ts-expect-error - invalid type on purpose
        title: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`
      [ZodError: [
        {
          "code": "invalid_type",
          "expected": "string",
          "received": "number",
          "path": [
            "title"
          ],
          "message": "Expected string, received number"
        }
      ]]
    `);
  });
  it('should ts-error on invalid remap and function arguments-return', () => {
    const mutation = createMutationDefinition({
      name: 'addPost',
      schema: z.object({
        title: z.string(),
      }),
    });

    mutation.remapAndPipeWith(
      ({ title }) => [title],
      // @ts-expect-error - title must be string
      (title: number) => ({}),
    );

    mutation.remapAndPipeWith(
      ({ title }) => [title],
      // @ts-expect-error - only one argument
      (title: string, dope: boolean) => ({}),
    );
  });
});
