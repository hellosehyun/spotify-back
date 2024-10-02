import { User } from "@/entity/user/user"
import { BannerImg, Country, Email, Name, Role } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { user } from "@/infra/drizzle/schema"
import { Cnt, Eid, Id, Img, Timestamp } from "@/shared/vo"
import { and, eq, isNull } from "drizzle-orm"

type In = {
  eid?: Eid
  userId?: Id
}
type Out = Promise<
  | User<{
      id: Id
      name: Name
      email: Email
      country: Country
      img: Img
      bannerImg: BannerImg
      eid: Eid
      role: Role
      followerCnt: Cnt
      createdAt: Timestamp
    }>
  | undefined
>

export const findUser = async (arg: In, tx = db): Out => {
  const q = tx.select().from(user)

  const cond = [isNull(user.deletedAt)]
  if (arg.eid !== undefined) cond.push(eq(user.eid, arg.eid))
  if (arg.userId !== undefined) cond.push(eq(user.id, arg.userId))

  q.where(and(...cond))

  const [row] = await q.execute()

  if (!row) return undefined

  const entity = User({
    id: Id(row.id),
    name: Name(row.name),
    email: Email(row.email),
    country: Country(row.country),
    img: Img(row.img),
    bannerImg: BannerImg(row.bannerImg),
    eid: Eid(row.eid),
    role: Role(row.role),
    followerCnt: Cnt(row.followerCnt),
    createdAt: Timestamp(row.createdAt),
  })

  return entity
}
