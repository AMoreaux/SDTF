import { specifyDesignTokenDefinitions } from '../definitions/designTokenDefinitions.js';
import { extractAliasingDocumentationFromMapping } from './extractAliasingDocumentationFromMapping.js';

export function generateMarkdownDocumentation() {
  const header = `# Specify Design Token Format\n\nThis generated document describes the format of the supported design tokens and their aliasing capabilities.\n## Token types`;

  const body = specifyDesignTokenDefinitions.reduce((acc, definition) => {
    const { type, tokenTypesMapping } = definition;

    const local = `\n\n### ${type}\nShape:\n\`\`\`\n${extractAliasingDocumentationFromMapping(
      tokenTypesMapping,
    )}\n\`\`\``;
    acc += local;

    return acc;
  }, '');

  return header + body + '\n';
}
