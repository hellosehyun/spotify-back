import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id } from "@/shared/vo"
import { and, eq, isNull } from "drizzle-orm"

type In = {
  playlistId: Id
}
type Out = Promise<{}>

export const getPlaylist = async (params: In, tx = db): Out => {
  const q = tx
    .select()
    .from(playlist)
    .where(
      and(
        isNull(playlist.deletedAt), //
        eq(playlist.id, params.playlistId)
      )
    )

  const [row] = await q.execute()

  return {}
}
