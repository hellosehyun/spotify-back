export type Track = object & { __brand: symbol }

export const Track = {
  create(val: any): Track {
    return val as Track
  },
}
