import { findPlaylists } from "./module/findPlaylists"
import { findPlaylist } from "./module/findPlaylist"
import { saveItems } from "./module/saveItems"
import { savePlaylist } from "./module/savePlaylist"
import { updateItemsIdx } from "./module/updateItemsIdx"
import { updatePlaylistItemCnt } from "./module/updatePlaylistItemCnt"

export type PlaylistRepo = {
  findPlaylist(
    arg: Parameters<typeof findPlaylist>[0],
    tx?: Parameters<typeof findPlaylist>[1]
  ): ReturnType<typeof findPlaylist>

  findPlaylists(
    arg: Parameters<typeof findPlaylists>[0],
    tx?: Parameters<typeof findPlaylists>[1]
  ): ReturnType<typeof findPlaylists>

  savePlaylist(
    arg: Parameters<typeof savePlaylist>[0],
    tx?: Parameters<typeof savePlaylist>[1]
  ): ReturnType<typeof savePlaylist>

  saveItems(
    arg: Parameters<typeof saveItems>[0],
    tx?: Parameters<typeof saveItems>[1]
  ): ReturnType<typeof saveItems>

  updateItemsIdx(
    arg: Parameters<typeof updateItemsIdx>[0],
    tx?: Parameters<typeof updateItemsIdx>[1]
  ): ReturnType<typeof updateItemsIdx>

  updatePlaylistItemCnt(
    arg: Parameters<typeof updatePlaylistItemCnt>[0],
    tx?: Parameters<typeof updatePlaylistItemCnt>[1]
  ): ReturnType<typeof updatePlaylistItemCnt>
}

export const playlistRepo: PlaylistRepo = {
  findPlaylist,
  findPlaylists,
  savePlaylist,
  saveItems,
  updateItemsIdx,
  updatePlaylistItemCnt,
}
