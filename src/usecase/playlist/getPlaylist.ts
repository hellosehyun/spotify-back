import { Idx } from "@/entity/item/vo"
import { Detail, IsPublic, Name as PlaylistName, Type } from "@/entity/playlist/vo"
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
  detail: Detail
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

    const entity = await playlistRepo.findPlaylist({
      clientId: dto.clientId,
      playlistId: dto.playlistId,
    })

    if (entity === undefined) throw new NotFound()
    if (!entity.playlist.isPublic && entity.creator.id !== dto.clientId) throw new Forbidden()

    const { creatorId, coverImgs, ...playlistRest } = entity.playlist

    return {
      ...playlistRest,
      creator: {
        id: entity.creator.id,
        name: entity.creator.name,
        img: entity.creator.img,
      },
      isMine: entity.creator.id === dto.clientId,
      items: entity.items.map(({ createdAt, eid, id, ...rest }) => ({
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
