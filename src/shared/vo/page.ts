import zod from "zod"

export type Page = number & { __brand: symbol }

export const Page = {
  create(val: any): Page {
    return zod.coerce.number().int().positive().parse(val) as Page
  },
}
