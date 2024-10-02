export type Country = string & { __brand: symbol }

export const Country = (val: any): Country => {
  return val as Country
}
