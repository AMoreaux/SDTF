export type ReturnTypeWithArgs<T extends (...args: any[]) => any, ARGS_T> = Extract<
  T extends {
    (...args: infer A1): infer R1;
    (...args: infer A2): infer R2;
    (...args: infer A3): infer R3;
    (...args: infer A4): infer R4;
  }
    ? [A1, R1] | [A2, R2] | [A3, R3] | [A4, R4]
    : T extends {
        (...args: infer A1): infer R1;
        (...args: infer A2): infer R2;
        (...args: infer A3): infer R3;
      }
    ? [A1, R1] | [A2, R2] | [A3, R3]
    : T extends { (...args: infer A1): infer R1; (...args: infer A2): infer R2 }
    ? [A1, R1] | [A2, R2]
    : T extends { (...args: infer A1): infer R1 }
    ? [A1, R1]
    : never,
  [ARGS_T, any]
>[1];

export type ArrayWithAtLeastOneElement<T> = [T, ...T[]];

export type BooleanAnd<A extends boolean, B extends boolean, M extends boolean> = A extends M
  ? B extends M
    ? true
    : false
  : false;

export type Not<A extends boolean> = A extends true ? false : true;

export type Primitive = string | number | boolean | null;
export type PrimitivesWithBasicRecordAndArray =
  | Primitive
  | Array<unknown>
  | Record<string, unknown>;

export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
  x: infer R,
) => any
  ? R
  : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
