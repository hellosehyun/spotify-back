export type Cnt = number & { __brand: symbol }

export const Cnt = {
  create(val: any): Cnt {
    return val as Cnt
  },
}
