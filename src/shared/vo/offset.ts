import zod from "zod"

export type Offset = number & { __brand: symbol }

export const Offset = (val: any): Offset => {
  return zod.coerce.number().int().nonnegative().parse(val) as Offset
}
