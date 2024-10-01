import { db } from "@/infra/drizzle/db"
import { item, playlist } from "@/infra/drizzle/schema"
import { Id } from "@/shared/vo"
import { and, isNull, sql, or, between, eq } from "drizzle-orm"

type In = {
  playlistId: Id
  begin: number
  length: number
  pos: number
}
type Out = Promise<{}>

export const reorderItems = async (params: In, tx = db): Out => {
  const { begin, pos, length } = params

  const q = tx
    .update(item)
    .set({
      order: sql`CASE
        WHEN "order" >= ${begin} AND "order" < ${begin + length} THEN ${pos} + "order" - ${begin}
        WHEN "order" >= ${pos} AND "order" < ${pos + length} THEN ${begin} + "order" - ${pos}
        ELSE "order"
      END`,
    })
    .where(
      and(
        isNull(item.deletedAt),
        eq(playlist.id, params.playlistId),
        or(
          between(item.order, begin, begin + length - 1),
          between(item.order, pos, pos + length - 1)
        )
      )
    )
    .returning()

  const [row] = await q.execute()

  return {}
}
