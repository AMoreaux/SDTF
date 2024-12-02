import { SpecifyHexadecimalColorStringValue } from '../../definitions/tokenTypes/_strings.js';
import { pickRandomInList } from '../../utils/mockGenerators.js';

export function getMockedHexadecimalColorStringValue(
  override?: SpecifyHexadecimalColorStringValue,
): SpecifyHexadecimalColorStringValue {
  if (override) {
    return override;
  }
  return `#${new Array(6)
    .fill(0)
    .map(() =>
      pickRandomInList([
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
      ]),
    )
    .join('')}`;
}
