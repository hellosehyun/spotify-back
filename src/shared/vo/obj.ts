export type Obj = {
  key: string
  buffer: Buffer
}[] & {
  __brand: symbol
}

export const Obj = (val: any): Obj => {
  return val as Obj
}
