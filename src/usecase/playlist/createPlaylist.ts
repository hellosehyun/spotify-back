import { Playlist } from "@/entity/playlist/playlist"
import { Detail, IsPublic, Name, Type } from "@/entity/playlist/vo"
import { SpotifyApi } from "@/infra/api/spotifyApi/spotifyApi"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { BadGateway, BadRequest } from "@/shared/static/exception"
import { Eid, Id, Img, Timestamp, Track } from "@/shared/vo"
import { nanoid } from "nanoid"

type In = {
  clientId: any
  accessToken: any
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
    const coverImgs = uniqueAlbumImgs(tracks)

    const playlist = Playlist({
      id: Id(nanoid(20)),
      creatorId: dto.clientId,
      img: Img({}),
      coverImgs,
      name: Name(""),
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
      accessToken: arg.accessToken!,
      eids: arg.eids!.map((eid) => Eid(eid)),
    }
  } catch (err) {
    throw new BadRequest()
  }
}

const uniqueAlbumImgs = (tracks: Track[]) => {
  return [...new Map(tracks.map((t) => [t.album.eid, t.album.img])).values()]
}
