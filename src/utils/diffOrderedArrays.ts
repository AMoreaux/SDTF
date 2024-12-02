export function diffOrderedArrays(reference: any[], candidate: any[]): any[] {
  const reversedCandidate = [...candidate].reverse();
  const reversedReference = [...reference].reverse();
  return reversedReference.reduce((acc, ref, i) => {
    if (ref !== reversedCandidate[i]) {
      acc.unshift(ref);
    }
    return acc;
  }, []);
}
