import zod from "zod"

export type Idx = number & { __brand: symbol }

export const Idx = (val: any): Idx => {
  return zod.coerce.number().int().nonnegative().parse(val) as Idx
}
