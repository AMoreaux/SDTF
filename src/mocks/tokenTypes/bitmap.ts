import { pickRandomInList, makeRandomString } from '../../utils/mockGenerators.js';
import { SpecifyBitmapValue } from '../../definitions/tokenTypes/bitmap.js';
import { getMockedPositiveIntegerNumberValue } from './_numbers.js';
import { getMockedBitmapFormatValue } from './bitmapFormat.js';

export function getMockedBitmapValue(
  partial?: Partial<SpecifyBitmapValue>,
  withNulls = true,
): SpecifyBitmapValue {
  return {
    url: 'https://sdtf.specifyapp.com/' + makeRandomString(),
    format: getMockedBitmapFormatValue(),
    width: withNulls ? null : getMockedPositiveIntegerNumberValue(),
    height: withNulls ? null : getMockedPositiveIntegerNumberValue(),
    variationLabel: withNulls ? null : pickRandomInList(['dark', 'light', '@x2', '@x3']),
    provider: 'Specify',
    ...partial,
  };
}
