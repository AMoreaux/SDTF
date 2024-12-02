import { pickRandomNumberInRange } from '../../utils/mockGenerators.js';
import { SpecifyVectorsValue } from '../../definitions/tokenTypes/vectors.js';
import { getMockedVectorValue } from './vector.js';

export function getMockedVectorsValue(
  override?: SpecifyVectorsValue,
  withNulls = true,
): SpecifyVectorsValue {
  return (
    override ?? {
      files: new Array(pickRandomNumberInRange(1, 3))
        .fill(null)
        .map(() => getMockedVectorValue(undefined, withNulls)) as SpecifyVectorsValue['files'],
    }
  );
}
