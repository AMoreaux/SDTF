import { SpecifyDesignTokenFormat } from '../definitions/index.js';

import { specifyDefaultSeed } from './specify/specifyDefault.tokens.js';
import { radixColorsSeed } from './radix/radixColors.js';
import { openColorSeed } from './openColor/openColor.tokens.js';

export const seeds: {
  [key in 'specifyDefault' | 'radixColors' | 'openColor']: SpecifyDesignTokenFormat;
} = {
  specifyDefault: specifyDefaultSeed,
  radixColors: radixColorsSeed,
  openColor: openColorSeed,
};
