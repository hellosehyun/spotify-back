export type ArtistName = string & { __brand: symbol }

export const ArtistName = {
  create(val: any): ArtistName {
    return val as ArtistName
  },
}
