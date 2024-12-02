import { z } from 'zod';

import { childrenAndParentsUpToDepthOperatorSchema } from '../internals/childrenAndParentsUpToDepthOperator.js';
import { nodePropertiesMatchingSchema } from '../internals/nodePropertiesMatching.js';
import { NodeWithModes, withModesSchema } from '../internals/withModes.js';
import { NodeWithTypes, withTypesSchema } from '../internals/withTypes.js';
import { NodeWithAtDepth, nodeWithAtDepthSchema } from '../internals/nodeAtDepthProperty.js';
import { WhereNode } from '../query.js';

export const groupParentsOfTokenUpToDepthOperatorSchema = z.union([
  z
    .object({
      upToDepth: z.union([z.number().min(0), z.literal('collection')]),
      equalToDepth: z.undefined(),
    })
    .strict(),
  z
    .object({
      upToDepth: z.undefined(),
      equalToDepth: z.number().min(0),
    })
    .strict(),
]);
export const collectionParentsOfTokenUpToDepthOperatorSchema = z.union([
  z
    .object({
      upToDepth: z.union([z.number().min(0), z.literal('group')]),
      equalToDepth: z.undefined(),
    })
    .strict(),
  z
    .object({
      upToDepth: z.undefined(),
      equalToDepth: z.number().min(0),
    })
    .strict(),
]);
export const tokenSelectSchema = z
  .object({
    token: z.boolean().optional(),
    parents: z
      .union([
        z.literal(true),
        childrenAndParentsUpToDepthOperatorSchema,
        z
          .object({
            groups: z
              .union([z.literal(true), groupParentsOfTokenUpToDepthOperatorSchema])
              .optional(),
            collections: z
              .union([z.literal(true), collectionParentsOfTokenUpToDepthOperatorSchema])
              .optional(),
          })
          .strict(),
      ])
      .optional(),
  })
  .strict()
  .refine(
    value => {
      return !(value.parents === undefined && value.token === undefined);
    },
    {
      message: 'Select must include either `parents` or `token`',
      path: [],
    },
  );
export type TokenSelect = z.infer<typeof tokenSelectSchema>;

const tokenSelectPropertySchema = z.union([z.literal(true), tokenSelectSchema]);
export type TokenSelectProperty = z.infer<typeof tokenSelectPropertySchema>;

const tokenWithSelectSchema = z.object({
  select: tokenSelectPropertySchema,
});
export type TokenWithSelect = z.infer<typeof tokenWithSelectSchema>;
const tokenNestedInPropertySchema = z.object({
  collection: z.boolean().optional(),
  group: z.boolean().optional(),
});
export type TokenNestedInProperty = z.infer<typeof tokenNestedInPropertySchema>;
const tokenWithNestedInSchema = z.object({
  nestedIn: tokenNestedInPropertySchema.optional(),
});
export type TokenWithNestedIn = z.infer<typeof tokenWithNestedInSchema>;

const tokenContainsAliasesSchema = z
  .union([
    z.boolean(),
    z
      .object({
        level: z.union([z.literal('all'), z.literal('mode'), z.literal('value')]).optional(),
        resolvability: z
          .union([z.literal('all'), z.literal('unresolvable'), z.literal('resolvable')])
          .optional(),
      })
      .strict(),
  ])
  .optional();
export type TokenContainsAliases = z.infer<typeof tokenContainsAliasesSchema>;
const tokenWithContainsAliasesSchema = z.object({
  containsAliases: tokenContainsAliasesSchema,
});
export type TokenWithContainsAliases = z.infer<typeof tokenWithContainsAliasesSchema>;

const tokenSourcesSchema = z
  .union([
    z.object({ include: z.array(z.string().uuid()) }).strict(),
    z.object({ exclude: z.array(z.string().uuid()) }).strict(),
  ])
  .optional();
export type TokenSourceIds = z.infer<typeof tokenSourcesSchema>;
const tokenWithSourcesSchema = z.object({
  withSourceIds: tokenSourcesSchema,
});
export type TokenWithSourceIds = z.infer<typeof tokenWithSourcesSchema>;

const tokenCreatedSchema = z
  .object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  })
  .optional();
export type TokenCreated = z.infer<typeof tokenCreatedSchema>;
const tokenWithCreatedSchema = z.object({
  created: tokenCreatedSchema,
});
export type TokenWithCreated = z.infer<typeof tokenWithCreatedSchema>;

const tokenUpdatedSchema = z
  .object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
  })
  .optional();
export type TokenUpdated = z.infer<typeof tokenUpdatedSchema>;
const tokenWithUpdatedSchema = z.object({
  updated: tokenUpdatedSchema,
});
export type TokenWithUpdated = z.infer<typeof tokenWithUpdatedSchema>;
const tokenWithSelfSelectorSchema = z.object({
  token: nodePropertiesMatchingSchema,
});

export type TokenWithSelfSelector = z.infer<typeof tokenWithSelfSelectorSchema>;
export const tokenWhereSchema = tokenWithSelfSelectorSchema
  .merge(withModesSchema)
  .merge(withTypesSchema)
  .merge(nodeWithAtDepthSchema)
  .merge(tokenWithSelectSchema)
  .merge(tokenWithNestedInSchema)
  .merge(tokenWithContainsAliasesSchema)
  .merge(tokenWithSourcesSchema)
  .merge(tokenWithCreatedSchema)
  .merge(tokenWithUpdatedSchema);
export type TokenWhere = TokenWithSelfSelector &
  TokenWithSelect &
  NodeWithAtDepth &
  TokenWithNestedIn &
  NodeWithTypes &
  NodeWithModes &
  TokenWithContainsAliases &
  TokenWithSourceIds &
  TokenWithCreated &
  TokenWithUpdated;

export function matchIsTokenWhere(where: WhereNode): where is TokenWhere {
  return 'token' in where;
}
