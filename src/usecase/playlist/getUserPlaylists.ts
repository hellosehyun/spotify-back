import { IsPublic, Name as PlaylistName, Type } from "@/entity/playlist/vo"
import { Name as UserName } from "@/entity/user/vo"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadRequest, NotFound } from "@/shared/static/exception"
import { Id, Img, Offset } from "@/shared/vo"

type In = {
  clientId: any
  userId: any
  offset: any
}

type Out = Promise<
  {
    id: Id
    img: Img
    type: Type
    name: PlaylistName
    isPublic: IsPublic
    coverImgs: Img[]
    creator: {
      id: Id
      name: UserName
    }
  }[]
>

export const getUserPlaylist = (
  playlistRepo: PlaylistRepo //
) => ({
  execute: async (arg: In): Out => {
    const dto = pre(arg)

    const playlists = await playlistRepo.findPlaylists({
      clientId: dto.clientId,
      userId: dto.userId,
      offset: dto.offset,
    })

    if (playlists === undefined) throw new NotFound()

    return playlists
  },
})

const pre = (arg: In) => {
  try {
    return {
      clientId: Id(arg.clientId),
      userId: Id(arg.userId),
      offset: Offset(arg.offset),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
