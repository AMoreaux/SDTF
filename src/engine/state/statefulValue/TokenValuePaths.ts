import { SDTFError } from '../../../errors/index.js';

export class TokenValuePaths {
  private pathsMap: Map<
    string,
    {
      stringPath: string;
      path: Array<string | number>;
      isLeaf: boolean;
    }
  > = new Map();
  addLeaf(path: Array<string | number>) {
    if (path.length < 1) {
      throw new SDTFError(
        'SDTF_INTERNAL_DESIGN_ERROR',
        'TokenValuePath leaf path must be of length 1 or greater',
      );
    }

    const initialLength = path.length;

    while (path.length) {
      const stringPath = path.join('.');

      if (this.pathsMap.has(stringPath)) return;

      this.pathsMap.set(stringPath, {
        stringPath,
        path: [...path],
        isLeaf: initialLength === path.length,
      });

      path = path.slice(0, -1);
    }
  }
  computeLeafParentPaths(): Array<Array<string | number>> {
    return Array.from(this.pathsMap.values())
      .sort(
        (
          // order by Z to A - specific to generic
          a,
          b,
        ) => `${b.stringPath}`.localeCompare(`${a.stringPath}`),
      )
      .reduce((acc, { path, isLeaf }, i, xs) => {
        if (isLeaf) return acc;
        acc.push(path);
        return acc;
      }, [] as Array<Array<string | number>>);
  }
}
