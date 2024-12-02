import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import {
  specifyIntegerNumberTypeName,
  specifyPositiveIntegerNumberTypeName,
  specifyPositiveNumberTypeName,
  specifyZeroToOneNumberTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyArcDegreeNumberValueSchema,
  makeSpecifyIntegerNumberValueSchema,
  makeSpecifyPercentageNumberValueSchema,
  makeSpecifyPositiveIntegerNumberValueSchema,
  makeSpecifyPositiveNumberValueSchema,
  makeSpecifyRGBColorNumberValueSchema,
  makeSpecifyZeroToOneNumberValueSchema,
  SpecifyArcDegreeNumberValue,
  SpecifyArcDegreeNumberValueWithAlias,
  specifyIntegerNumberDefinition,
  SpecifyIntegerNumberValue,
  SpecifyIntegerNumberValueWithAlias,
  SpecifyPercentageNumberValue,
  SpecifyPercentageNumberValueWithAlias,
  SpecifyPositiveIntegerNumberValue,
  SpecifyPositiveIntegerNumberValueWithAlias,
  specifyPositiveNumberDefinition,
  SpecifyPositiveNumberValue,
  SpecifyPositiveNumberValueWithAlias,
  SpecifyRGBColorNumberValue,
  SpecifyRGBColorNumberValueWithAlias,
  SpecifyZeroToOneNumberValue,
  SpecifyZeroToOneNumberValueWithAlias,
} from '../../../src/definitions/tokenTypes/_numbers.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/index.js';

