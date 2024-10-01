import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id } from "@/shared/vo"
import { and, inArray, isNull, sql } from "drizzle-orm"

type In = {
  playlistIds?: Id[]
}
type Out = Promise<{}>

export const deletePlaylists = async (params: In, tx = db): Out => {
  const q = tx
    .update(playlist)
    .set({
      deletedAt: sql`NOW()`,
    })
    .returning()

  const cond = [isNull(playlist.deletedAt)]
  if (params.playlistIds !== undefined && params.playlistIds.length > 0) {
    cond.push(inArray(playlist.id, params.playlistIds))
  }
  q.where(and(...cond))

  const rows = await q.execute()

  return {}
}
