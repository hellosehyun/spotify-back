import { Playlist } from "@/entity/playlist/playlist"
import { Detail, IsPublic, Title, Type } from "@/entity/playlist/vo"
import { Track } from "@/entity/track/track"
import { AlbumName, ArtistName, TrackName } from "@/entity/track/vo"
import { User } from "@/entity/user/user"
import { Name as UserName } from "@/entity/user/vo"
import { PlaylistRepo } from "@/repo/playlistRepo/playlistRepo"
import { BadRequest } from "@/shared/static/exception"
import { Eid, Id, Img, Page, Timestamp } from "@/shared/vo"

type In = {
  id: any
  userId: any
  page: any
}

type Out = Promise<
  Playlist<{
    id: Id
    imgs: Img[]
    type: Type
    title: Title
    detail: Detail
    isPublic: IsPublic
    createdAt: Timestamp
    creator: User<{
      id: Id
      name: UserName
      imgs: Img[]
    }>
    items: Track<{
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
  }>
>

export const getPlaylist = (
  playlistRepo: PlaylistRepo //
) => ({
  execute: async (params: In): Out => {
    const dto = pre(params)

    const playlist = await playlistRepo.getPlaylist({
      id: dto.id,
      userId: dto.userId,
      page: dto.page,
    })

    return playlist
  },
})

const pre = (params: In) => {
  try {
    return {
      id: Id.create(params.id),
      userId: Id.create(params.userId),
      page: Page.create(params.page),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
