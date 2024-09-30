export type Detail = string & { __brand: symbol }

export const Detail = {
  create(val: any): Detail {
    return val as Detail
  },
}
