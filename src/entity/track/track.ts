import { Id, Eid, Timestamp } from "@/shared/vo"
import { ArtistName, AlbumName, TrackName } from "./vo"
import { Img } from "@/shared/vo"

export type Track<T = {}> = {
  id: Id
  name: TrackName
  eid: Eid
  artists: {
    name: ArtistName
    eid: Eid
  }[]
  album: {
    name: AlbumName
    eid: Eid
    imgs: Img[]
  }
  createdAt: Timestamp
} & T

export const Track = {
  create<T = {}>(val: Partial<Track<T>>): Track<T> {
    return val as Track<T>
  },
}
