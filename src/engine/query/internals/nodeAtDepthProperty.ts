import { z } from 'zod';

export const nodeAtDepthPropertySchema = z.union([
  z
    .object({
      upTo: z.number().min(0),
      equalTo: z.undefined(),
    })
    .strict(),
  z
    .object({
      upTo: z.undefined(),
      equalTo: z.number().min(0),
    })
    .strict(),
]);
export const nodeWithAtDepthSchema = z.object({
  atDepth: nodeAtDepthPropertySchema.optional(),
});
export type NodeWithAtDepth = z.infer<typeof nodeWithAtDepthSchema>;
