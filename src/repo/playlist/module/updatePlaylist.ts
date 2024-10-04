import { Detail, Name } from "@/entity/playlist/vo"
import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id, Img, Track } from "@/shared/vo"
import { and, eq, isNull } from "drizzle-orm"

type In = {
  playlistId: Id
  img?: Img
  name?: Name
  detail?: Detail
  tracks?: Track[]
}
type Out = Promise<void>

export const updatePlaylist = async (arg: In, tx = db): Out => {
  const set: Partial<typeof playlist.$inferInsert> = {}
  if (arg.img !== undefined) set.img = arg.img
  if (arg.name !== undefined) set.name = arg.name
  if (arg.detail !== undefined) set.detail = arg.detail
  if (arg.tracks !== undefined) set.tracks = arg.tracks

  const q = tx
    .update(playlist)
    .set(set)
    .where(
      and(
        eq(playlist.id, arg.playlistId), //
        isNull(playlist.deletedAt)
      )
    )

  await q.execute()

  return
}
