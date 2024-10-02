import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id } from "@/shared/vo"
import { and, eq, isNull, sql } from "drizzle-orm"

type In = {
  playlistId: Id
}
type Out = Promise<void>

export const deletePlaylist = async (arg: In, tx = db): Out => {
  const q = tx
    .update(playlist)
    .set({
      deletedAt: sql`now()`,
    })
    .where(
      and(
        isNull(playlist.deletedAt),
        eq(playlist.id, arg.playlistId) //
      )
    )

  await q.execute()

  return
}
