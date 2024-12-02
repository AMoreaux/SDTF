import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyVectorFormatValue,
  specifyVectorFormatValues,
} from '../../definitions/tokenTypes/vectorFormat.js';

export function getMockedVectorFormatValue(
  override?: SpecifyVectorFormatValue,
): SpecifyVectorFormatValue {
  if (override) {
    return override;
  }
  return pickRandomInList(specifyVectorFormatValues);
}
