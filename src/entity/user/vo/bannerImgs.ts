export type BannerImgs = object[] & { __brand: symbol }

export const BannerImgs = {
  create(val: any): BannerImgs {
    return val as BannerImgs
  },
}
