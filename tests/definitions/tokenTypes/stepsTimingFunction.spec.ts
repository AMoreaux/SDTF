import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyPositiveIntegerNumberValue } from '../../../src/definitions/tokenTypes/_numbers.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyPositiveIntegerNumberTypeName,
  specifyStepsTimingFunctionTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyStepsTimingFunctionValueSchema,
  specifyStepsTimingFunctionDefinition,
  specifyStepsTimingFunctionJumpTermValues,
  SpecifyStepsTimingFunctionValue,
  SpecifyStepsTimingFunctionValueWithAlias,
} from '../../../src/definitions/tokenTypes/stepsTimingFunction.js';

describe.concurrent('stepsTimingFunction', () => {
  describe.concurrent('makeSpecifyStepsTimingFunctionValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a steps timing function', () => {
      const makeInput: (
        term: SpecifyStepsTimingFunctionValue['jumpTerm'],
      ) => SpecifyStepsTimingFunctionValue = term => ({
        stepsCount: 2,
        jumpTerm: term,
      });
      const result = makeSpecifyStepsTimingFunctionValueSchema(isNotSupportingAliasing).parse(
        makeInput('start'),
      );
      expect(result).toStrictEqual(makeInput('start'));
      type Result = Expect<
        Equal<
          typeof result,
          {
            stepsCount: SpecifyPositiveIntegerNumberValue;
            jumpTerm: 'start' | 'end' | 'jump-start' | 'jump-end' | 'jump-none' | 'jump-both';
          }
        >
      >;
      type Declaration = Expect<Equal<typeof result, SpecifyStepsTimingFunctionValue>>;

      expect(
        makeSpecifyStepsTimingFunctionValueSchema(isNotSupportingAliasing).parse(makeInput('end')),
      ).toStrictEqual(makeInput('end'));
      expect(
        makeSpecifyStepsTimingFunctionValueSchema(isNotSupportingAliasing).parse(
          makeInput('jump-start'),
        ),
      ).toStrictEqual(makeInput('jump-start'));
      expect(
        makeSpecifyStepsTimingFunctionValueSchema(isNotSupportingAliasing).parse(
          makeInput('jump-end'),
        ),
      ).toStrictEqual(makeInput('jump-end'));
      expect(
        makeSpecifyStepsTimingFunctionValueSchema(isNotSupportingAliasing).parse(
          makeInput('jump-none'),
        ),
      ).toStrictEqual(makeInput('jump-none'));
      expect(
        makeSpecifyStepsTimingFunctionValueSchema(isNotSupportingAliasing).parse(
          makeInput('jump-both'),
        ),
      ).toStrictEqual(makeInput('jump-both'));
    });
    it('Should fail validating a string for a steps timing function term', () => {
      expect(() =>
        makeSpecifyStepsTimingFunctionValueSchema(isNotSupportingAliasing).parse('a-string'),
      ).toThrow();
    });
    it('Should validate an alias for a steps timing function term', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.stepsTimingFunction',
        $mode: 'default',
      };
      const result = makeSpecifyStepsTimingFunctionValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyStepsTimingFunctionValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyStepsTimingFunctionValueWithAlias>>;
    });
  });
  describe.concurrent('specifyStepsTimingFunctionDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyStepsTimingFunctionDefinition.matchTokenTypeAgainstMapping(
          specifyStepsTimingFunctionTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyStepsTimingFunctionDefinition.matchTokenTypeAgainstMapping(
          specifyPositiveIntegerNumberTypeName,
          new ValuePath(['stepsCount']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyStepsTimingFunctionDefinition.matchTokenTypeAgainstMapping(
          specifyStepsTimingFunctionJumpTermValues[0],
          new ValuePath(['jumpTerm']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
