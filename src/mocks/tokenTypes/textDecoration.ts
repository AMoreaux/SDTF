import { pickRandomInList } from '../../utils/mockGenerators.js';
import {
  SpecifyTextDecorationValue,
  specifyTextDecorationValues,
} from '../../definitions/tokenTypes/textDecoration.js';

export function getMockedTextDecorationValue(
  override?: SpecifyTextDecorationValue,
): SpecifyTextDecorationValue {
  return override ?? pickRandomInList(specifyTextDecorationValues);
}
