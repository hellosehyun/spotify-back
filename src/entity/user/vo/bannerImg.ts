export type BannerImg = object & { __brand: symbol }

export const BannerImg = {
  create(val: any): BannerImg {
    return val as BannerImg
  },
}
