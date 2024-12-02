import { describe, it, expect } from 'vitest';
import { extractAliasingDocumentationFromMapping } from '../../src/documentation/extractAliasingDocumentationFromMapping.js';
import {
  specifyArcDegreeNumberTypeName,
  specifyColorTypeName,
  specifyGradientTypeName,
  specifyJSONStringTypeName,
  specifyZeroToOneNumberTypeName,
} from '../../src/definitions/designTokenTypeNames.js';

describe('extractAliasingDocumentationFromMapping', () => {
  it('Should document a single-value type', () => {
    const mapping = { _tokenType: 'string' };
    const result = extractAliasingDocumentationFromMapping(mapping);
    expect(result).toEqual('"string"');
  });
  it('Should document a primitive type', () => {
    const mapping = { _primitive: 'string' };
    const result = extractAliasingDocumentationFromMapping(mapping);
    expect(result).toEqual('literal("string")');
  });
  it('Should document an array of single-value type', () => {
    const mapping = {
      _arrayOf: [{ _tokenType: 'string' }],
    };
    const result = extractAliasingDocumentationFromMapping(mapping);
    expect(result).toEqual('Array<"string">');
  });
  it('Should document a map type', () => {
    const mapping = {
      _mapOf: {
        unit: { _tokenType: 'dimensionUnit' },
        value: { _tokenType: 'number' },
      },
    };
    const result = extractAliasingDocumentationFromMapping(mapping);
    expect(result).toEqual(`{
  unit: "dimensionUnit",
  value: "number"
}`);
  });
  it('Should document a union type', () => {
    const mapping = {
      _unionOf: [{ _tokenType: 'string' }, { _tokenType: 'number' }, { _tokenType: 'boolean' }],
    };
    const result = extractAliasingDocumentationFromMapping(mapping);
    expect(result).toBe('"string" or "number" or "boolean"');
  });
  it('Should document a discriminated union type', () => {
    const mapping = {
      _discriminator: 'type',
      _discriminatedUnionOf: [
        {
          _mapOf: {
            type: { _primitive: 'string' },
            value: { _tokenType: 'string' },
          },
        },
        {
          _mapOf: {
            type: { _primitive: 'number' },
            value: { _tokenType: 'number' },
          },
        },
      ],
    };
    const result = extractAliasingDocumentationFromMapping(mapping);
    expect(result).toEqual(`{
  type: literal("string"),
  value: "string"
} or {
  type: literal("number"),
  value: "number"
}`);
  });
  it('Should document a tuple type', () => {
    const mapping = {
      _tuple: [{ _tokenType: 'string' }, { _tokenType: 'number' }, { _tokenType: 'boolean' }],
    };
    const result = extractAliasingDocumentationFromMapping(mapping);
    expect(result).toEqual(`["string", "number", "boolean"]`);
  });

  it('Should document an array containing a map type', () => {
    const mapping = {
      _arrayOf: [
        {
          _mapOf: {
            unit: { _tokenType: 'dimensionUnit' },
            value: { _tokenType: 'number' },
          },
        },
      ],
    };
    const result = extractAliasingDocumentationFromMapping(mapping);
    expect(result).toEqual(`Array<{
  unit: "dimensionUnit",
  value: "number"
}>`);
  });
  it('Should document a map type containing a union type', () => {
    const mapping = {
      _mapOf: {
        unit: { _tokenType: 'dimensionUnit' },
        value: {
          _unionOf: [{ _tokenType: 'number' }, { _tokenType: 'string' }],
        },
      },
    };
    const result = extractAliasingDocumentationFromMapping(mapping);
    expect(result).toEqual(`{
  unit: "dimensionUnit",
  value: "number" or "string"
}`);
  });
  it('Should document a union of primitive type and discriminatedUnion type', () => {
    const result = extractAliasingDocumentationFromMapping({
      _unionOf: [
        {
          _arrayOf: [
            {
              _mapOf: {
                unit: { _tokenType: 'dimensionUnit' },
                value: { _tokenType: 'number' },
              },
            },
          ],
        },
        {
          _discriminator: 'type',
          _discriminatedUnionOf: [
            {
              _mapOf: {
                type: { _primitive: 'linear' },
                angle: { _tokenType: specifyArcDegreeNumberTypeName },
                colorStops: {
                  _arrayOf: [
                    {
                      _mapOf: {
                        color: { _tokenType: specifyColorTypeName },
                        position: { _tokenType: specifyZeroToOneNumberTypeName },
                      },
                    },
                  ],
                },
              },
            },
            {
              _mapOf: {
                type: { _primitive: 'radial' },
                colorStops: {
                  _arrayOf: [
                    {
                      _mapOf: {
                        color: { _tokenType: specifyColorTypeName },
                        position: { _tokenType: specifyZeroToOneNumberTypeName },
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    });

    expect(result).toEqual(`Array<{
  unit: "dimensionUnit",
  value: "number"
}> or {
  type: literal("linear"),
  angle: "arcDegreeNumber",
  colorStops: Array<{
    color: "color",
    position: "zeroToOneNumber"
  }>
} or {
  type: literal("radial"),
  colorStops: Array<{
    color: "color",
    position: "zeroToOneNumber"
  }>
}`);
  });
});
