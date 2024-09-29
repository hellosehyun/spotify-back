export type ProfileEid = string & { __brand: symbol }

export const ProfileEid = {
  create(val: any): ProfileEid {
    return val as ProfileEid
  },
}
