import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id, Imgs } from "@/shared/vo"
import { and, isNull, eq } from "drizzle-orm"

type In = {
  playlistId: Id
  imgs?: Imgs
}
type Out = Promise<{}>

export const updatePlaylist = async (params: In, tx = db): Out => {
  const set: Partial<typeof playlist.$inferInsert> = {}

  const q = tx
    .update(playlist)
    .set(set)
    .where(
      and(
        isNull(playlist.deletedAt), //
        eq(playlist.id, params.playlistId)
      )
    )
    .returning()

  if (params.imgs !== undefined) {
    set.imgs = params.imgs
  }

  const [row] = await q.execute()

  return {}
}
