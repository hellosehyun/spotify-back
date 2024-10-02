import { Cnt, Id, Img, Timestamp } from "@/shared/vo"
import { Detail, IsPublic, Name, Type } from "./vo"
import { User } from "../user/user"
import { Item } from "../item/item"

export type Playlist<P = {}> = P & {
  id: Id
  creatorId: Id
  img: Img
  type: Type
  name: Name
  coverImgs: Img[]
  items: Item<P extends { items: Item<infer I>[] } ? I : never>[]
  detail: Detail
  isPublic: IsPublic
  itemCnt: Cnt
  createdAt: Timestamp
  creator: User<P extends { creator: User<infer U> } ? U : never>
}

export const Playlist = <P = {}>(val: Partial<Playlist<P>>): Playlist<P> => {
  return val as Playlist<P>
}
