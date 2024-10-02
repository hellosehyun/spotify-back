export type Detail = string & { __brand: symbol }

export const Detail = (val: any): Detail => {
  return val as Detail
}
