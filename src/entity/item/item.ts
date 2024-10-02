import { Id, Timestamp, Track } from "@/shared/vo"
import { Idx } from "./vo"

export type Item<T> = T & {
  id: Id
  playlistId: Id
  idx: Idx
  track: Track
  createdAt: Timestamp
}

export const Item = <T>(val: Partial<Item<T>>): Item<T> => {
  return val as Item<T>
}
