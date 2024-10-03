import { Playlist } from "@/entity/playlist/playlist"
import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"

type In = {
  playlist: Playlist
}
type Out = Promise<void>

export const savePlaylist = async (arg: In, tx = db): Out => {
  const q = tx
    .insert(playlist) //
    .values(arg.playlist)

  await q.execute()

  return
}
