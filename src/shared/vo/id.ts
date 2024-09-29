export type Id = number & { __brand: symbol }

export const Id = {
  create(val: any): Id {
    return val as Id
  },
}
