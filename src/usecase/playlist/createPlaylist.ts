import { Item } from "@/entity/item/item"
import { Idx } from "@/entity/item/vo"
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

// type Out = Promise<{
//   id: Id
//   img: Img
//   coverImgs: Img[]
//   name: Name
// }>

type Out = Promise<any>

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
      itemCnt: Cnt(tracks.length),
      type: Type("default"),
      createdAt: Timestamp(new Date()),
    })

    const items = tracks.reverse().map((track) =>
      Item({
        id: Id(nanoid(20)),
        playlistId: playlist.id,
        eid: Eid(track.eid),
        createdAt: Timestamp(new Date()),
        track,
      })
    )

    await db.transaction(async (tx) => {
      playlistRepo.savePlaylist({ playlist }, tx)
      playlistRepo.saveItems({ items }, tx)
    })

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
