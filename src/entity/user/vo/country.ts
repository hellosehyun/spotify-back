export type Country = string & { __brand: symbol }

export const Country = {
  create(val: any): Country {
    return val as Country
  },
}
