import { z } from 'zod';

export const childrenAndParentsUpToDepthOperatorSchema = z.union([
  z
    .object({
      upToDepth: z.number().min(0),
    })
    .strict(),
  z
    .object({
      equalToDepth: z.number().min(0),
    })
    .strict(),
]);
export type ChildrenAndParentsUpToDepthOperator = z.infer<
  typeof childrenAndParentsUpToDepthOperatorSchema
>;
