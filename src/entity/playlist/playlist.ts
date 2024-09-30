import { Id, Img, Timestamp } from "@/shared/vo"
import { Detail, Title, Type } from "./vo"
import { Track } from "../track/track"
import { ArtistName, AlbumName } from "../track/vo"
import { Eid } from "@/shared/vo"

export type Playlist<T = {}> = T & {
  id: Id
  imgs: Img[]
  type: Type
  title: Title
  items: Track<{
    id: Id
    artists: {
      name: ArtistName
      eid: Eid
    }[]
    album: {
      name: AlbumName
      eid: Eid
      imgs: Img[]
    }
  }>[]
  detail: Detail
  createdAt: Timestamp
}

export const Playlist = {
  create<T>(val: Partial<Playlist<T>>): Playlist<T> {
    return val as Playlist<T>
  },
}
