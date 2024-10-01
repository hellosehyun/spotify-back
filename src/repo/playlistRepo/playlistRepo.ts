import { createItems } from "./module/createItems"
import { createPlaylist } from "./module/createPlaylist"
import { deleteItems } from "./module/deleteItems"
import { deletePlaylists } from "./module/deletePlaylists"
import { getCreatorId } from "./module/getCreatorId"
import { getMyLikePlaylistId } from "./module/getMyLikePlaylistId"
import { getPlaylist } from "./module/getPlaylist"
import { getPlaylists } from "./module/getPlaylists"
import { reorderItems } from "./module/reorderItems"
import { updatePlaylist } from "./module/updatePlaylist"

export type PlaylistRepo = {
  createItems(
    params: Parameters<typeof createItems>[0],
    tx?: Parameters<typeof createItems>[1]
  ): ReturnType<typeof createItems>

  createPlaylist(
    params: Parameters<typeof createPlaylist>[0],
    tx?: Parameters<typeof createPlaylist>[1]
  ): ReturnType<typeof createPlaylist>

  deleteItems(
    params: Parameters<typeof deleteItems>[0],
    tx?: Parameters<typeof deleteItems>[1]
  ): ReturnType<typeof deleteItems>

  deletePlaylists(
    params: Parameters<typeof deletePlaylists>[0],
    tx?: Parameters<typeof deletePlaylists>[1]
  ): ReturnType<typeof deletePlaylists>

  getCreatorId(
    params: Parameters<typeof getCreatorId>[0],
    tx?: Parameters<typeof getCreatorId>[1]
  ): ReturnType<typeof getCreatorId>

  getMyLikePlaylistId(
    params: Parameters<typeof getMyLikePlaylistId>[0],
    tx?: Parameters<typeof getMyLikePlaylistId>[1]
  ): ReturnType<typeof getMyLikePlaylistId>

  getPlaylist(
    params: Parameters<typeof getPlaylist>[0],
    tx?: Parameters<typeof getPlaylist>[1]
  ): ReturnType<typeof getPlaylist>

  getPlaylists(
    params: Parameters<typeof getPlaylists>[0],
    tx?: Parameters<typeof getPlaylists>[1]
  ): ReturnType<typeof getPlaylists>

  reorderItems(
    params: Parameters<typeof reorderItems>[0],
    tx?: Parameters<typeof reorderItems>[1]
  ): ReturnType<typeof reorderItems>

  updatePlaylist(
    params: Parameters<typeof updatePlaylist>[0],
    tx?: Parameters<typeof updatePlaylist>[1]
  ): ReturnType<typeof updatePlaylist>
}

export const playlistRepo: PlaylistRepo = {
  createItems,
  createPlaylist,
  deleteItems,
  deletePlaylists,
  getCreatorId,
  getMyLikePlaylistId,
  getPlaylist,
  getPlaylists,
  reorderItems,
  updatePlaylist,
}
