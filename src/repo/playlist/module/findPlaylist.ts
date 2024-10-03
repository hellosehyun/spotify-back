import { Item } from "@/entity/item/item"
import { Idx } from "@/entity/item/vo"
import { Playlist } from "@/entity/playlist/playlist"
import { IsPublic, Name as PlaylistName, Type } from "@/entity/playlist/vo"
import { User } from "@/entity/user/user"
import { Name as UserName } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { item, playlist, user } from "@/infra/drizzle/schema"
import { Cnt, Id, Img, Timestamp, Track } from "@/shared/vo"
import { and, desc, eq, isNull, or, sql } from "drizzle-orm"

type In = {
  clientId: Id
  playlistId: Id
}
type Out = Promise<
  | Playlist<{
      id: Id
      img: Img
      type: Type
      name: UserName
      isPublic: IsPublic
      itemCnt: Cnt
      createdAt: Timestamp
      creator: User<{
        id: Id
        name: PlaylistName
        img: Img
      }>
      items: Item<{
        idx: Idx
        track: Track
        createdAt: Timestamp
      }>[]
    }>
  | undefined
>

export const findPlaylist = async (arg: In, tx = db): Out => {
  const limit = 50
  const w = tx
    .select() //
    .from(item)
    .where(
      and(
        isNull(item.deletedAt),
        eq(item.playlistId, arg.playlistId) //
      )
    )
    .orderBy(desc(item.idx))
    .limit(limit)
    .offset(0)
    .as("w")

  const q = tx
    .select({
      id: playlist.id,
      img: playlist.img,
      type: playlist.type,
      name: playlist.name,
      isPublic: playlist.isPublic,
      itemCnt: playlist.itemCnt,
      createdAt: playlist.createdAt,
      creator: {
        id: user.id,
        name: user.name,
        img: user.img,
      },
      items: sql<{ track: object; createdAt: Date; order: number }[]>`
        coalesce(
          jsonb_agg(
            jsonb_build_object(
              'track', ${w.track},
              'createdAt', ${w.createdAt},
              'order', ${w.idx}
            )
          ) FILTER (WHERE ${w.id} IS NOT NULL),
          '[]'::jsonb
        )
      `,
    })
    .from(playlist)
    .innerJoin(user, eq(user.id, playlist.creatorId))
    .leftJoin(w, eq(w.playlistId, playlist.id))
    .where(
      and(
        isNull(playlist.deletedAt), //
        eq(playlist.id, arg.playlistId)
      )
    )
    .groupBy(playlist.id, user.id)

  const [row] = await q.execute()

  if (!row) return undefined

  const entity = Playlist({
    id: Id(row.id),
    img: Img(row.img),
    type: Type(row.type),
    name: PlaylistName(row.name),
    isPublic: IsPublic(row.isPublic),
    itemCnt: Cnt(row.itemCnt),
    createdAt: Timestamp(row.createdAt),
    creator: User({
      id: Id(row.creator.id),
      name: PlaylistName(row.creator.name),
      img: Img(row.creator.img),
    }),
    items: row.items.map((item) =>
      Item({
        idx: Idx(item.order),
        createdAt: Timestamp(item.createdAt),
        track: Track(item.track),
      })
    ),
  })

  return entity
}
