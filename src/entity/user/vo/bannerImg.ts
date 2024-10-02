export type BannerImg = object[] & { __brand: symbol }

export const BannerImg = (val: any): BannerImg => {
  return val as BannerImg
}
