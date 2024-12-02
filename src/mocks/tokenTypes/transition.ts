import { SpecifyTransitionValue } from '../../definitions/tokenTypes/transition.js';
import { getMockedDurationValue } from './duration.js';
import { getMockedCubicBezierValue } from './cubicBezier.js';
import { getMockedStepsTimingFunctionValue } from './stepsTimingFunction.js';

export function getMockedTransitionValue(
  partial?: Partial<SpecifyTransitionValue>,
): SpecifyTransitionValue {
  const duration = getMockedDurationValue();
  return {
    duration,
    delay: getMockedDurationValue({
      unit: duration.unit,
      value: duration.value / 2,
    }),
    timingFunction:
      Math.random() > 0.5 ? getMockedCubicBezierValue() : getMockedStepsTimingFunctionValue(),
    ...partial,
  };
}
