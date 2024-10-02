import { Playlist } from "@/entity/playlist/playlist"
import { Detail, IsPublic, Name, Type } from "@/entity/playlist/vo"
import { db } from "@/infra/drizzle/db"
import { playlist, user } from "@/infra/drizzle/schema"
import { Cnt, Id, Img, Timestamp } from "@/shared/vo"
import { eq } from "drizzle-orm"

type In = {
  name: Name
  type: Type
  creatorId: Id
}
type Out = Promise<
  Playlist<{
    id: Id
    name: Name
    img: Img
    coverImgs: Img[]
    detail: Detail
    type: Type
    isPublic: IsPublic
    itemCnt: Cnt
    createdAt: Timestamp
  }>
>

export const createPlaylist = async (arg: In, tx = db): Out => {
  const q = tx
    .insert(playlist)
    .values({
      creatorId: arg.creatorId,
      name: arg.name,
      img: {},
      coverImgs: [],
      detail: "",
      type: arg.type,
      isPublic: true,
      itemCnt: 0,
    })
    .returning()

  const [row] = await q.execute()

  const entity = Playlist({
    id: Id(row.id),
    name: Name(row.name),
    img: Img(row.img),
    coverImgs: row.coverImgs.map((img) => Img(img)),
    detail: Detail(row.detail),
    type: Type(row.type),
    isPublic: IsPublic(row.isPublic),
    itemCnt: Cnt(row.itemCnt),
    createdAt: Timestamp(row.createdAt),
  })

  return entity
}
