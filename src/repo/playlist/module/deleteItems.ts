import { db } from "@/infra/drizzle/db"
import { item } from "@/infra/drizzle/schema"
import { Eid, Id } from "@/shared/vo"
import { and, eq, inArray, isNull, sql } from "drizzle-orm"

type In = {
  playlistId: Id
  eids: Eid[]
}
type Out = Promise<void>

export const deleteItems = async (arg: In, tx = db): Out => {
  const q = tx
    .update(item)
    .set({
      deletedAt: sql`now()`,
    })
    .where(
      and(
        isNull(item.deletedAt),
        eq(item.playlistId, arg.playlistId), //
        inArray(item.eid, arg.eids)
      )
    )

  await q.execute()

  return
}
