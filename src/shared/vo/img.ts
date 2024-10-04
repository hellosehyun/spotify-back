export type Img = {
  [key: number]: {
    width: number
    height: number
    url: string
  }
} & {
  __brand: symbol
}

export const Img = (val: any): Img => {
  return val as Img
}
