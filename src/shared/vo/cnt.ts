export type Cnt = number & { __brand: symbol }

export const Cnt = (val: any): Cnt => {
  return val as Cnt
}
