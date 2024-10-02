import { User } from "@/entity/user/user"
import { Country, Name } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { user } from "@/infra/drizzle/schema"
import { Cnt, Id, Img, Timestamp } from "@/shared/vo"
import { and, inArray, isNull } from "drizzle-orm"

type In = {
  userIds: Id[]
}
type Out = Promise<
  | User<{
      id: Id
      name: Name
      country: Country
      img: Img
      followerCnt: Cnt
      createdAt: Timestamp
    }>[]
  | undefined
>

export const findUsers = async (arg: In, tx = db): Out => {
  const q = tx
    .select()
    .from(user)
    .where(
      and(
        isNull(user.deletedAt), //
        inArray(user.id, arg.userIds)
      )
    )

  const rows = await q.execute()

  if (rows.length === 0) return undefined

  const entities = rows.map((row) =>
    User({
      id: Id(row.id),
      name: Name(row.name),
      country: Country(row.country),
      img: Img(row.img),
      followerCnt: Cnt(row.followerCnt),
      createdAt: Timestamp(row.createdAt),
    })
  )

  return entities
}
