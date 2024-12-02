import { describe, expect, it } from 'vitest';
import { nodePropertiesMatchingObjectSchema } from '../../../../src/engine/query/index.js';

describe('nodePropertiesMatchingObjectSchema', () => {
  it('should parse a name property', () => {
    const result = nodePropertiesMatchingObjectSchema.parse({
      name: 'a name',
    });
    expect(result).toEqual({ name: 'a name' });
  });
  it('should parse a description property', () => {
    const result = nodePropertiesMatchingObjectSchema.parse({
      description: 'a description',
    });
    expect(result).toEqual({ description: 'a description' });
  });
  it('should fail if none of the properties is defined', () => {
    expect(() => {
      nodePropertiesMatchingObjectSchema.parse({});
    }).toThrowErrorMatchingInlineSnapshot(`
      [ZodError: [
        {
          "code": "custom",
          "message": "Where group | token | collection object must include either \`name\` or \`description\`",
          "path": []
        }
      ]]
    `);
  });
});
