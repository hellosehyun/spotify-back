import { db } from "@/infra/drizzle/db"
import { item } from "@/infra/drizzle/schema"
import { Id } from "@/shared/vo"
import { and, isNull, sql, or, between, eq, inArray } from "drizzle-orm"

type In = {
  reorder?: {
    playlistId: Id
    begin: number
    length: number
    pos: number
  }
  normalize?: {
    playlistId: Id
  }
}
type Out = Promise<void>

export const updateItemsIdx = async (arg: In, tx = db): Out => {
  if (arg.reorder !== undefined) {
    const { begin, pos, length, playlistId } = arg.reorder

    const q = tx
      .update(item)
      .set({
        idx: sql`
          CASE
            WHEN "idx" >= ${begin} AND "idx" < ${begin + length} THEN ${pos} + "idx" - ${begin}
            WHEN "idx" >= ${pos} AND "idx" < ${pos + length} THEN ${begin} + "idx" - ${pos}
            ELSE "idx"
          END`,
      })
      .where(
        and(
          isNull(item.deletedAt),
          eq(item.playlistId, playlistId),
          or(between(item.idx, begin, begin + length - 1), between(item.idx, pos, pos + length - 1))
        )
      )
      .returning()

    await q.execute()
  } else if (arg.normalize !== undefined) {
    const { playlistId } = arg.normalize

    const w = tx.$with("w").as(
      tx
        .select({
          id: item.id,
          newIdx: sql`row_number() over (order by ${item.idx}) - 1`.as("new_idx"),
        })
        .from(item)
        .where(
          and(
            eq(item.playlistId, playlistId), //
            isNull(item.deletedAt)
          )
        )
    )

    const q = tx
      .with(w)
      .update(item)
      .set({
        idx: sql`(select new_idx from ${w} where ${item.id} = ${w}.id)`,
      })
      .where(inArray(item.id, tx.select({ id: w.id }).from(w)))

    await q.execute()
  }

  return
}
