import { Item } from "@/entity/item/item"
import { Idx } from "@/entity/item/vo"
import { Playlist } from "@/entity/playlist/playlist"
import { Detail, IsPublic, Name as PlaylistName, Type } from "@/entity/playlist/vo"
import { User } from "@/entity/user/user"
import { BannerImg, Country, Email, Role, Name as UserName } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { item, playlist, user } from "@/infra/drizzle/schema"
import { Cnt, Eid, Id, Img, Timestamp, Track } from "@/shared/vo"
import { and, desc, eq, isNull, sql } from "drizzle-orm"

type In = {
  clientId: Id
  playlistId: Id
}
type Out = Promise<
  | {
      playlist: Playlist
      creator: User
      items: Item[]
    }
  | undefined
>

export const findPlaylist = async (arg: In, tx = db): Out => {
  const limit = 50
  const w = tx.$with("items").as(
    tx
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
  )

  const q = tx
    .with(w)
    .select({
      playlist: {
        id: playlist.id,
        creatorId: playlist.creatorId,
        img: playlist.img,
        coverImgs: playlist.coverImgs,
        name: playlist.name,
        detail: playlist.detail,
        type: playlist.type,
        isPublic: playlist.isPublic,
        itemCnt: playlist.itemCnt,
        createdAt: playlist.createdAt,
      },
      items: sql<
        {
          track: object
          createdAt: Date
          id: string
          idx: number
          eid: string
          playlistId: string
        }[]
      >`
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', ${w.id},
            'eid', ${w.eid},
            'track', ${w.track},
            'playlistId', ${w.playlistId},
            'createdAt', ${w.createdAt},
            'idx', ${w.idx}
          )
        ) FILTER (WHERE ${w.id} IS NOT NULL),
        '[]'::jsonb
      )
    `,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
        img: user.img,
        bannerImg: user.bannerImg,
        eid: user.eid,
        role: user.role,
        followerCnt: user.followerCnt,
        createdAt: user.createdAt,
      },
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

  return {
    playlist: Playlist({
      id: Id(row.playlist.id),
      creatorId: Id(row.playlist.creatorId),
      img: Img(row.playlist.img),
      coverImgs: row.playlist.coverImgs.map((img) => Img(img)),
      name: PlaylistName(row.playlist.name),
      detail: Detail(row.playlist.detail),
      isPublic: IsPublic(row.playlist.isPublic),
      itemCnt: Cnt(row.playlist.itemCnt),
      type: Type(row.playlist.type),
      createdAt: Timestamp(row.playlist.createdAt),
    }),
    creator: User({
      id: Id(row.user.id),
      img: Img(row.user.img),
      name: UserName(row.user.name),
      email: Email(row.user.email),
      eid: Eid(row.user.eid),
      role: Role(row.user.role),
      country: Country(row.user.country),
      followerCnt: Cnt(row.user.followerCnt),
      bannerImg: BannerImg(row.user.bannerImg),
      createdAt: Timestamp(row.user.createdAt),
    }),
    items: row.items.map((item) =>
      Item({
        id: Id(item.id),
        idx: Idx(item.idx),
        track: Track(item.track),
        playlistId: Id(item.playlistId),
        eid: Eid(item.eid),
        createdAt: Timestamp(item.createdAt),
      })
    ),
  }
}
