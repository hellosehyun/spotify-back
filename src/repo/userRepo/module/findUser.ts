import { User } from "@/entity/user/user"
import {
  BannerImg,
  Country,
  Email,
  FollowerCnt,
  Img,
  Name,
  ProfileEid,
  ProfileEuri,
  Role,
} from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { user } from "@/infra/drizzle/schema"
import { Id, Timestamp } from "@/shared/vo"
import { and, eq, SQL } from "drizzle-orm"

type In = {
  profileEid?: ProfileEid
  userId?: Id
}

type Out = Promise<User | undefined>

export const findUser = async (params: In): Out => {
  const query = db.select().from(user)

  let conditions: SQL[] = []
  if (params.profileEid) conditions.push(eq(user.profileEid, params.profileEid))
  if (params.userId) conditions.push(eq(user.id, params.userId))
  query.where(and(...conditions))

  const data = (await query)[0]

  // nothing
  if (!data) return undefined

  const entity = User.create({
    id: Id.create(data.id),
    role: Role.create(data.role),
    bannerImgs: data.bannerImgs!.map((bannerImg: any) => BannerImg.create(bannerImg)),
    followerCnt: FollowerCnt.create(data.followerCnt),
    createdAt: Timestamp.create(data.createdAt),
    name: Name.create(data.name),
    email: Email.create(data.email),
    imgs: data.imgs!.map((img: any) => Img.create(img)),
    profileEid: ProfileEid.create(data.profileEid),
    profileEuri: ProfileEuri.create(data.profileEuri),
    country: Country.create(data.country),
  })

  return entity
}
