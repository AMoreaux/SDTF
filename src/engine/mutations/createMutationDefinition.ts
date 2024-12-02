import { z } from 'zod';


export type MutationDefinition<Name extends string, Schema extends z.ZodSchema> = {
  name: Name;
  schema: Schema;
  parse: (value: Schema['_type']) => Schema['_type'];
  remapAndPipeWith: <
    RemapFn extends (payload: Schema['_type']) => Parameters<PipeWithFn>,
    PipeWithFn extends (
      ...args: RemapFn extends ((payload: any) => infer R extends any[]) ? R : never[]
    ) => any
  >(map: RemapFn, pipeWith: PipeWithFn) => (payload: Schema['_type']) => PipeWithFn extends (...args: any[]) => infer R ? R : never;
};

export function createMutationDefinition<Name extends string, Schema extends z.ZodSchema>({
  name,
  schema,
}: {
  name: Name;
  schema: Schema;
}): MutationDefinition<Name, Schema> {
  return {
    name,
    schema,
    parse: schema.parse.bind(schema),
    remapAndPipeWith:
      <
        RemapFn extends (payload: Schema['_type']) => Parameters<PipeWithFn>,
        PipeWithFn extends (
          ...args: RemapFn extends ((payload: any) => infer R extends any[]) ? R : never[]
        ) => any
      >(
        map: RemapFn,
        pipeWith: PipeWithFn,
      ) =>
      (payload: Schema['_type']) => {
        const validated = schema.parse(payload);
        const args = map(validated);
        return pipeWith(...args as any);
      },
  };
}

