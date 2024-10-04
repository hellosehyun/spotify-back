import { Id, Img, Timestamp, Track } from "@/shared/vo"
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
  tracks: Track[]
  createdAt: Timestamp
}

export const Playlist = (val: Playlist): Playlist => {
  return val as Playlist
}
