import { z } from 'zod';

export const shallowJSONLiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.record(z.string(), z.any()),
  z.array(z.any()),
]);
