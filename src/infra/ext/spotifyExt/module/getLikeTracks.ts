import { Track } from "@/entity/track/track"
import { TrackName, ArtistName, AlbumName } from "@/entity/track/vo"
import { Eid, Img } from "@/shared/vo"

type In = {
  accessToken: string
}

type Out = Promise<{
  ok: boolean
  status: number
  data?: Track<{
    artists: {
      name: ArtistName
      eid: Eid
    }[]
    album: {
      imgs: Img[]
      name: AlbumName
      eid: Eid
    }
    name: TrackName
    eid: Eid
  }>[]
}>

export const getLikeTracks = async ({ accessToken }: In): Out => {
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

const map = async (items: Item[]) => {
  return await Promise.all(
    items.map(
      async ({ track }) =>
        await Track.create({
          artists: track.artists.map((artist) => ({
            name: ArtistName.create(artist.name),
            eid: Eid.create(artist.id),
          })),
          album: {
            imgs: track.album.images.map((image) =>
              Img.create({
                width: image.width,
                height: image.height,
                url: image.url,
              })
            ),
            name: AlbumName.create(track.album.name),
            eid: Eid.create(track.album.id),
          },
          name: TrackName.create(track.name),
          eid: Eid.create(track.id),
        })
    )
  )
}

interface Item {
  added_at: string
  track: {
    album: {
      album_type: string
      artists: {
        external_urls: { spotify: string }
        href: string
        id: string
        name: string
        type: string
        uri: string
      }[]
      available_markets: string[]
      external_urls: { spotify: string }
      href: string
      id: string
      images: { height: number; width: number; url: string }[]
      is_playable: boolean
      name: string
      release_date: string
      release_date_precision: string
      total_tracks: number
      type: string
      uri: string
    }
    artists: {
      external_urls: { spotify: string }
      href: string
      id: string
      name: string
      type: string
      uri: string
    }[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: { isrc: string }
    external_urls: { spotify: string }
    href: string
    id: string
    is_local: boolean
    is_playable: boolean
    name: string
    popularity: number
    preview_url: string
    track_number: number
    type: string
    uri: string
  }
}
