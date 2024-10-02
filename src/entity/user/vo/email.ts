export type Email = string & { __brand: symbol }

export const Email = (val: any): Email => {
  return val as Email
}
