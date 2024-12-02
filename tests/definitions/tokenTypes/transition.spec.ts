import { describe, expect, it } from 'vitest';
import { ValuePath } from '../../../src/engine/state/path/ValuePath.js';

import { Equal, Expect } from '../../_utils.js';
import { SpecifyModeAndValueLevelAliasSignature } from '../../../src/definitions/internals/designTokenAlias.js';
import {
  specifyCubicBezierTypeName,
  specifyDurationTypeName,
  specifyStepsTimingFunctionTypeName,
  specifyTransitionTypeName,
} from '../../../src/definitions/designTokenTypeNames.js';

import {
  makeSpecifyTransitionValueSchema,
  specifyTransitionDefinition,
  SpecifyTransitionValue,
  SpecifyTransitionValueWithAlias,
} from '../../../src/definitions/tokenTypes/transition.js';

describe.concurrent('transition', () => {
  describe.concurrent('makeSpecifyTransitionValueSchema', () => {
    const isSupportingAliasing = true;
    const isNotSupportingAliasing = false;

    it('Should validate a transition value', () => {
      const inputWithCubicBezier: SpecifyTransitionValue = {
        duration: {
          value: 300,
          unit: 'ms',
        },
        timingFunction: [0.4, 0, 0.2, 1],
        delay: {
          value: 0,
          unit: 'ms',
        },
      };
      const result =
        makeSpecifyTransitionValueSchema(isNotSupportingAliasing).parse(inputWithCubicBezier);
      expect(result).toStrictEqual(inputWithCubicBezier);
      type Result = Expect<Equal<typeof result, SpecifyTransitionValue>>;
      type Declaration = Expect<Equal<typeof result, SpecifyTransitionValue>>;

      const inputWithStepsFunction: SpecifyTransitionValue = {
        duration: {
          value: 300,
          unit: 'ms',
        },
        timingFunction: {
          stepsCount: 4,
          jumpTerm: 'start',
        },
        delay: {
          value: 0,
          unit: 'ms',
        },
      };
      expect(
        makeSpecifyTransitionValueSchema(isNotSupportingAliasing).parse(inputWithStepsFunction),
      ).toStrictEqual(inputWithStepsFunction);
    });
    it('Should fail validating a transition value with missing properties', () => {
      expect(() => makeSpecifyTransitionValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
    it('Should validate an alias for a transition value', () => {
      const input: SpecifyModeAndValueLevelAliasSignature = {
        $alias: 'some.transition',
        $mode: 'default',
      };
      const result = makeSpecifyTransitionValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
      type Result = Expect<Equal<typeof result, SpecifyTransitionValueWithAlias>>;
      type Declaration = Expect<Equal<typeof result, SpecifyTransitionValueWithAlias>>;
    });
    it('Should validate an alias for a transition value sub keys', () => {
      const input: SpecifyTransitionValueWithAlias = {
        duration: {
          $alias: 'some.transition.duration',
          $mode: 'default',
        },
        timingFunction: {
          $alias: 'some.transition.timingFunction',
          $mode: 'default',
        },
        delay: {
          $alias: 'some.transition.delay',
          $mode: 'default',
        },
      };
      const result = makeSpecifyTransitionValueSchema(isSupportingAliasing).parse(input);
      expect(result).toStrictEqual(input);
    });

    it('Should fail validating a transition value with extra properties', () => {
      expect(() =>
        makeSpecifyTransitionValueSchema(isNotSupportingAliasing).parse({
          duration: {
            value: 300,
            unit: 'ms',
          },
          timingFunction: [0.4, 0, 0.2, 1],
          delay: {
            value: 0,
            unit: 'ms',
          },
          extraProperty: 'extra',
        }),
      ).toThrow();
    });
    it('Should fail validating a transition value with missing properties', () => {
      expect(() => makeSpecifyTransitionValueSchema(isNotSupportingAliasing).parse({})).toThrow();
    });
  });
  describe.concurrent('specifyTransitionDefinition', () => {
    it('Should match token types of root level types', () => {
      expect(
        specifyTransitionDefinition.matchTokenTypeAgainstMapping(
          specifyTransitionTypeName,
          new ValuePath([]),
        ),
      ).toStrictEqual({ success: true });
    });
    it('Should match token types of sub-types', () => {
      expect(
        specifyTransitionDefinition.matchTokenTypeAgainstMapping(
          specifyDurationTypeName,
          new ValuePath(['duration']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTransitionDefinition.matchTokenTypeAgainstMapping(
          specifyDurationTypeName,
          new ValuePath(['delay']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTransitionDefinition.matchTokenTypeAgainstMapping(
          specifyCubicBezierTypeName,
          new ValuePath(['timingFunction']),
        ),
      ).toStrictEqual({ success: true });
      expect(
        specifyTransitionDefinition.matchTokenTypeAgainstMapping(
          specifyStepsTimingFunctionTypeName,
          new ValuePath(['timingFunction']),
        ),
      ).toStrictEqual({ success: true });
    });
  });
});
