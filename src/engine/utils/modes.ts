export function matchHasIdenticalModes(modesFromA: Array<string>, modesFromB: Array<string>) {
  if (modesFromA.length === 0 || modesFromB.length === 0) return false;
  if (modesFromA.length !== modesFromB.length) return false;
  return modesFromA.every(mode => modesFromB.includes(mode));
}

export function matchHasAllowedMode(targetMode: string, allowedModes: Array<string>) {
  return allowedModes.includes(targetMode);
}
