import { Playlist } from "@/entity/playlist/playlist"
import { Detail, Title, Type } from "@/entity/playlist/vo"
import { Track } from "@/entity/track/track"
import { AlbumName, ArtistName, TrackName } from "@/entity/track/vo"
import { db } from "@/infra/drizzle/db"
import { item, playlist as playlistTable } from "@/infra/drizzle/schema"
import { Eid, Id, Img, Timestamp } from "@/shared/vo"
import { sql } from "drizzle-orm"

type In = {
  craetorId: Id
  type: Type
  items: Track<{
    artists: {
      name: ArtistName
      eid: Eid
    }[]
    album: {
      imgs: Img[]
      name: AlbumName
      eid: Eid
    }
    name: TrackName
    eid: Eid
  }>[]
}

type Out = Promise<
  Playlist<{
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
      name: TrackName
      eid: Eid
    }>[]
    detail: Detail
    createdAt: Timestamp
  }>
>

export const createPlaylist = async (params: In, tx = db): Out => {
  const [playlist] = await tx
    .insert(playlistTable)
    .values({
      creatorId: params.craetorId,
      imgs: [],
      title: params.type === "like" ? "Liked Tracks" : "Untitled",
      detail: "...",
      type: params.type,
      likeCnt: 0,
    })
    .returning()

  const items = await tx
    .insert(item)
    .values(
      params.items.map((item, index) => ({
        playlistId: playlist.id,
        name: item.name,
        artists: item.artists,
        album: item.album,
        eid: item.eid,
        index: sql`(
            SELECT COALESCE(MAX("index"), -1) + 1
            FROM item
            WHERE playlist_id = ${playlist.id}
          ) + ${index}`,
      }))
    )
    .returning()

  const entity = Playlist.create({
    id: Id.create(playlist.id),
    imgs: playlist.imgs.map((img) => Img.create(img)),
    type: params.type,
    title: Title.create(playlist.title),
    items: params.items,
    detail: Detail.create(playlist.detail),
    createdAt: Timestamp.create(playlist.createdAt),
  })

  return entity
}
