import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  specifyShadowTypeTypeValues,
  SpecifyShadowTypeValue,
} from '../../definitions/tokenTypes/shadowType.js';

export function getMockedShadowTypeValue(
  override?: SpecifyShadowTypeValue,
): SpecifyShadowTypeValue {
  return override ?? pickRandomInList(specifyShadowTypeTypeValues);
}
