export type Type = string & { __brand: symbol }

export const Type = {
  create(val: any): Type {
    return val as Type
  },
}
