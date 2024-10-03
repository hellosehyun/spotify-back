import { Eid, Id, Timestamp, Track } from "@/shared/vo"
import { Idx } from "./vo"

export type Item = {
  id: Id
  playlistId: Id
  eid: Eid
  idx: Idx
  track: Track
  createdAt: Timestamp
}

export const Item = <T>(val: Item): Item => {
  return val as Item
}
