import { User } from "@/entity/user/user"
import { BannerImg, Country, Email, Name, Role } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { user } from "@/infra/drizzle/schema"
import { Cnt, Eid, Id, Img, Timestamp } from "@/shared/vo"
import { and, eq, SQL } from "drizzle-orm"

type In = {
  eid?: Eid
  id?: Id
}

type Out = Promise<User | undefined>

export const findUser = async (params: In): Out => {
  const query = db.select().from(user)

  let conditions: SQL[] = []
  if (params.eid) conditions.push(eq(user.eid, params.eid))
  if (params.id) conditions.push(eq(user.id, params.id))
  query.where(and(...conditions))

  const data = (await query)[0]

  // nothing
  if (!data) return undefined

  const entity = User.create({
    id: Id.create(data.id),
    role: Role.create(data.role),
    bannerImgs: data.bannerImgs!.map((bannerImg: any) => BannerImg.create(bannerImg)),
    followerCnt: Cnt.create(data.followerCnt),
    createdAt: Timestamp.create(data.createdAt),
    name: Name.create(data.name),
    email: Email.create(data.email),
    imgs: data.imgs!.map((img: any) => Img.create(img)),
    eid: Eid.create(data.eid),
    country: Country.create(data.country),
  })

  return entity
}
