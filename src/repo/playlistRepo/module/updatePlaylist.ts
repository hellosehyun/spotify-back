import { Title } from "@/entity/playlist/vo"
import { db } from "@/infra/drizzle/db"
import { item, playlist } from "@/infra/drizzle/schema"
import { Id, Img } from "@/shared/vo"
import { and, eq, isNull } from "drizzle-orm"

type In = {
  title?: Title
  imgs?: Img[]
  id: Id
}

type Out = Promise<void>

export const updatePlaylist = async (params: In, tx = db): Out => {
  const playlistColumn: Partial<typeof playlist.$inferInsert> = {}
  const itemColumn: Partial<typeof item.$inferInsert> = {}

  // playlist
  if (params.imgs !== undefined) playlistColumn.imgs = params.imgs
  if (params.title !== undefined) playlistColumn.title = params.title

  if (Object.keys(playlistColumn).length > 0) {
    await tx
      .update(playlist)
      .set(playlistColumn)
      .where(
        and(
          eq(playlist.id, params.id), //
          isNull(playlist.deletedAt)
        )
      )
  }

  return
}
