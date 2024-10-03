import { IsPublic, Name as PlaylistName } from "@/entity/playlist/vo"
import { BannerImg, Email, Name as UserName } from "@/entity/user/vo"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadRequest, NotFound } from "@/shared/static/exception"
import { Cnt, Id, Img, Page, Timestamp } from "@/shared/vo"

type In = {
  clientId: any
  creatorId: any
  page: any
}

type Out = Promise<{
  id: Id
  name: UserName
  email: Email
  img: Img
  bannerImg: BannerImg
  followerCnt: Cnt
  isMe: boolean
  createdAt: Timestamp
  collections: {
    id: Id
    img: Img
    name: PlaylistName
    coverImgs: Img[]
    isPublic: IsPublic
    itemCnt: Cnt
    createdAt: Timestamp
  }[]
}>

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

    const { eid, role, country, ...restCreator } = entities[0].creator

    return {
      ...restCreator,
      isMe: restCreator.id === dto.clientId,
      collections: entities.map(({ playlist }) => {
        const { type, name, creatorId, detail, ...restPlaylist } = playlist

        if (playlist.type === "like") {
          return {
            name: PlaylistName(`${restCreator.name}의 좋아요 플레이리스트`),
            ...restPlaylist,
          }
        } else {
          return { name, ...restPlaylist }
        }
      }),
    }
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
