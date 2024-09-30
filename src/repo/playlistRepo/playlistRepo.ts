import { createItem } from "./module/createItem"
import { createPlaylist } from "./module/createPlaylist"
import { deleteItem } from "./module/deleteItem"
import { getCreatorId } from "./module/getCreatorId"
import { getPlaylist } from "./module/getPlaylist"

export type PlaylistRepo = {
  createPlaylist(
    params: Parameters<typeof createPlaylist>[0],
    tx?: Parameters<typeof createPlaylist>[1]
  ): ReturnType<typeof createPlaylist>

  createItem(
    params: Parameters<typeof createItem>[0],
    tx?: Parameters<typeof createItem>[1]
  ): ReturnType<typeof createItem>

  deleteItem(
    params: Parameters<typeof deleteItem>[0],
    tx?: Parameters<typeof deleteItem>[1]
  ): ReturnType<typeof deleteItem>

  getPlaylist(
    params: Parameters<typeof getPlaylist>[0],
    tx?: Parameters<typeof getPlaylist>[1]
  ): ReturnType<typeof getPlaylist>

  getCreatorId(
    params: Parameters<typeof getCreatorId>[0],
    tx?: Parameters<typeof getCreatorId>[1]
  ): ReturnType<typeof getCreatorId>
}

export const playlistRepo: PlaylistRepo = {
  createPlaylist,
  createItem,
  deleteItem,
  getPlaylist,
  getCreatorId,
}
