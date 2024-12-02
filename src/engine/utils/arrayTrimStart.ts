export function arrayTrimStart<T>(array: Array<T>, toStrip: Array<T>) {
  let newStart = 0;

  for (let i = 0; i < toStrip.length; i++) {
    if (array[i] === toStrip[i]) {
      ++newStart;
    } else {
      return array;
    }
  }

  return array.slice(newStart);
}
