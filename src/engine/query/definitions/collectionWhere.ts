import { z } from 'zod';

import { childrenAndParentsUpToDepthOperatorSchema } from '../internals/childrenAndParentsUpToDepthOperator.js';
import { nodePropertiesMatchingSchema } from '../internals/nodePropertiesMatching.js';
import { NodeWithModes, withModesSchema } from '../internals/withModes.js';
import { NodeWithAtDepth, nodeWithAtDepthSchema } from '../internals/nodeAtDepthProperty.js';
import { WhereNode } from '../query.js';
import { GroupWhere } from './groupWhere.js';
import { TokenWhere } from './tokenWhere.js';

export const tokenChildrenOfCollectionUpToDepthOperatorSchema = z.union([
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
export const groupChildrenOfCollectionUpToDepthOperatorSchema = z.union([
  z
    .object({
      upToDepth: z.union([z.number().min(0), z.literal('token')]),
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
export const groupParentsOfCollectionUpToDepthOperatorSchema =
  childrenAndParentsUpToDepthOperatorSchema;
export const collectionSelectSchema = z.object({
  collection: z.boolean().optional(),
  children: z
    .union([
      z.literal(true),
      childrenAndParentsUpToDepthOperatorSchema,
      z
        .object({
          tokens: z
            .union([z.literal(true), tokenChildrenOfCollectionUpToDepthOperatorSchema])
            .optional(),
          groups: z
            .union([z.literal(true), groupChildrenOfCollectionUpToDepthOperatorSchema])
            .optional(),
        })
        .strict(),
    ])
    .optional(),
  parents: z
    .union([
      z.literal(true),
      childrenAndParentsUpToDepthOperatorSchema,
      z
        .object({
          groups: z
            .union([z.literal(true), groupParentsOfCollectionUpToDepthOperatorSchema])
            .optional(),
        })
        .strict(),
    ])
    .optional(),
});
export type CollectionSelect = z.infer<typeof collectionSelectSchema>;
export const collectionSelectPropertySchema = z.union([z.literal(true), collectionSelectSchema]);
export type CollectionSelectProperty = z.infer<typeof collectionSelectPropertySchema>;
const collectionWithSelectSchema = z.object({
  select: collectionSelectPropertySchema,
});
export type CollectionWithSelect = z.infer<typeof collectionWithSelectSchema>;
const collectionNestedInPropertySchema = z.object({
  group: z.boolean().optional(),
});
export type CollectionNestedInProperty = z.infer<typeof collectionNestedInPropertySchema>;
const collectionWithNestedInSchema = z.object({
  nestedIn: collectionNestedInPropertySchema.optional(),
});
export type CollectionWithNestedIn = z.infer<typeof collectionWithNestedInSchema>;
const collectionWithSelfSelectorSchema = z.object({
  collection: nodePropertiesMatchingSchema,
});
export type CollectionWithSelfSelector = z.infer<typeof collectionWithSelfSelectorSchema>;
export const collectionWhereBaseSchema = collectionWithSelfSelectorSchema
  .merge(nodeWithAtDepthSchema)
  .merge(collectionWithNestedInSchema)
  .merge(withModesSchema);
export type CollectionAndWhereOperator = GroupWhere | TokenWhere | Array<GroupWhere | TokenWhere>;
export type CollectionWhereWithSelect = CollectionWithSelfSelector &
  CollectionWithNestedIn &
  NodeWithAtDepth &
  NodeWithModes &
  CollectionWithSelect & {
    andWhere?: never;
  };
export type CollectionWhereWithAndWhere = CollectionWithSelfSelector &
  CollectionWithNestedIn &
  NodeWithAtDepth &
  NodeWithModes & {
    select?: never;
    andWhere: CollectionAndWhereOperator;
  };
export type CollectionWhere = CollectionWhereWithSelect | CollectionWhereWithAndWhere;

export function matchIsCollectionWhere(where: WhereNode): where is CollectionWhere {
  return 'collection' in where;
}

export function matchIsCollectionWhereWithSelect(
  where: WhereNode,
): where is CollectionWhereWithSelect {
  return 'select' in where && matchIsCollectionWhere(where);
}

export function matchIsCollectionWhereWithAndWhere(
  where: WhereNode,
): where is CollectionWhereWithAndWhere {
  return 'andWhere' in where && matchIsCollectionWhere(where);
}
