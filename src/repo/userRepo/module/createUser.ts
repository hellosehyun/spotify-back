import { User } from "@/entity/user/user"
import { BannerImg, Country, Email, Name, Role } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { user } from "@/infra/drizzle/schema"
import { Cnt, Eid, Id, Img, Timestamp } from "@/shared/vo"

type In = {
  eid: Eid
  country: Country
  name: Name
  email: Email
  imgs: Img[]
}

type Out = Promise<User>

export const createUser = async (params: In): Out => {
  const query = db
    .insert(user)
    .values({
      name: params.name,
      email: params.email,
      imgs: params.imgs,
      bannerImgs: [],
      role: "user",
      followerCnt: 0,
      country: params.country,
      eid: params.eid,
    })
    .returning()

  const data = (await query)[0]

  const entity = User.create({
    id: Id.create(data.id),
    role: Role.create(data.role),
    bannerImgs: data.bannerImgs!.map((bannerImg: any) => BannerImg.create(bannerImg)),
    followerCnt: Cnt.create(data.followerCnt),
    createdAt: Timestamp.create(data.createdAt),
    name: params.name,
    email: params.email,
    imgs: params.imgs,
    eid: params.eid,
    country: params.country,
  })

  return entity
}
