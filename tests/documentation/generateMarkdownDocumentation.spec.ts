import { describe, it, expect } from 'vitest';

import { specifyDesignTokenTypeNames } from '../../src/index.js';
import { generateMarkdownDocumentation } from '../../src/documentation/generateMarkdownDocumentation.js';

describe('generateMarkdownDocumentation', () => {
  it('should return a markdown documentation for all token types', () => {
    const docs = generateMarkdownDocumentation();

    for (const type of specifyDesignTokenTypeNames) {
      expect(docs).toContain(type);
    }
    expect.assertions(specifyDesignTokenTypeNames.length);
  });
});
