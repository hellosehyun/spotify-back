export type Name = string & { __brand: symbol }

export const Name = {
  create(val: any): Name {
    return val as Name
  },
}
