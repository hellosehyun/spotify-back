import { Playlist } from "@/entity/playlist/playlist"
import { Detail, IsPublic, Name, Type } from "@/entity/playlist/vo"
import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id, Img, Timestamp, Track } from "@/shared/vo"
import { and, eq, isNull } from "drizzle-orm"

type In = {
  userId?: Id
  playlistId?: Id
  type?: Type
}
type Out = Promise<Playlist | undefined>

export const findPlaylist = async (arg: In, tx = db): Out => {
  const q = tx.select().from(playlist)

  const cond = [isNull(playlist.deletedAt)]
  if (arg.playlistId !== undefined) cond.push(eq(playlist.id, arg.playlistId))
  if (arg.userId !== undefined) cond.push(eq(playlist.creatorId, arg.userId))

  q.where(and(...cond))

  const [row] = await q.execute()

  if (!row) return undefined

  return Playlist({
    id: Id(row.id),
    creatorId: Id(row.creatorId),
    img: Img(row.img),
    coverImgs: row.coverImgs.map((img) => Img(img)),
    name: Name(row.name),
    detail: Detail(row.detail),
    isPublic: IsPublic(row.isPublic),
    tracks: row.tracks.map((track) => Track(track)),
    type: Type(row.type),
    createdAt: Timestamp(row.createdAt),
  })
}
