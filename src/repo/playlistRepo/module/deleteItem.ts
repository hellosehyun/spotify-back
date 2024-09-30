import { Type } from "@/entity/playlist/vo"
import { db } from "@/infra/drizzle/db"
import { item, playlist } from "@/infra/drizzle/schema"
import { Eid, Id } from "@/shared/vo"
import { and, eq, isNull, SQL, sql, inArray } from "drizzle-orm"

type In = {
  userId?: Id
  playlistId?: Id
  eids?: Eid[]
  type: Type
}

type Out = Promise<void>

export const deleteItem = async (params: In, tx = db): Out => {
  const query = tx
    .update(item)
    .set({
      deletedAt: sql`NOW()`,
    })
    .returning()

  const conditions: SQL[] = [isNull(item.deletedAt)]

  if (params.type === "general") {
    conditions.push(eq(item.playlistId, params.playlistId!))
  } else if (params.type === "like") {
    const sq = tx
      .select({ id: playlist.id })
      .from(playlist)
      .where(eq(playlist.creatorId, params.userId!))

    conditions.push(sql`${item.playlistId} IN ${sq}`)
  }

  if (params.eids !== undefined && params.eids.length > 0) {
    conditions.push(inArray(item.eid, params.eids))
  }

  query.where(and(...conditions))

  await query

  return
}
