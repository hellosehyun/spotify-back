import { createItems } from "./module/createItems"
import { createPlaylist } from "./module/createPlaylist"
import { deleteItems } from "./module/deleteItems"
import { deletePlaylist } from "./module/deletePlaylist"
import { findItems } from "./module/findItems"
import { findPlaylist } from "./module/findPlaylist"
import { findPlaylists } from "./module/findPlaylists"
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

  createPlaylist(
    arg: Parameters<typeof createPlaylist>[0],
    tx?: Parameters<typeof createPlaylist>[1]
  ): ReturnType<typeof createPlaylist>

  createItems(
    arg: Parameters<typeof createItems>[0],
    tx?: Parameters<typeof createItems>[1]
  ): ReturnType<typeof createItems>

  deleteItems(
    arg: Parameters<typeof deleteItems>[0],
    tx?: Parameters<typeof deleteItems>[1]
  ): ReturnType<typeof deleteItems>

  updateItemsIdx(
    arg: Parameters<typeof updateItemsIdx>[0],
    tx?: Parameters<typeof updateItemsIdx>[1]
  ): ReturnType<typeof updateItemsIdx>

  updatePlaylistItemCnt(
    arg: Parameters<typeof updatePlaylistItemCnt>[0],
    tx?: Parameters<typeof updatePlaylistItemCnt>[1]
  ): ReturnType<typeof updatePlaylistItemCnt>

  deletePlaylist(
    arg: Parameters<typeof deletePlaylist>[0],
    tx?: Parameters<typeof deletePlaylist>[1]
  ): ReturnType<typeof deletePlaylist>

  findItems(
    arg: Parameters<typeof findItems>[0],
    tx?: Parameters<typeof findItems>[1]
  ): ReturnType<typeof findItems>
}

export const playlistRepo: PlaylistRepo = {
  findPlaylist,
  findPlaylists,
  createItems,
  createPlaylist,
  deleteItems,
  updateItemsIdx,
  updatePlaylistItemCnt,
  deletePlaylist,
  findItems,
}
