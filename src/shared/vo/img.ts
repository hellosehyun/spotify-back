export type Img = object & { __brand: symbol }

export const Img = (val: any): Img => {
  return val as Img
}
