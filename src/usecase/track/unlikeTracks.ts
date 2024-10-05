import { Type } from "@/entity/playlist/vo"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadRequest } from "@/shared/static/exception"
import { Id, Idx } from "@/shared/vo"

type In = {
  clientId: any
  accessToken: any
  idxs: any[]
}

type Out = Promise<void>

export const unlikeTracks = (
  playlistRepo: PlaylistRepo //
) => ({
  execute: async (arg: In): Out => {
    const dto = pre(arg)

    const playlist = await playlistRepo.findPlaylist({
      creatorId: dto.clientId,
      type: Type("like"),
    })
    if (playlist === undefined) throw new BadRequest()

    await playlistRepo.updatePlaylist({
      playlistId: playlist.id,
      tracks: playlist.tracks.filter((_, i) => !arg.idxs.includes(i)),
    })

    return
  },
})

const pre = (arg: In) => {
  try {
    return {
      clientId: Id(arg.clientId),
      accessToken: arg.accessToken!,
      idxs: arg.idxs.map((idx) => Idx(idx)),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
