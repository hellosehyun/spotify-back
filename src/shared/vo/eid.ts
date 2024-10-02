export type Eid = string & { __brand: symbol }

export const Eid = (val: any): Eid => {
  return val as Eid
}
