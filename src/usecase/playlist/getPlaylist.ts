import { Idx } from "@/entity/item/vo"
import { IsPublic, Name as PlaylistName, Type } from "@/entity/playlist/vo"
import { Name as UserName } from "@/entity/user/vo"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadRequest, Forbidden, NotFound } from "@/shared/static/exception"
import { Cnt, Id, Img, Timestamp, Track } from "@/shared/vo"

type In = {
  clientId: any
  playlistId: any
}

type Out = Promise<{
  id: Id
  img: Img
  type: Type
  name: PlaylistName
  isPublic: IsPublic
  itemCnt: Cnt
  isMine: boolean
  createdAt: Timestamp
  creator: {
    id: Id
    name: UserName
    img: Img
  }
  items: {
    idx: Idx
    track: Track
    addedAt: Timestamp
  }[]
}>

export const getPlaylist = (
  playlistRepo: PlaylistRepo //
) => ({
  execute: async (arg: In): Out => {
    const dto = pre(arg)

    const playlist = await playlistRepo.findPlaylist({
      clientId: dto.clientId,
      playlistId: dto.playlistId,
    })

    if (playlist === undefined) throw new NotFound()
    if (!playlist.isPublic && playlist.creator.id !== dto.clientId) throw new Forbidden()

    return {
      ...playlist,
      isMine: playlist.creator.id === dto.clientId,
      items: playlist.items.map(({ createdAt, ...rest }) => ({
        ...rest,
        addedAt: createdAt,
      })),
    }
  },
})

const pre = (arg: In) => {
  try {
    return {
      clientId: Id(arg.clientId),
      playlistId: Id(arg.playlistId),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
