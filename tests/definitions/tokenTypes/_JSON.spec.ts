import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  specifyHexadecimalColorStringTypeName,
  specifyArcDegreeNumberTypeName,
  specifyIntegerNumberTypeName,
  specifyPercentageNumberTypeName,
  specifyPositiveIntegerNumberTypeName,
  specifyPositiveNumberTypeName,
  specifyRGBColorNumberTypeName,
  specifyZeroToOneNumberTypeName,
  specifyJSONNumberTypeName,
  specifyJSONStringTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  SpecifyJSONValue,
  makeJSONValueSchema,
  makeSpecifyJSONArrayValueSchema,
  makeSpecifyJSONBooleanValueSchema,
  makeSpecifyJSONNullValueSchema,
  makeSpecifyJSONNumberValueSchema,
  makeSpecifyJSONObjectValueSchema,
  makeSpecifyJSONStringValueSchema,
  SpecifyJSONArrayValue,
  SpecifyJSONArrayValueWithAlias,
  SpecifyJSONBooleanValue,
  SpecifyJSONBooleanValueWithAlias,
  SpecifyJSONNullValue,
  SpecifyJSONNullValueWithAlias,
  SpecifyJSONNumberValue,
  SpecifyJSONNumberValueWithAlias,
  SpecifyJSONObjectValue,
  SpecifyJSONObjectValueWithAlias,
  SpecifyJSONStringValue,
  SpecifyJSONStringValueWithAlias,
  specifyJSONStringDefinition,
  specifyJSONNumberDefinition,
} from '../../../src/definitions/tokenTypes/_JSON.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

