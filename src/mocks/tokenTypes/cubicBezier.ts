import { SpecifyCubicBezierValue } from '../../definitions/tokenTypes/cubicBezier.js';
import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';

export function getMockedCubicBezierValue(
  override?: SpecifyCubicBezierValue,
): SpecifyCubicBezierValue {
  return (
    override ?? [
      Math.random(),
      pickRandomNumberInRange(-3, 5),
      Math.random(),
      pickRandomNumberInRange(-3, 5),
    ]
  );
}
