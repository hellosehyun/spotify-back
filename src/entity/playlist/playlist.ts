import { Cnt, Id, Img, Timestamp } from "@/shared/vo"
import { Detail, IsPublic, Name, Type } from "./vo"

export type Playlist = {
  id: Id
  creatorId: Id
  img: Img
  type: Type
  name: Name
  coverImgs: Img[]
  detail: Detail
  isPublic: IsPublic
  itemCnt: Cnt
  createdAt: Timestamp
}

export const Playlist = (val: Playlist): Playlist => {
  return val as Playlist
}
