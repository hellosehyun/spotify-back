import { User } from "@/entity/user/user"
import { BannerImg, Country, Email, Name, Role } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { user } from "@/infra/drizzle/schema"
import { Cnt, Eid, Id, Img, Timestamp } from "@/shared/vo"

type In = {
  name: Name
  eid: Eid
  email: Email
  country: Country
}
type Out = Promise<
  User<{
    id: Id
    email: Email
    country: Country
    name: Name
    eid: Eid
    img: Img
    bannerImg: BannerImg
    role: Role
    followerCnt: Cnt
    createdAt: Timestamp
  }>
>

export const createUser = async (arg: In, tx = db): Out => {
  const q = tx
    .insert(user)
    .values({
      email: arg.email,
      country: arg.country,
      name: arg.name,
      eid: arg.eid,
      img: {},
      bannerImg: {},
      role: "general",
      followerCnt: 0,
    })
    .returning()

  const [row] = await q.execute()

  const entity = User({
    id: Id(row.id),
    email: Email(row.email),
    country: Country(row.country),
    name: Name(row.name),
    eid: Eid(row.eid),
    img: Img(row.img),
    bannerImg: BannerImg(row.bannerImg),
    role: Role(row.role),
    followerCnt: Cnt(row.followerCnt),
    createdAt: Timestamp(row.createdAt),
  })

  return entity
}
