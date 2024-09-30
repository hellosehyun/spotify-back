import { Type } from "@/entity/playlist/vo"
import { SpotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { PlaylistRepo } from "@/repo/playlistRepo/playlistRepo"
import { BadRequest } from "@/shared/static/exception"
import { Eid, Id } from "@/shared/vo"

type In = {
  accessToken: any
  userId: any
  eids: any
}

type Out = Promise<{}>

export const dislikeTrack = (
  spotifyExt: SpotifyExt, //
  playlistRepo: PlaylistRepo
) => ({
  execute: async (params: In): Out => {
    const dto = pre(params)

    await playlistRepo.deleteItem({
      type: Type.create("like"),
      userId: dto.userId,
      eids: dto.eids,
    })

    const res = await spotifyExt.dislikeTracks({
      accessToken: dto.accessToken,
      eids: dto.eids,
    })
    if (!res.ok) throw new Error()

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
