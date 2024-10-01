export type Imgs = object & { __brand: symbol }

export const Imgs = {
  create(val: any): Imgs {
    return val as Imgs
  },
}
