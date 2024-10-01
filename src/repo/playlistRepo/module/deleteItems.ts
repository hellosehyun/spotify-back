import { db } from "@/infra/drizzle/db"
import { item } from "@/infra/drizzle/schema"
import { Eid, Id } from "@/shared/vo"
import { and, inArray, isNull, sql } from "drizzle-orm"

type In = {
  playlistIds?: Id[]
  itemIds?: Id[]
  eids?: Eid[]
}
type Out = Promise<{}>

export const deleteItems = async (params: In, tx = db): Out => {
  const q = tx
    .update(item)
    .set({
      deletedAt: sql`NOW()`,
    })
    .returning()

  const cond = [isNull(item.deletedAt)]
  if (params.itemIds !== undefined && params.itemIds.length > 0) {
    cond.push(inArray(item.id, params.itemIds))
  }
  if (params.playlistIds !== undefined && params.playlistIds.length > 0) {
    cond.push(inArray(item.playlistId, params.playlistIds))
  }
  if (params.eids !== undefined && params.eids.length > 0) {
    cond.push(inArray(item.eid, params.eids))
  }
  q.where(and(...cond))

  const rows = await q.execute()

  return {}
}
