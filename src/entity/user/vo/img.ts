export type Img = object & { __brand: symbol }

export const Img = {
  create(val: any): Img {
    return val as Img
  },
}
