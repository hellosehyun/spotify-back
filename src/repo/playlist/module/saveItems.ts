import { Item } from "@/entity/item/item"
import { db } from "@/infra/drizzle/db"
import { item } from "@/infra/drizzle/schema"
import { eq, sql } from "drizzle-orm"

type In = {
  items: Item[]
}
type Out = Promise<void>

export const saveItems = async (arg: In, tx = db): Out => {
  const sq = tx
    .select({ maxIdx: sql`coalesce(max(${item.idx}), -1)` })
    .from(item)
    .where(eq(item.playlistId, arg.items[0].playlistId))

  const q = tx
    .insert(item) //
    .values(
      arg.items.map((item, i) => ({
        ...item,
        idx: sql`${sq} + ${i + 1}`,
      }))
    )

  await q.execute()

  return
}
