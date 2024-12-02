/* v8 ignore start */
import fs from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateMarkdownDocumentation } from './generateMarkdownDocumentation.js';

const filePath = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'generated-documentation.md',
);
const content = generateMarkdownDocumentation();

console.log('Generating documentation at', filePath);
fs.writeFileSync(filePath, content);
/* v8 ignore stop */
