import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { SpecifyBitmapsValue } from '../../definitions/tokenTypes/bitmaps.js';
import { getMockedBitmapValue } from './bitmap.js';

export function getMockedBitmapsValue(
  override?: SpecifyBitmapsValue,
  withNulls = true,
): SpecifyBitmapsValue {
  return (
    override ?? {
      files: new Array(pickRandomNumberInRange(1, 3))
        .fill(null)
        .map(() => getMockedBitmapValue(undefined, withNulls)) as SpecifyBitmapsValue['files'],
    }
  );
}
