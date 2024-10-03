import { Playlist } from "@/entity/playlist/playlist"
import { IsPublic, Name as PlaylistName, Type } from "@/entity/playlist/vo"
import { User } from "@/entity/user/user"
import { Name as UserName } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { playlist, user } from "@/infra/drizzle/schema"
import { Id, Img, Offset } from "@/shared/vo"
import { and, eq, inArray, isNull, or } from "drizzle-orm"

type In = {
  clientId: Id
  offset: Offset
  playlistIds?: Id[]
  userId?: Id
}
type Out = Promise<
  | Playlist<{
      id: Id
      img: Img
      type: Type
      name: PlaylistName
      isPublic: IsPublic
      coverImgs: Img[]
      creator: User<{
        id: Id
        name: UserName
      }>
    }>[]
  | undefined
>

export const findPlaylists = async (arg: In, tx = db): Out => {
  const limit = 50
  const q = tx
    .select({
      id: playlist.id,
      img: playlist.img,
      type: playlist.type,
      name: playlist.name,
      isPublic: playlist.isPublic,
      coverImgs: playlist.coverImgs,
      creator: {
        id: user.id,
        name: user.name,
      },
    })
    .from(playlist)
    .innerJoin(user, eq(user.id, playlist.creatorId))
    .limit(limit)
    .offset(arg.offset)

  const cond = [
    isNull(playlist.deletedAt),
    or(eq(playlist.isPublic, true), eq(playlist.creatorId, arg.clientId)),
  ]
  if (arg.playlistIds !== undefined) cond.push(inArray(playlist.id, arg.playlistIds))
  if (arg.userId !== undefined) cond.push(eq(playlist.creatorId, arg.userId))

  q.where(and(...cond))

  const rows = await q.execute()

  if (rows.length === 0) return undefined

  const entities = rows.map((row) =>
    Playlist({
      id: Id(row.id),
      img: Img(row.img),
      type: Type(row.type),
      name: PlaylistName(row.name),
      isPublic: IsPublic(row.isPublic),
      coverImgs: row.coverImgs.map((item) => Img(item)),
      creator: User({
        id: Id(row.creator.id),
        name: UserName(row.creator.name),
      }),
    })
  )

  return entities
}
