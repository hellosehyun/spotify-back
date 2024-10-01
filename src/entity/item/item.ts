import { Id, Timestamp } from "@/shared/vo"
import { Order, Track } from "./vo"

export type Item<T> = T & {
  id: Id
  playlistId: Id
  order: Order
  track: Track
  createdAt: Timestamp
}

export const Item = {
  create<T>(val: Partial<Item<T>>): Item<T> {
    return val as Item<T>
  },
}
