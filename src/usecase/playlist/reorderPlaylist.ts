import { Type } from "@/entity/playlist/vo"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadRequest } from "@/shared/static/exception"
import { Id, Idx } from "@/shared/vo"

type In = {
  playlistId: any
  clientId: any
  idxs: any[]
  pos: any
}

type Out = Promise<void>

export const reorderPlaylist = (
  playlistRepo: PlaylistRepo //
) => ({
  execute: async (arg: In): Out => {
    const dto = await pre(arg)

    const playlist = await playlistRepo.findPlaylist({ userId: dto.clientId, type: Type("like") })
    if (playlist === undefined) throw new BadRequest()

    await playlistRepo.updatePlaylist({
      playlistId: playlist.id,
      tracks: reorder(playlist.tracks, dto.idxs, dto.pos),
    })

    return
  },
})

const pre = async (arg: In) => {
  try {
    return {
      clientId: Id(arg.clientId!),
      playlistId: Id(arg.playlistId!),
      idxs: arg.idxs!.map((idx) => Idx(idx)),
      pos: Idx(arg.pos!),
    }
  } catch (err) {
    throw new BadRequest()
  }
}

const reorder = (arr: any[], idxs: number[], pos: number) => {
  const newArr = [...arr]
  const moved = idxs
    .sort((a, b) => b - a)
    .map((idx) => newArr.splice(idx, 1)[0])
    .reverse()

  newArr.splice(pos, 0, ...moved)
  return newArr
}
