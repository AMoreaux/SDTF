import { pickRandomInList } from '../utils/mockGenerators.js';
import { specifyDesignTokenTypeNames } from '../definitions/index.js';

export function getRandomDesignTokenTypeName() {
  return pickRandomInList(specifyDesignTokenTypeNames);
}
