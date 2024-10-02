import { Track } from "@/shared/vo"

type In = {
  accessToken: string
}

type Out = Promise<{
  ok: boolean
  status: number
  data: Track[] | undefined
}>

export const getMyLikeTracks = async ({ accessToken }: In): Out => {
  const limit = 25
  const res = await api(accessToken, limit, 0).then(async (res1) => {
    if (!res1.ok) return res1
    let items = res1.data.items

    const promises = Array.from(
      { length: Math.ceil((res1.data.total - items.length) / limit) },
      (_, i) => api(accessToken, limit, (i + 1) * limit)
    )

    const results = await Promise.all(promises)
    const allResults = [res1, ...results]

    const ok = allResults.every((r) => r.ok)
    const status = ok ? 200 : allResults.find((r) => !r.ok)?.status || 500

    if (ok) {
      items = items.concat(...results.flatMap((r) => r.data.items))
    }

    return {
      ok,
      status,
      data: ok ? items : undefined,
    }
  })

  return {
    ok: res.ok,
    status: res.status,
    data: res.ok ? await map(res.data) : undefined,
  }
}

const api = async (accessToken: string, limit: number, offset: number) => {
  const res = await fetch(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${offset}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return {
    ok: res.ok,
    status: res.status,
    data: res.ok ? await res.json() : undefined,
  }
}

const map = async (items: any) => {
  return await Promise.all(
    items.map(
      async ({ track }: any) =>
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
