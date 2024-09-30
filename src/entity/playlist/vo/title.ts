export type Title = string & { __brand: symbol }

export const Title = {
  create(val: any): Title {
    return val as Title
  },
}