describe.concurrent('Parse Specify Utility types - Numbers', () => {
  const isSupportingAliasing = true;
  const isNotSupportingAliasing = false;

  describe.concurrent('Integer', () => {
    describe.concurrent('makeSpecifyIntegerNumberValueSchema', () => {
      it('Should validate an integer number', () => {
        const input = 123;
        const result = makeSpecifyIntegerNumberValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyIntegerNumberValue>>;

        expect(makeSpecifyIntegerNumberValueSchema(isNotSupportingAliasing).parse(-1)).toBe(-1);
      });
      it('Should fail validating a float number', () => {
        expect(() =>
          makeSpecifyIntegerNumberValueSchema(isNotSupportingAliasing).parse(123.456),
        ).toThrow();
      });
      it('Should fail validating a string', () => {
        expect(() =>
          makeSpecifyIntegerNumberValueSchema(isNotSupportingAliasing).parse('123'),
        ).toThrow();
      });
      it('Should validate an alias for an integer number', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyIntegerNumberValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyIntegerNumberValueWithAlias>>;
      });
    });
    describe.concurrent('specifyIntegerNumberDefinition', () => {
      it('Should match token types of root level type', () => {
        expect(
          specifyIntegerNumberDefinition.matchTokenTypeAgainstMapping(
            specifyIntegerNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyIntegerNumberDefinition.matchTokenTypeAgainstMapping(
            specifyPositiveIntegerNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
      });
    });
  });

  describe.concurrent('ZeroToOne', () => {
    describe.concurrent('makeSpecifyZeroToOneNumberValueSchema', () => {
      it('Should validate a zero-to-one number', () => {
        const input = 0;
        const result = makeSpecifyZeroToOneNumberValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyZeroToOneNumberValue>>;

        expect(makeSpecifyZeroToOneNumberValueSchema(isNotSupportingAliasing).parse(1)).toBe(1);
      });
      it('Should validate a float number between 0 and 1', () => {
        const input = 0.5;
        const result = makeSpecifyZeroToOneNumberValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyZeroToOneNumberValue>>;
      });
      it('Should fail validating a string', () => {
        expect(() =>
          makeSpecifyZeroToOneNumberValueSchema(isNotSupportingAliasing).parse('0.5'),
        ).toThrow();
      });
      it('Should validate an alias for a zero-to-one number', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyZeroToOneNumberValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyZeroToOneNumberValueWithAlias>>;
      });
    });
  });

  describe.concurrent('ArcDegree', () => {
    describe.concurrent('makeSpecifyArcDegreeNumberValueSchema', () => {
      it('Should validate an arc degree number', () => {
        const input = 0;
        const result = makeSpecifyArcDegreeNumberValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyArcDegreeNumberValue>>;

        expect(makeSpecifyArcDegreeNumberValueSchema(isNotSupportingAliasing).parse(359.999)).toBe(
          359.999,
        );
      });
      it('Should fail validating the value 360', () => {
        expect(() =>
          makeSpecifyArcDegreeNumberValueSchema(isNotSupportingAliasing).parse(360),
        ).toThrow();
      });
      it('Should fail validating a string', () => {
        expect(() =>
          makeSpecifyArcDegreeNumberValueSchema(isNotSupportingAliasing).parse('0'),
        ).toThrow();
      });
      it('Should validate an alias for an arc degree number', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyArcDegreeNumberValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyArcDegreeNumberValueWithAlias>>;
      });
    });
  });

  describe.concurrent('RGBColor', () => {
    describe.concurrent('makeSpecifyRGBColorNumberValueSchema', () => {
      it('Should validate a RGB number', () => {
        const input = 0;
        const result = makeSpecifyRGBColorNumberValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyRGBColorNumberValue>>;

        expect(makeSpecifyRGBColorNumberValueSchema(isNotSupportingAliasing).parse(255)).toBe(255);
        expect(makeSpecifyRGBColorNumberValueSchema(isNotSupportingAliasing).parse(0.58)).toBe(
          0.58,
        );
      });
      it('Should fail validating a RGB number greater than 255', () => {
        expect(() =>
          makeSpecifyRGBColorNumberValueSchema(isNotSupportingAliasing).parse(256),
        ).toThrow();
      });
      it('Should fail validating a RGB number smaller than 0', () => {
        expect(() =>
          makeSpecifyRGBColorNumberValueSchema(isNotSupportingAliasing).parse(-12),
        ).toThrow();
      });
      it('Should fail validating a string', () => {
        expect(() =>
          makeSpecifyRGBColorNumberValueSchema(isNotSupportingAliasing).parse('0'),
        ).toThrow();
      });
      it('Should validate an alias for a RGB number', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyRGBColorNumberValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyRGBColorNumberValueWithAlias>>;
      });
    });
  });

  describe.concurrent('Positive', () => {
    describe.concurrent('makeSpecifyPositiveNumberValueSchema', () => {
      it('Should validate a positive number', () => {
        const input = 1;
        const result = makeSpecifyPositiveNumberValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyPositiveNumberValue>>;

        expect(makeSpecifyPositiveNumberValueSchema(isNotSupportingAliasing).parse(1000.0323)).toBe(
          1000.0323,
        );
        expect(makeSpecifyPositiveNumberValueSchema(isNotSupportingAliasing).parse(0)).toBe(0);
      });
      it('Should fail validating a negative number', () => {
        expect(() =>
          makeSpecifyPositiveNumberValueSchema(isNotSupportingAliasing).parse(-1),
        ).toThrow();
      });
      it('Should fail validating a string', () => {
        expect(() =>
          makeSpecifyPositiveNumberValueSchema(isNotSupportingAliasing).parse('1'),
        ).toThrow();
      });
      it('Should validate an alias for a positive number', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyPositiveNumberValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyPositiveNumberValueWithAlias>>;
      });
    });
    describe.concurrent('specifyPositiveNumberDefinition', () => {
      it('Should match token types of root level type', () => {
        expect(
          specifyPositiveNumberDefinition.matchTokenTypeAgainstMapping(
            specifyPositiveNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyPositiveNumberDefinition.matchTokenTypeAgainstMapping(
            specifyZeroToOneNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
        expect(
          specifyPositiveNumberDefinition.matchTokenTypeAgainstMapping(
            specifyPositiveIntegerNumberTypeName,
            ValuePath.empty(),
          ),
        ).toStrictEqual({ success: true });
      });
    });
  });

  describe.concurrent('PositiveInteger', () => {
    describe.concurrent('makeSpecifyPositiveIntegerNumberValueSchema', () => {
      it('Should validate a positive integer number', () => {
        const input = 1;
        const result =
          makeSpecifyPositiveIntegerNumberValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyPositiveIntegerNumberValue>>;

        expect(makeSpecifyPositiveIntegerNumberValueSchema(isNotSupportingAliasing).parse(0)).toBe(
          0,
        );
      });
      it('Should fail validating a negative integer number', () => {
        expect(() =>
          makeSpecifyPositiveIntegerNumberValueSchema(isNotSupportingAliasing).parse(-1),
        ).toThrow();
      });
      it('Should fail validating a positive float number', () => {
        expect(() =>
          makeSpecifyPositiveIntegerNumberValueSchema(isNotSupportingAliasing).parse(1.123),
        ).toThrow();
      });
      it('Should fail validating a string', () => {
        expect(() =>
          makeSpecifyPositiveIntegerNumberValueSchema(isNotSupportingAliasing).parse('1'),
        ).toThrow();
      });
      it('Should validate an alias for a positive integer number', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result =
          makeSpecifyPositiveIntegerNumberValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyPositiveIntegerNumberValueWithAlias>>;
      });
    });
  });

  describe.concurrent('Percentage', () => {
    describe.concurrent('makeSpecifyPercentageNumberValueSchema', () => {
      it('Should validate a percentage number', () => {
        const input = 0;
        const result = makeSpecifyPercentageNumberValueSchema(isNotSupportingAliasing).parse(input);
        expect(result).toBe(input);
        type Result = Expect<Equal<typeof result, SpecifyPercentageNumberValue>>;

        expect(makeSpecifyPercentageNumberValueSchema(isNotSupportingAliasing).parse(100)).toBe(
          100,
        );
        expect(makeSpecifyPercentageNumberValueSchema(isNotSupportingAliasing).parse(0.58)).toBe(
          0.58,
        );
      });
      it('Should fail validating a percentage number greater than 100', () => {
        expect(() =>
          makeSpecifyPercentageNumberValueSchema(isNotSupportingAliasing).parse(101),
        ).toThrow();
      });
      it('Should fail validating a percentage number smaller than 0', () => {
        expect(() =>
          makeSpecifyPercentageNumberValueSchema(isNotSupportingAliasing).parse(-1),
        ).toThrow();
      });
      it('Should fail validating a string', () => {
        expect(() =>
          makeSpecifyPercentageNumberValueSchema(isNotSupportingAliasing).parse('0'),
        ).toThrow();
      });
      it('Should validate an alias for a percentage number', () => {
        const input: SpecifyModeAndValueLevelAliasSignature = {
          $alias: 'some.alias',
          $mode: 'default',
        };
        const result = makeSpecifyPercentageNumberValueSchema(isSupportingAliasing).parse(input);
        expect(result).toStrictEqual(input);
        type Result = Expect<Equal<typeof result, SpecifyPercentageNumberValueWithAlias>>;
      });
    });
  });
});
