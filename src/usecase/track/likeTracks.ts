import { Type } from "@/entity/playlist/vo"
import { SpotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { PlaylistRepo } from "@/repo/playlistRepo/playlistRepo"
import { BadGateway, BadRequest } from "@/shared/static/exception"
import { Eid, Id } from "@/shared/vo"

type In = {
  accessToken: any
  userId: any
  eids: any
}

type Out = Promise<{}>

export const likeTracks = (
  spotifyExt: SpotifyExt, //
  playlistRepo: PlaylistRepo
) => ({
  execute: async (params: In): Out => {
    const dto = pre(params)

    const res1 = await spotifyExt.getTracks({ eids: dto.eids, accessToken: dto.accessToken })
    if (!res1.ok) throw new BadGateway()

    const items = res1.data!

    await playlistRepo.createItem({
      items,
      type: Type.create("like"),
      userId: dto.userId,
    })

    const res2 = await spotifyExt.likeTracks({
      accessToken: dto.accessToken,
      eids: dto.eids,
    })
    if (!res2.ok) throw new BadGateway()

    return {}
  },
})

const pre = (params: In) => {
  try {
    return {
      accessToken: params.accessToken!,
      userId: Id.create(params.userId),
      eids: params.eids.map((eid: any) => Eid.create(eid)),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
