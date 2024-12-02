export function JSONParseIfString(tokens: unknown): unknown {
  if (typeof tokens === 'string') {
    return JSON.parse(tokens);
  }
  return tokens;
}
