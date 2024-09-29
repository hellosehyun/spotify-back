export type Email = string & { __brand: symbol }

export const Email = {
  create(val: any): Email {
    return val as Email
  },
}
