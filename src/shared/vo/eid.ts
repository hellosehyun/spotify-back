export type Eid = string & { __brand: symbol }

export const Eid = {
  create(val: any): Eid {
    return val as Eid
  },
}
