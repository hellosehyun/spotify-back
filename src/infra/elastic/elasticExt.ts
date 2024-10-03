import { getPlaylistExistence } from "./module/getPlaylistExistence"
import { mapPlaylist } from "./module/mapPlaylist"

export type ElasticExt = {
  getPlaylistExistence(): ReturnType<typeof getPlaylistExistence>

  mapPlaylist(): ReturnType<typeof mapPlaylist>
}

export const elasticExt: ElasticExt = {
  getPlaylistExistence,
  mapPlaylist,
}
