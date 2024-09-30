import { User } from "@/entity/user/user"
import {
  BannerImg,
  Country,
  Email,
  FollowerCnt,
  Img,
  Name,
  ProfileEuri,
  Role,
} from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { user } from "@/infra/drizzle/schema"
import { Eid, Id, Timestamp } from "@/shared/vo"

type In = {
  profileEid: Eid
  profileEuri: ProfileEuri
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
      profileEid: params.profileEid,
      profileEuri: params.profileEuri,
    })
    .returning()

  const data = (await query)[0]

  const entity = User.create({
    id: Id.create(data.id),
    role: Role.create(data.role),
    bannerImgs: data.bannerImgs!.map((bannerImg: any) => BannerImg.create(bannerImg)),
    followerCnt: FollowerCnt.create(data.followerCnt),
    createdAt: Timestamp.create(data.createdAt),
    name: params.name,
    email: params.email,
    imgs: params.imgs,
    profileEid: params.profileEid,
    profileEuri: params.profileEuri,
    country: params.country,
  })

  return entity
}
