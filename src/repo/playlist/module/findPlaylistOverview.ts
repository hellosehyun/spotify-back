import { Playlist } from "@/entity/playlist/playlist"
import { Detail, IsPublic, Name as PlaylistName, Type } from "@/entity/playlist/vo"
import { User } from "@/entity/user/user"
import { BannerImg, Country, Email, Role, Name as UserName } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { playlist, user } from "@/infra/drizzle/schema"
import { Cnt, Eid, Id, Img, Timestamp, Track } from "@/shared/vo"
import { and, eq, isNull } from "drizzle-orm"

type In = {
  clientId: Id
  playlistId: Id
}
type Out = Promise<
  | {
      playlist: Playlist
      creator: User
    }
  | undefined
>

export const findPlaylistOverview = async (arg: In, tx = db): Out => {
  const q = tx
    .select()
    .from(playlist)
    .innerJoin(user, eq(user.id, playlist.creatorId))
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
      tracks: row.playlist.tracks.map((track) => Track(track)),
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
  }
}
