import { Type } from "@/entity/playlist/vo"
import { SpotifyApi } from "@/infra/api/spotifyApi/spotifyApi"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadGateway, BadRequest } from "@/shared/static/exception"
import { Eid, Id, Timestamp } from "@/shared/vo"

type In = {
  clientId: any
  accessToken: any
  eids: any[]
}

type Out = Promise<void>

export const likeTracks = (
  playlistRepo: PlaylistRepo, //
  spotifyApi: SpotifyApi
) => ({
  execute: async (arg: In): Out => {
    const dto = await pre(arg)

    const res1 = await spotifyApi.getTracks({ eids: dto.eids, accessToken: dto.accessToken })
    if (!res1.ok) throw new BadGateway()

    const tracks = res1.data!.map((track) => ({ ...track, addedAt: Timestamp(new Date()) }))

    const playlist = await playlistRepo.findPlaylist({
      creatorId: dto.clientId,
      type: Type("like"),
    })
    if (playlist === undefined) throw new BadRequest()

    await playlistRepo.updatePlaylist({
      playlistId: playlist.id,
      tracks: [...tracks, ...playlist.tracks],
    })

    return
  },
})

const pre = async (arg: In) => {
  try {
    return {
      clientId: Id(arg.clientId),
      accessToken: arg.accessToken,
      eids: arg.eids.map((eid) => Eid(eid)),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
