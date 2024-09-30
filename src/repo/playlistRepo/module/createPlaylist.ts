import { Type } from "@/entity/playlist/vo"
import { Track } from "@/entity/track/track"
import { AlbumName, ArtistName, TrackName } from "@/entity/track/vo"
import { db } from "@/infra/drizzle/db"
import { item, playlist as playlistTable } from "@/infra/drizzle/schema"
import { Eid, Id, Img } from "@/shared/vo"

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

type Out = Promise<Id>

export const createPlaylist = async (params: In, tx = db): Out => {
  const [playlist] = await tx
    .insert(playlistTable)
    .values({
      creatorId: params.craetorId,
      imgs: [],
      title: params.type === "like" ? "Liked Tracks" : "Untitled",
      detail: "...",
      type: params.type,
      isPublic: true,
      likeCnt: 0,
    })
    .returning()

  await tx.insert(item).values(
    params.items.map((item, index) => ({
      playlistId: playlist.id,
      name: item.name,
      artists: item.artists,
      album: item.album,
      eid: item.eid,
      index: params.items.length - index - 1,
    }))
  )

  return Id.create(playlist.id)
}
