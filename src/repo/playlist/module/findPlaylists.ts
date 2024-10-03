import { Playlist } from "@/entity/playlist/playlist"
import { Detail, IsPublic, Name as PlaylistName, Type } from "@/entity/playlist/vo"
import { User } from "@/entity/user/user"
import { BannerImg, Country, Email, Role, Name as UserName } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { playlist, user } from "@/infra/drizzle/schema"
import { Cnt, Eid, Id, Img, Page, Timestamp } from "@/shared/vo"
import { and, eq, inArray, isNull, or } from "drizzle-orm"

type In = {
  clientId: Id
  creatorId?: Id
  playlistIds?: Id[]
  page: Page
}
type Out = Promise<
  | {
      playlist: Playlist
      creator: User
    }[]
  | undefined
>

export const findPlaylists = async (arg: In, tx = db): Out => {
  const limit = 50

  const q = tx
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
    .limit(50)
    .offset((arg.page - 1) * limit)

  const cond = [
    isNull(playlist.deletedAt),
    or(eq(playlist.isPublic, true), eq(playlist.creatorId, arg.clientId)),
  ]
  if (arg.playlistIds !== undefined) cond.push(inArray(playlist.id, arg.playlistIds))
  if (arg.creatorId !== undefined) cond.push(eq(playlist.creatorId, arg.creatorId))

  q.where(and(...cond))

  const rows = await q.execute()

  if (rows.length === 0) return undefined

  return rows.map((row) => ({
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
  }))
}
