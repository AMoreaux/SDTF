import { z } from 'zod';

export const nodePropertiesMatchingObjectSchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    value => {
      return value.name !== undefined || value.description !== undefined;
    },
    {
      message:
        'Where group | token | collection object must include either `name` or `description`',
    },
  );

export type NodePropertiesMatchingObject = z.infer<typeof nodePropertiesMatchingObjectSchema>;

export function matchIsNodePropertiesMatchingObject(
  match: unknown,
): match is NodePropertiesMatchingObject {
  if (!Array.isArray(match) && typeof match === 'object' && match !== null) {
    return Object.keys(match).every(key => ['name', 'description'].includes(key));
  }
  return false;
}

export const nodePropertiesMatchingSchema = z.union([
  z.string(),
  nodePropertiesMatchingObjectSchema,
]);
export type NodePropertiesMatching = string | NodePropertiesMatchingObject;

export function makeMaybeNodePropertiesRegexes(nodeDescriptor: NodePropertiesMatching) {
  let maybeNameRegex: RegExp | undefined;
  let maybeDescriptionRegex: RegExp | undefined;

  if (matchIsNodePropertiesMatchingObject(nodeDescriptor)) {
    if (nodeDescriptor.name) {
      maybeNameRegex = new RegExp(nodeDescriptor.name);
    }
    if (nodeDescriptor.description) {
      maybeDescriptionRegex = new RegExp(nodeDescriptor.description);
    }
  } else {
    maybeNameRegex = new RegExp(nodeDescriptor);
  }

  return { maybeNameRegex, maybeDescriptionRegex };
}