describe.concurrent('Parse Specify JSON types', () => {
  const isSupportingAliasing = true;
  const isNotSupportingAliasing = false;

  describe.concurrent('JSON string', () => {
    describe.concurrent('makeSpecifyJSONStringValueSchema', () => {
      it('Should validate JSON string value', () => {
        const input = 'hello';
        const result = makeSpecifyJSONStringValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONStringValue>>;
      });
      it('Should fail validating a number for JSON string value', () => {
        const input = 123;
        expect(() =>
          makeSpecifyJSONStringValueSchema(isNotSupportingAliasing).parse(input),
        ).toThrow();
      });
      it('Should validate an alias for JSON string value', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyJSONStringValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONStringValueWithAlias>>;
      });
    });
    describe.concurrent('specifyJSONStringDefinition', () => {
      it('Should match token types of root level type', () => {
        expect(
          specifyJSONStringDefinition.matchTokenTypeAgainstMapping(
            specifyJSONStringTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyJSONStringDefinition.matchTokenTypeAgainstMapping(
            specifyHexadecimalColorStringTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
      });
    });
  });

  describe.concurrent('JSON number', () => {
    describe.concurrent('makeSpecifyJSONNumberValueSchema', () => {
      it('Should validate JSON number value', () => {
        const input = 123;
        const result = makeSpecifyJSONNumberValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONNumberValue>>;
      });
      it('Should fail validating a string for JSON number value', () => {
        const input = 'some string';
        expect(() =>
          makeSpecifyJSONNumberValueSchema(isNotSupportingAliasing).parse(input),
        ).toThrow();
      });
      it('Should validate an alias for JSON number value', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyJSONNumberValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONNumberValueWithAlias>>;
      });
    });
    describe.concurrent('specifyJSONNumberDefinition', () => {
      it('Should match token types of root level type', () => {
        expect(
          specifyJSONNumberDefinition.matchTokenTypeAgainstMapping(
            specifyJSONNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyJSONNumberDefinition.matchTokenTypeAgainstMapping(
            specifyArcDegreeNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyJSONNumberDefinition.matchTokenTypeAgainstMapping(
            specifyIntegerNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyJSONNumberDefinition.matchTokenTypeAgainstMapping(
            specifyPercentageNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyJSONNumberDefinition.matchTokenTypeAgainstMapping(
            specifyPositiveIntegerNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyJSONNumberDefinition.matchTokenTypeAgainstMapping(
            specifyPositiveNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyJSONNumberDefinition.matchTokenTypeAgainstMapping(
            specifyRGBColorNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyJSONNumberDefinition.matchTokenTypeAgainstMapping(
            specifyZeroToOneNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
      });
    });
  });

  describe.concurrent('JSON boolean', () => {
    describe.concurrent('makeSpecifyJSONBooleanValueSchema', () => {
      it('Should validate JSON boolean value', () => {
        const input = true;
        const result = makeSpecifyJSONBooleanValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONBooleanValue>>;
      });
      it('Should fail validating a string for JSON boolean value', () => {
        const input = 'some string';
        expect(() =>
          makeSpecifyJSONBooleanValueSchema(isNotSupportingAliasing).parse(input),
        ).toThrow();
      });
      it('Should validate an alias for JSON boolean value', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyJSONBooleanValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONBooleanValueWithAlias>>;
      });
    });
  });

  describe.concurrent('JSON null', () => {
    describe.concurrent('makeSpecifyJSONNullValueSchema', () => {
      it('Should validate JSON null value', () => {
        const input = null;
        const result = makeSpecifyJSONNullValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONNullValue>>;
      });
      it('Should fail validating a string for JSON null value', () => {
        const input = 'some string';
        expect(() =>
          makeSpecifyJSONNullValueSchema(isNotSupportingAliasing).parse(input),
        ).toThrow();
      });
      it('Should validate an alias for JSON null value', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyJSONNullValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONNullValueWithAlias>>;
      });
    });
  });

  describe.concurrent('JSON array', () => {
    describe.concurrent('makeSpecifyJSONArrayValueSchema', () => {
      it('Should validate JSON array value', () => {
        const input = ['a string', 1, true];
        const result = makeSpecifyJSONArrayValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONArrayValue>>;
      });
      it('Should fail validating a string for JSON array value', () => {
        const input = 'some string';
        expect(() =>
          makeSpecifyJSONArrayValueSchema(isNotSupportingAliasing).parse(input),
        ).toThrow();
      });
      it('Should validate an alias for JSON array value', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyJSONArrayValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONArrayValueWithAlias>>;
      });
    });
  });

  describe.concurrent('JSON object', () => {
    describe.concurrent('makeSpecifyJSONObjectValueSchema', () => {
      it('Should validate JSON object value', () => {
        const input = { a: 'string', b: 1, c: true };
        const result = makeSpecifyJSONObjectValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONObjectValue>>;
      });
      it('Should fail validating a string for JSON object value', () => {
        const input = 'some string';
        expect(() =>
          makeSpecifyJSONObjectValueSchema(isNotSupportingAliasing).parse(input),
        ).toThrow();
      });
      it('Should validate an alias for JSON object value', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyJSONObjectValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyJSONObjectValueWithAlias>>;
      });
    });
  });

  describe.concurrent('All JSON values — MUST NOT BE IMPLEMENTED', () => {
    it('Should validate all JSON values', () => {
      const stringInput = 'hello';
      expect(makeJSONValueSchema(isNotSupportingAliasing).parse(stringInput)).toBe(stringInput);

      const numberInput = 123;
      expect(makeJSONValueSchema(isNotSupportingAliasing).parse(numberInput)).toBe(numberInput);

      const booleanInput = true;
      expect(makeJSONValueSchema(isNotSupportingAliasing).parse(booleanInput)).toBe(booleanInput);

      const nullInput = null;
      expect(makeJSONValueSchema(isNotSupportingAliasing).parse(nullInput)).toBe(nullInput);

      const arrayInput = [stringInput, numberInput, booleanInput, nullInput, { a: stringInput }];
      expect(makeJSONValueSchema(isNotSupportingAliasing).parse(arrayInput)).toStrictEqual(
        arrayInput,
      );

      const objectInput = {
        string: stringInput,
        number: numberInput,
        boolean: booleanInput,
        null: nullInput,
        array: [1, 2, 3],
        object: {
          string: 'hello',
        },
      } as const;
      const objectResult = makeJSONValueSchema(isNotSupportingAliasing).parse(objectInput);
      expect(objectResult).toStrictEqual(objectInput);
      type Result = Expect<Equal<typeof objectResult, SpecifyJSONValue>>;
    });
    it('Should fail validating a function for JSON value', () => {
      const input = () => {};
      expect(() => makeJSONValueSchema(isNotSupportingAliasing).parse(input)).toThrow();
    });
    it('Should functionally validate aliases for all JSON values — MUST NOT BE IMPLEMENTED', () => {
      const stringInput = 'some.alias';
      expect(makeJSONValueSchema(isSupportingAliasing).parse(stringInput)).toBe(stringInput);

      const numberInput = 'some.alias';
      expect(makeJSONValueSchema(isSupportingAliasing).parse(numberInput)).toBe(numberInput);

      const booleanInput = 'some.alias';
      expect(makeJSONValueSchema(isSupportingAliasing).parse(booleanInput)).toBe(booleanInput);

      const nullInput = 'some.alias';
      expect(makeJSONValueSchema(isSupportingAliasing).parse(nullInput)).toBe(nullInput);

      const arrayInput = 'some.alias';
      expect(makeJSONValueSchema(isSupportingAliasing).parse(arrayInput)).toBe(arrayInput);

      const objectInput = 'some.alias';
      expect(makeJSONValueSchema(isSupportingAliasing).parse(objectInput)).toBe(objectInput);
    });
  });
});
