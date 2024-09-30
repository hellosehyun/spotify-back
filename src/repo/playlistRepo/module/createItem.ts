import { Type } from "@/entity/playlist/vo"
import { Track } from "@/entity/track/track"
import { AlbumName, ArtistName, TrackName } from "@/entity/track/vo"
import { db } from "@/infra/drizzle/db"
import { item, playlist } from "@/infra/drizzle/schema"
import { Eid, Id, Img } from "@/shared/vo"
import { sql } from "drizzle-orm"

type In = {
  playlistId?: Id
  userId?: Id
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

type Out = Promise<void>

export const createItem = async (params: In, tx = db): Out => {
  const sq =
    params.type === "general"
      ? sql`${params.playlistId}`
      : params.type === "like"
      ? sql`(SELECT id FROM ${playlist} WHERE creator_id = ${params.userId} LIMIT 1)`
      : null

  const query = tx
    .insert(item)
    .values(
      params.items.map((track, index) => ({
        playlistId: sq!,
        name: track.name,
        artists: track.artists,
        album: track.album,
        eid: track.eid,
        index: sql`(
          SELECT COALESCE(MAX("index"), -1) + 1 + ${index}
          FROM ${item}
          WHERE playlist_id = ${sq}
        )`,
      }))
    )
    .returning()

  const data = await query

  console.log(data)

  // const entities = data.map((insertedItem) =>
  //   Track.create({
  //     playlistId: Id.create(insertedItem.playlistId),
  //     id: Id.create(insertedItem.id),
  //     createdAt: Timestamp.create(insertedItem.createdAt),
  //     name: TrackName.create(insertedItem.name),
  //     artists: insertedItem.artists,
  //     album: insertedItem.album,
  //     eid: Eid.create(insertedItem.eid),
  //   })
  // )

  return
}
