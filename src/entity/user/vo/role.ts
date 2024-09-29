export type Role = string & { __brand: symbol }

export const Role = {
  create(val: any): Role {
    return val as Role
  },
}
