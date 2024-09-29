export type FollowerCnt = number & { __brand: symbol }

export const FollowerCnt = {
  create(val: any): FollowerCnt {
    return val as FollowerCnt
  },
}
