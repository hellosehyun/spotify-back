import { findPlaylists } from "./module/findPlaylists"
import { findPlaylist } from "./module/findPlaylist"
import { savePlaylist } from "./module/savePlaylist"
import { updatePlaylist } from "./module/updatePlaylist"
import { findPlaylistOverview } from "./module/findPlaylistOverview"

export type PlaylistRepo = {
  findPlaylistOverview(
    arg: Parameters<typeof findPlaylistOverview>[0],
    tx?: Parameters<typeof findPlaylistOverview>[1]
  ): ReturnType<typeof findPlaylistOverview>

  findPlaylists(
    arg: Parameters<typeof findPlaylists>[0],
    tx?: Parameters<typeof findPlaylists>[1]
  ): ReturnType<typeof findPlaylists>

  savePlaylist(
    arg: Parameters<typeof savePlaylist>[0],
    tx?: Parameters<typeof savePlaylist>[1]
  ): ReturnType<typeof savePlaylist>

  updatePlaylist(
    arg: Parameters<typeof updatePlaylist>[0],
    tx?: Parameters<typeof updatePlaylist>[1]
  ): ReturnType<typeof updatePlaylist>

  findPlaylist(
    arg: Parameters<typeof findPlaylist>[0],
    tx?: Parameters<typeof findPlaylist>[1]
  ): ReturnType<typeof findPlaylist>
}

export const playlistRepo: PlaylistRepo = {
  findPlaylistOverview,
  findPlaylist,
  findPlaylists,
  savePlaylist,
  updatePlaylist,
}
