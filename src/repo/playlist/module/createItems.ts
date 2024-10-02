import { Item } from "@/entity/item/item"
import { Idx } from "@/entity/item/vo"
import { db } from "@/infra/drizzle/db"
import { item, playlist } from "@/infra/drizzle/schema"
import { Id, Timestamp, Track } from "@/shared/vo"
import { eq, sql } from "drizzle-orm"

type In = {
  playlistId: Id
  tracks: Track[]
}
type Out = Promise<
  Item<{
    id: Id
    playlistId: Id
    idx: Idx
    track: Track
    createdAt: Timestamp
  }>[]
>

export const createItems = async (arg: In, tx = db): Out => {
  const sq = tx
    .select({ itemCnt: playlist.itemCnt })
    .from(playlist)
    .where(eq(playlist.id, arg.playlistId))

  const q = tx
    .insert(item)
    .values(
      arg.tracks.reverse().map((track, i) => ({
        playlistId: arg.playlistId,
        idx: sql`${sq} + ${i}`,
        eid: track.eid,
        track: track,
      }))
    )
    .returning()

  const rows = await q.execute()

  const entities = rows.map((row) =>
    Item({
      id: Id(row.id),
      playlistId: Id(row.playlistId),
      idx: Idx(row.idx),
      track: Track(row.track),
      createdAt: Timestamp(row.createdAt),
    })
  )

  return entities
}
