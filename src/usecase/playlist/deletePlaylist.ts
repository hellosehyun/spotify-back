import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadRequest, Forbidden, NotFound } from "@/shared/static/exception"
import { Id } from "@/shared/vo"

type In = {
  clientId: any
  playlistId: any
}

type Out = Promise<void>

export const deletePlaylist = (
  playlistRepo: PlaylistRepo //
) => ({
  execute: async (arg: In): Out => {
    const dto = pre(arg)

    const playlist = await playlistRepo.findPlaylist({ playlistId: dto.playlistId })
    if (playlist === undefined) throw new NotFound()
    if (playlist.creatorId !== dto.clientId) throw new Forbidden()

    await playlistRepo.deletePlaylist({ playlistId: dto.playlistId })

    return
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
