import { Id, Img, Timestamp } from "@/shared/vo"
import { Detail, IsPublic, Title, Type } from "./vo"
import { Track } from "../track/track"
import { User } from "../user/user"

export type Playlist<P = {}> = P & {
  id: Id
  imgs: Img[]
  type: Type
  title: Title
  items: Track<P extends { items: Track<infer T>[] } ? T : never>[]
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
