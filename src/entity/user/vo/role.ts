export type Role = string & { __brand: symbol }

export const Role = (val: any): Role => {
  return val as Role
}
