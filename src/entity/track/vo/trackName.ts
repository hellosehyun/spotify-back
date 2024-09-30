export type TrackName = string & { __brand: symbol }

export const TrackName = {
  create(val: any): TrackName {
    return val as TrackName
  },
}
