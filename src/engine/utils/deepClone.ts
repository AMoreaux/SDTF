export function deepClone<T>(value: T): T {
  if (typeof value !== 'object' || value === null) {
    return value;
  }
  // TODO @Nico: evaluate https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
  return JSON.parse(JSON.stringify(value));
}
