export type Name = string & { __brand: symbol }

export const Name = (val: any): Name => {
  return val as Name
}
