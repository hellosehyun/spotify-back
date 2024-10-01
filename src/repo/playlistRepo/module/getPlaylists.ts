import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id } from "@/shared/vo"
import { and, eq, inArray, isNull } from "drizzle-orm"

type In = {
  userId?: Id
  playlistIds?: Id[]
}
type Out = Promise<{}>

export const getPlaylists = async (params: In, tx = db): Out => {
  const q = tx.select().from(playlist)

  const cond = [isNull(playlist.deletedAt)]
  if (params.userId !== undefined) {
    cond.push(eq(playlist.creatorId, params.userId))
  }
  if (params.playlistIds !== undefined && params.playlistIds.length > 0) {
    cond.push(inArray(playlist.creatorId, params.playlistIds))
  }
  q.where(and(...cond))

  const rows = await q.execute()

  return {}
}
