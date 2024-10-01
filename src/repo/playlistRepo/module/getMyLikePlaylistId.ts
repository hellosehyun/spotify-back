import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id } from "@/shared/vo"
import { and, eq, isNull } from "drizzle-orm"

type In = {
  userId: Id
}
type Out = Promise<{}>

export const getMyLikePlaylistId = async (params: In, tx = db): Out => {
  const q = tx
    .select({
      creatorId: playlist.creatorId,
    })
    .from(playlist)
    .where(
      and(
        isNull(playlist.deletedAt), //
        eq(playlist.creatorId, params.userId),
        eq(playlist.type, "like")
      )
    )

  const [row] = await q.execute()

  return {}
}
