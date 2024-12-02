import {
  specifyStepsTimingFunctionJumpTermValues,
  SpecifyStepsTimingFunctionValue,
} from '../../definitions/tokenTypes/stepsTimingFunction.js';
import { pickRandomInList, pickRandomNumberInRange } from '../../utils/mockGenerators.js';

export function getMockedStepsTimingFunctionValue(
  partial?: Partial<SpecifyStepsTimingFunctionValue>,
): SpecifyStepsTimingFunctionValue {
  return {
    stepsCount: pickRandomNumberInRange(1, 10, 1),
    jumpTerm: pickRandomInList(specifyStepsTimingFunctionJumpTermValues),
    ...partial,
  };
}
