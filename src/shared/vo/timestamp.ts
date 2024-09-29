export type Timestamp = string | (Date & { __brand: symbol })

export const Timestamp = {
  create(val: any): Timestamp {
    return val as Timestamp
  },
}
