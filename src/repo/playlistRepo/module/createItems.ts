import { Track } from "@/entity/item/vo"
import { db } from "@/infra/drizzle/db"
import { item } from "@/infra/drizzle/schema"
import { Eid, Id } from "@/shared/vo"
import { and, eq, isNull, sql } from "drizzle-orm"

type In = {
  userId: Id
  playlistId: Id
  items: {
    eid: Eid
    track: Track
  }[]
}
type Out = Promise<{}>

export const createItems = async (params: In, tx = db): Out => {
  const sq = tx
    .select({ max: sql`COALESCE(MAX(${item.order}), -1)` })
    .from(item)
    .where(and(eq(item.playlistId, params.playlistId), isNull(item.deletedAt)))

  const q = tx
    .insert(item)
    .values(
      params.items.map(({ eid, track }, index) => ({
        playlistId: params.playlistId,
        order: sql`(${sq}) + ${index + 1}`,
        eid: eid,
        track: track,
      }))
    )
    .returning()

  const rows = await q.execute()

  return {}
}
