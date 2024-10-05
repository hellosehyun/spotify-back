import { Detail, Name } from "@/entity/playlist/vo"
import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id, Img, Track } from "@/shared/vo"
import { and, eq, isNull, sql } from "drizzle-orm"

type In = {
  playlistId: Id
}
type Out = Promise<void>

export const deletePlaylist = async (arg: In, tx = db): Out => {
  const q = tx
    .update(playlist)
    .set({ deletedAt: sql`now()` })
    .where(
      and(
        eq(playlist.id, arg.playlistId), //
        isNull(playlist.deletedAt)
      )
    )

  await q.execute()

  return
}
