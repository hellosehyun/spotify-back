export type AlbumName = string & { __brand: symbol }

export const AlbumName = {
  create(val: any): AlbumName {
    return val as AlbumName
  },
}
