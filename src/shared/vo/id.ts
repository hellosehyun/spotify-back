import zod from "zod"

export type Id = string & { __brand: symbol }

export const Id = (val: any): Id => {
  return zod.string().parse(val) as Id
}
