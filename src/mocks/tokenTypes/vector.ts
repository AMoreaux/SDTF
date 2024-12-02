import { pickRandomInList, makeRandomString } from '../../utils/mockGenerators.js';
import { SpecifyVectorValue } from '../../definitions/tokenTypes/vector.js';
import { getMockedVectorFormatValue } from './vectorFormat.js';

export function getMockedVectorValue(
  partial?: Partial<SpecifyVectorValue>,
  withNulls = true,
): SpecifyVectorValue {
  return {
    url: 'https://sdtf.specifyapp.com/' + makeRandomString(),
    format: getMockedVectorFormatValue(),
    variationLabel: withNulls ? null : pickRandomInList(['dark', 'light', 'outline', 'solid']),
    provider: 'Specify',
    ...partial,
  };
}
