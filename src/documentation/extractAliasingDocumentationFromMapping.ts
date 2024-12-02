import {
  isArrayOfTypesMapping,
  isDiscriminatedUnionOfTypesMapping,
  isMapOfTypesMapping,
  isPrimitiveTypesMapping,
  isTokenTypeTypesMapping,
  isTupleOfTypesMapping,
  isUnionOfTypesMapping,
  TokenTypesMapping,
} from '../definitions/internals/tokenTypesMapping.js';

function atLeastZero(value: number) {
  if (value > 0) {
    return value;
  }
  return 0;
}
function makePadding(depth: number) {
  return '  '.repeat(atLeastZero(depth));
}

export function extractAliasingDocumentationFromMapping(
  tokenTypesMapping: TokenTypesMapping,
  depth: number = 1,
): any {
  return Object.entries(tokenTypesMapping).reduce((acc, [key, value]) => {
    const currentObject = { [key]: value };

    if (isUnionOfTypesMapping(currentObject)) {
      acc += `${currentObject._unionOf
        .map(c => extractAliasingDocumentationFromMapping(c, depth))
        .join(' or ')}`;
      return acc;
    }
    if (isMapOfTypesMapping(currentObject)) {
      const inner = Object.entries(currentObject._mapOf).reduce((acc, [k, v], i, xs) => {
        const isHead = i === 0;
        const isTail = i === xs.length - 1;
        if (isHead) {
          acc += `{`;
        }
        acc += `\n${makePadding(depth)}${k}: ${extractAliasingDocumentationFromMapping(
          v,
          depth + 1,
        )}${!isTail ? ',' : ''}`;
        if (isTail) {
          if (xs.length > 1) {
            acc += `\n`;
          }
          acc += `${makePadding(depth - 1)}}`;
        }
        return acc;
      }, '');
      acc += inner;
      return acc;
    }
    if (isArrayOfTypesMapping(currentObject)) {
      return `Array<${extractAliasingDocumentationFromMapping(
        currentObject._arrayOf[0], // We expect _arrayOf to be an array of one element
        depth,
      )}>`;
    }
    if (isDiscriminatedUnionOfTypesMapping(currentObject)) {
      acc += currentObject._discriminatedUnionOf
        .map(c => extractAliasingDocumentationFromMapping(c, depth))
        .join(' or ');
      return acc;
    }
    if (isTupleOfTypesMapping(currentObject)) {
      acc += `[${currentObject._tuple
        .map(c => extractAliasingDocumentationFromMapping(c, depth + 1))
        .join(', ')}]`;
      return acc;
    }
    if (isPrimitiveTypesMapping(currentObject)) {
      acc += `literal("${currentObject._primitive}")`;
      return acc;
    }
    if (isTokenTypeTypesMapping(currentObject)) {
      acc += `"${currentObject._tokenType}"`;
      return acc;
    }

    return acc;
  }, '');
}
