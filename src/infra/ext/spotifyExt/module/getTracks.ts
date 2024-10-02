import { Eid, Track } from "@/shared/vo"

type In = {
  accessToken: string
  eids: Eid[]
}

type Out = Promise<{
  ok: boolean
  status: number
  data: Track[] | undefined
}>

export const getTracks = async (arg: In): Out => {
  const url = new URL("https://api.spotify.com/v1/tracks")
  url.searchParams.append("ids", arg.eids.join(","))

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${arg.accessToken}`,
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
        await Track({
          artists: track.artists.map((artist: any) => ({
            name: artist.name,
            eid: artist.id,
          })),
          album: {
            img: {
              2: {
                url: track.album.images[0].url,
                width: track.album.images[0].width,
                height: track.album.images[0].height,
              },
              1: {
                url: track.album.images[1].url,
                width: track.album.images[1].width,
                height: track.album.images[1].height,
              },
              0: {
                url: track.album.images[2].url,
                width: track.album.images[2].width,
                height: track.album.images[2].height,
              },
            },
            name: track.album.name,
            eid: track.album.id,
          },
          name: track.name,
          eid: track.id,
        })
    )
  )
}
