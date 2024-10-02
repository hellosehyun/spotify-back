export type Timestamp = Date & { __brand: symbol }

export const Timestamp = (val: any): Timestamp => {
  return val as Timestamp
}
