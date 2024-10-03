import { Item } from "@/entity/item/item"
import { Idx } from "@/entity/item/vo"
import { db } from "@/infra/drizzle/db"
import { item, playlist } from "@/infra/drizzle/schema"
import { Id, Offset, Timestamp, Track } from "@/shared/vo"
import { and, eq, isNull } from "drizzle-orm"

type In = {
  clientId: Id
  playlistId: Id
  offset: Offset
}
type Out = Promise<
  | Item<{
      idx: Idx
      track: Track
      createdAt: Timestamp
    }>[]
  | undefined
>

export const findItems = async (arg: In, tx = db): Out => {
  const limit = 50

  const q = tx
    .select({
      idx: item.idx,
      track: item.track,
      createdAt: item.createdAt,
    })
    .from(item)
    .where(
      and(
        isNull(item.deletedAt), //
        eq(playlist.id, arg.playlistId)
      )
    )
    .limit(limit)
    .offset(arg.offset)

  const rows = await q.execute()

  if (rows.length === 0) return undefined

  const entities = rows.map((row) =>
    Item({
      idx: Idx(row.idx),
      track: Track(row.track),
      createdAt: Timestamp(row.createdAt),
    })
  )

  return entities
}
