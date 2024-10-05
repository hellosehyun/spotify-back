import { IsPublic, Name as PlaylistName } from "@/entity/playlist/vo"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadRequest, NotFound } from "@/shared/static/exception"
import { Id, Img, Page, Timestamp } from "@/shared/vo"

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
    isMine: boolean
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

    const entities = await playlistRepo.findFullPlaylists({
      clientId: dto.clientId,
      page: dto.page,
      creatorId: dto.creatorId,
    })

    if (entities === undefined) throw new NotFound()

    return await Promise.all(
      entities.map(
        async ({ playlist: { type, creatorId, detail, tracks, coverImgs, ...restPlaylist } }) => {
          return {
            coverImgs: await pickRandom(coverImgs),
            trackCnt: tracks.length,
            isMine: dto.clientId === creatorId,
            ...restPlaylist,
          }
        }
      )
    )
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

const pickRandom = async (arr: any[], amount = 3) =>
  new Promise<Img[]>((resolve) => {
    const length = Math.min(amount, arr.length)
    const result = new Set<any>()

    while (result.size < length) {
      const randomItem = arr[Math.floor(Math.random() * arr.length)]
      result.add(randomItem)
    }

    resolve(Array.from(result))
  })
