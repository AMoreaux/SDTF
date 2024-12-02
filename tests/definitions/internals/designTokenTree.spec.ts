import { describe, it, expect } from 'vitest';

import {
  treeNodeCommonPropertiesSchema,
  treePathSchema,
  validateTreeNodeName,
  validateDesignTokenTreeRootNode,
  validateTreeNodeCommonProperties,
} from '../../../src/definitions/internals/designTokenTree.js';
import { SDTF_PATH_SEPARATOR } from '../../../src/definitions/internals/designTokenTreeConstants.js';
import { TreePath } from '../../../src/engine/state/path/TreePath.js';

describe.concurrent('designTokenTree', () => {
  describe('SDTF_PATH_SEPARATOR', () => {
    it('should be "."', () => {
      expect(SDTF_PATH_SEPARATOR).toMatchInlineSnapshot(`"."`);
    });
  });

  describe.concurrent('validateTreeNodeName', () => {
    it('should validate a regular string', () => {
      const parsed = validateTreeNodeName('someString');
      expect(parsed).toBe('someString');
    });
    it('should fail validating an empty string', () => {
      expect(() => {
        validateTreeNodeName('');
      }).toThrowError(`[
  {
    "code": "too_small",
    "minimum": 1,
    "type": "string",
    "inclusive": true,
    "exact": false,
    "message": "Token or Group name must be at least 1 character long.",
    "path": []
  }
]`);
    });
    it('should fail validating a string with "."', () => {
      expect(() => {
        validateTreeNodeName('some.string');
      }).toThrowError(`[
  {
    "code": "custom",
    "message": "Token or Group name cannot contain the '.' (dot) character.",
    "path": []
  }
]`);
    });
    it('should fail validating a non string input', () => {
      expect(() => {
        validateTreeNodeName(
          // @ts-expect-error
          42,
        );
      }).toThrowError(`[
  {
    "code": "invalid_type",
    "expected": "string",
    "received": "number",
    "path": [],
    "message": "Expected string, received number"
  }
]`);
    });
  });

  describe.concurrent('treeNodeCommonPropertiesSchema', () => {
    it('should allow an object with $description and $extensions', () => {
      const input = {
        $description: 'some description',
        $extensions: { foo: 'bar' },
      };
      const parsed = treeNodeCommonPropertiesSchema.parse(input);
      expect(parsed).toStrictEqual(input);
    });
    it('should allow an empty object', () => {
      const input = {};
      const parsed = treeNodeCommonPropertiesSchema.parse(input);
      expect(parsed).toStrictEqual(input);
    });
    it('should strip out extra keys', () => {
      const input = {
        $description: 'some description',
        $foo: 'bar',
        baz: true,
      };

      const result = treeNodeCommonPropertiesSchema.parse(input);
      expect(result).toStrictEqual({
        $description: 'some description',
      });
    });
  });
  describe.concurrent('validateTreeNodeCommonProperties', () => {
    it('should allow an object with $description and $extensions', () => {
      const input = {
        $description: 'some description',
        $extensions: { foo: 'bar' },
      };
      const parsed = validateTreeNodeCommonProperties(input);
      expect(parsed).toStrictEqual(input);
    });
    it('should allow an empty object', () => {
      const input = {};
      const parsed = validateTreeNodeCommonProperties(input);
      expect(parsed).toStrictEqual(input);
    });
    it('should strip out extra keys', () => {
      const input = {
        $description: 'some description',
        $foo: 'bar',
        baz: true,
      };

      const result = validateTreeNodeCommonProperties(input);
      expect(result).toStrictEqual({
        $description: 'some description',
      });
    });
  });

  describe.concurrent('validateDesignTokenTreeRootNode', () => {
    it('should validate a regular object', () => {
      const input = {
        someString: 'someString',
      };
      const parsed = validateDesignTokenTreeRootNode(input);
      expect(parsed).toStrictEqual(input);
    });
    it('should validate a record of any primitive', () => {
      const input = {
        string: 'someString',
        number: 1,
        boolean: true,
        null: null,
        object: {
          someString: 'someString',
        },
        array: ['someString'],
      };
      const parsed = validateDesignTokenTreeRootNode(input);
      expect(parsed).toStrictEqual(input);
    });
    it('should fail validating a string', () => {
      const input = 'someString';
      expect(() => {
        validateDesignTokenTreeRootNode(input);
      }).toThrowError();
    });
    it('should fail validating a number', () => {
      const input = 123;
      expect(() => {
        validateDesignTokenTreeRootNode(input);
      }).toThrowError();
    });
    it('should fail validating a null', () => {
      const input = null;
      expect(() => {
        validateDesignTokenTreeRootNode(input);
      }).toThrowError();
    });
    it('should fail validating a boolean', () => {
      const input = true;
      expect(() => {
        validateDesignTokenTreeRootNode(input);
      }).toThrowError();
    });
    it('should fail validating an array', () => {
      const input = ['someString'];
      expect(() => {
        validateDesignTokenTreeRootNode(input);
      }).toThrowError();
    });
    it('should fail validating a function', () => {
      const input = () => {};
      expect(() => {
        validateDesignTokenTreeRootNode(input);
      }).toThrowError();
    });
    it('should fail validating a record of function', () => {
      const input = {
        someString: () => {},
      };
      expect(() => {
        validateDesignTokenTreeRootNode(input);
      }).toThrowError();
    });
  });

  describe.concurrent('treePathSchema', () => {
    it('should validate an empty array', () => {
      const input = TreePath.empty();
      const parsed = treePathSchema.parse(input);
      expect(parsed).toStrictEqual(input);
    });
    it('should validate an array of strings', () => {
      const input = new TreePath(['someString']);
      const parsed = treePathSchema.parse(input);
      expect(parsed).toStrictEqual(input);
    });
    it('should fail validating an array of non strings', () => {
      const input = [42, true, null];
      expect(() => {
        treePathSchema.parse(input);
      }).toThrowError();
    });
  });
});
