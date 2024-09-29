export type ProfileEuri = string & { __brand: symbol }

export const ProfileEuri = {
  create(val: any): ProfileEuri {
    return val as ProfileEuri
  },
}
