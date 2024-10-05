import { findFullPlaylists } from "./module/findFullPlaylists"
import { findPlaylist } from "./module/findPlaylist"
import { savePlaylist } from "./module/savePlaylist"
import { updatePlaylist } from "./module/updatePlaylist"
import { findFullPlaylist } from "./module/findFullPlaylist"
import { deletePlaylist } from "./module/deletePlaylist"

export type PlaylistRepo = {
  findFullPlaylist(
    arg: Parameters<typeof findFullPlaylist>[0],
    tx?: Parameters<typeof findFullPlaylist>[1]
  ): ReturnType<typeof findFullPlaylist>

  findFullPlaylists(
    arg: Parameters<typeof findFullPlaylists>[0],
    tx?: Parameters<typeof findFullPlaylists>[1]
  ): ReturnType<typeof findFullPlaylists>

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

  deletePlaylist(
    arg: Parameters<typeof deletePlaylist>[0],
    tx?: Parameters<typeof deletePlaylist>[1]
  ): ReturnType<typeof deletePlaylist>
}

export const playlistRepo: PlaylistRepo = {
  findFullPlaylist,
  findPlaylist,
  findFullPlaylists,
  savePlaylist,
  updatePlaylist,
  deletePlaylist,
}
