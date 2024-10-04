import { Playlist } from "@/entity/playlist/playlist"
import { Detail, IsPublic, Name, Type } from "@/entity/playlist/vo"
import { SpotifyApi } from "@/infra/api/spotifyApi/spotifyApi"
import { db } from "@/infra/drizzle/db"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { varisize } from "@/shared/helper/varisize"
import { BadGateway, BadRequest } from "@/shared/static/exception"
import { Cnt, Eid, Id, Img, Timestamp } from "@/shared/vo"
import { nanoid } from "nanoid"

type In = {
  clientId: any
  name: any
  accessToken: any
  img: any
  eids: any[]
}

type Out = Promise<{
  id: Id
  img: Img
  coverImgs: Img[]
  name: Name
}>

export const createPlaylist = (
  playlistRepo: PlaylistRepo, //
  spotifyApi: SpotifyApi
) => ({
  execute: async (arg: In): Out => {
    const dto = await pre(arg)

    const res = await spotifyApi.getTracks({ eids: dto.eids, accessToken: dto.accessToken })
    if (!res.ok) throw new BadGateway()

    const tracks = res.data!

    const playlist = Playlist({
      id: Id(nanoid(20)),
      creatorId: dto.clientId,
      img: dto.img,
      coverImgs: [],
      name: dto.name,
      detail: Detail(""),
      isPublic: IsPublic(true),
      tracks,
      type: Type("default"),
      createdAt: Timestamp(new Date()),
    })

    await playlistRepo.savePlaylist({ playlist })

    return {
      id: playlist.id,
      img: playlist.img,
      name: playlist.name,
      coverImgs: playlist.coverImgs,
    }
  },
})

const pre = async (arg: In) => {
  try {
    return {
      clientId: Id(arg.clientId!),
      name: Name(arg.name!),
      accessToken: arg.accessToken!,
      eids: arg.eids!.map((eid) => Eid(eid)),
      ...(await varisize(arg.img!, { path: `${arg.clientId}/playlist` })),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
