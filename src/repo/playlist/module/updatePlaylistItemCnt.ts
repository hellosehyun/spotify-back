import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id } from "@/shared/vo"
import { and, eq, isNull, sql } from "drizzle-orm"

type In = {
  calculate?: {
    id: Id
    type: "add" | "sub"
    val: number
  }
}
type Out = Promise<void>

export const updatePlaylistItemCnt = async (arg: In, tx = db): Out => {
  if (arg.calculate !== undefined) {
    const { id, type, val } = arg.calculate

    const q = tx
      .update(playlist)
      .set({
        itemCnt: sql`CASE 
          WHEN ${type} = 'add' THEN ${playlist.itemCnt} + ${val}
          ELSE ${playlist.itemCnt} - ${val}
        END`,
      })
      .where(
        and(
          isNull(playlist.deletedAt), //
          eq(playlist.id, id)
        )
      )

    await q.execute()
  }

  return
}
