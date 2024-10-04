import { client } from "../helper/client"
import { IndexResponse } from "@elastic/elasticsearch/lib/api/types"
import { playlist } from "@/infra/drizzle/schema"
import { Playlist } from "@/entity/playlist/playlist"
import { Item } from "@/entity/item/item"

type In = {
  playlist: Playlist
}
type Out = Promise<IndexResponse>

export const indexPlaylist = async (arg: In): Out => {
  return await client.index({
    index: "playlist",
    id: `${arg.playlist.id}`,
    body: {
      name: playlist.name,
      tracks: arg.playlist.items.map((item) => {
        item
      }),
    },
  })
}
