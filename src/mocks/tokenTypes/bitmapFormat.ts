import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyBitmapFormatValue,
  specifyBitmapFormatValues,
} from '../../definitions/tokenTypes/bitmapFormat.js';

export function getMockedBitmapFormatValue(
  override?: SpecifyBitmapFormatValue,
): SpecifyBitmapFormatValue {
  if (override) {
    return override;
  }
  return pickRandomInList(specifyBitmapFormatValues);
}
