export type IsPublic = boolean & { __brand: symbol }

export const IsPublic = (val: any): IsPublic => {
  return val as IsPublic
}
