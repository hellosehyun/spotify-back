import zod from "zod"

export type Id = number & { __brand: symbol }

export const Id = {
  create(val: any): Id {
    return zod.coerce.number().int().positive().parse(val) as Id
  },
}
