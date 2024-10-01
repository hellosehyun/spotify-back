import { Title, Type } from "@/entity/playlist/vo"
import { db } from "@/infra/drizzle/db"
import { playlist } from "@/infra/drizzle/schema"
import { Id } from "@/shared/vo"

type In = {
  userId: Id
  title: Title
  type: Type
}
type Out = Promise<{}>

export const createPlaylist = async (params: In, tx = db): Out => {
  const q = tx
    .insert(playlist)
    .values({
      creatorId: params.userId,
      title: params.title,
      type: params.type,
      detail: "",
      imgs: [],
      isPublic: true,
    })
    .returning()

  const [row] = await q.execute()

  return {}
}
