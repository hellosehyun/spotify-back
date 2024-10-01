import { Id, Imgs, Timestamp } from "@/shared/vo"
import { Detail, IsPublic, Title, Type } from "./vo"
import { User } from "../user/user"
import { Item } from "../item/item"

export type Playlist<P = {}> = P & {
  id: Id
  imgs: Imgs[]
  type: Type
  title: Title
  items: Item<P extends { items: Item<infer I>[] } ? I : never>[]
  detail: Detail
  isPublic: IsPublic
  createdAt: Timestamp
  creator: User<P extends { creator: User<infer U> } ? U : never>
}

export const Playlist = {
  create<P = {}>(val: Partial<Playlist<P>>): Playlist<P> {
    return val as Playlist<P>
  },
}
