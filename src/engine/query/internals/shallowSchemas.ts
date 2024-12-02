import { z } from 'zod';

export const shallowQuerySchema = z.object(
  {
    where: z.unknown({
      required_error: '"where" property is required in Query',
    }),
  },
  {
    required_error: 'Query must be an object',
    invalid_type_error: 'Query must be an object',
  },
);
export type ShallowQuery = z.infer<typeof shallowQuerySchema>;

export const shallowWhereOperatorSchema = z.union(
  [
    z.array(z.unknown()),
    z.object({ group: z.union([z.string(), z.record(z.unknown())]) }).passthrough(),
    z.object({ collection: z.union([z.string(), z.record(z.unknown())]) }).passthrough(),
    z.object({ token: z.union([z.string(), z.record(z.unknown())]) }).passthrough(),
  ],
  {
    invalid_type_error: '"andWhere" must be an array or an object',
  },
);
export type ShallowWhereOperator = z.infer<typeof shallowWhereOperatorSchema>;

export const shallowWhereWithSelectOrAndWhereSchema = z.union([
  z.object({
    select: z.union([z.boolean(), z.record(z.unknown())]),
    andWhere: z.undefined().optional(),
  }),
  z.object({
    select: z.undefined().optional(),
    andWhere: shallowWhereOperatorSchema,
  }),
]);
