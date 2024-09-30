import { createPlaylist } from "./module/createPlaylist"

export type PlaylistRepo = {
  createPlaylist(
    params: Parameters<typeof createPlaylist>[0] //
  ): ReturnType<typeof createPlaylist>
}

export const playlistRepo = {
  createPlaylist,
}
