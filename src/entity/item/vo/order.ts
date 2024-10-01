export type Order = number & { __brand: symbol }

export const Order = {
  create(val: any): Order {
    return val as Order
  },
}
