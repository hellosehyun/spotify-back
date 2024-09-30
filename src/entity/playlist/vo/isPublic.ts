export type IsPublic = boolean & { __brand: symbol }

export const IsPublic = {
  create(val: any): IsPublic {
    return val as IsPublic
  },
}
