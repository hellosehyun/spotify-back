export type Idx = number & { __brand: symbol }

export const Idx = (val: any): Idx => {
  return val as Idx
}
