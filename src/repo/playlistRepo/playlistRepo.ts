import { createItem } from "./module/createItem"
import { createPlaylist } from "./module/createPlaylist"
import { deleteItem } from "./module/deleteItem"

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
}

export const playlistRepo: PlaylistRepo = {
  createPlaylist,
  createItem,
  deleteItem,
}
