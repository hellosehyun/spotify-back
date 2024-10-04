import { IsPublic, Name as PlaylistName } from "@/entity/playlist/vo"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadRequest, NotFound } from "@/shared/static/exception"
import { Cnt, Id, Img, Page, Timestamp } from "@/shared/vo"

type In = {
  clientId: any
  creatorId: any
  page: any
}

type Out = Promise<
  {
    id: Id
    img: Img
    name: PlaylistName
    trackCnt: number
    coverImgs: Img[]
    isPublic: IsPublic
    createdAt: Timestamp
  }[]
>

export const getUserPlaylist = (
  playlistRepo: PlaylistRepo //
) => ({
  execute: async (arg: In): Out => {
    const dto = pre(arg)

    const entities = await playlistRepo.findPlaylists({
      clientId: dto.clientId,
      page: dto.page,
      creatorId: dto.creatorId,
    })

    if (entities === undefined) throw new NotFound()

    return entities.map(({ playlist: { type, creatorId, detail, tracks, ...restPlaylist } }) => {
      return {
        trackCnt: tracks.length,
        ...restPlaylist,
      }
    })
  },
})

const pre = (arg: In) => {
  try {
    return {
      clientId: Id(arg.clientId),
      creatorId: Id(arg.creatorId),
      page: Page(arg.page),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
