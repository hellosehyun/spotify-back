export type Type = string & { __brand: symbol }

export const Type = (val: any): Type => {
  return val as Type
}
