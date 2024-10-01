import { Track } from "@/entity/item/vo"
import { Eid } from "@/shared/vo"

type In = {
  accessToken: string
  eids: Eid[]
}

type Out = Promise<{
  ok: boolean
  status: number
  data?: Track[]
}>

export const getTracks = async (params: In): Out => {
  const url = new URL("https://api.spotify.com/v1/tracks")
  url.searchParams.append("ids", params.eids.join(","))

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      "Content-Type": "application/json",
    },
  })

  return {
    status: res.status,
    ok: res.ok,
    data: res.ok ? await map((await res.json()).tracks) : undefined,
  }
}

const map = async (tracks: any) => {
  return await Promise.all(
    tracks.map(
      async (track: any) =>
        await Track.create({
          artists: track.artists.map((artist: any) => ({
            name: artist.name,
            eid: artist.id,
          })),
          album: {
            imgs: track.album.images.map((image: any) => ({
              width: image.width,
              height: image.height,
              url: image.url,
            })),
            name: track.album.name,
            eid: track.album.id,
          },
          name: track.name,
          eid: track.id,
        })
    )
  )
}
