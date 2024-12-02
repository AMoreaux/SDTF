export function arrayStartWith<T>(toSearch: Array<T>, prefixArray: Array<T>) {
  /* v8 ignore start */
  if (prefixArray.length > toSearch.length) return false;
  if (prefixArray.length === 0) return true;
  /* v8 ignore stop */

  for (let i = 0; i < prefixArray.length; i++) {
    if (toSearch[i] !== prefixArray[i]) return false;
  }

  return true;
}
