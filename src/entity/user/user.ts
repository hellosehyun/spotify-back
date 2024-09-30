import { Cnt, Eid, Id, Img, Timestamp } from "@/shared/vo"
import { BannerImg, Role, Name, Email, Country } from "./vo"

export type User<T = {}> = T & {
  id: Id
  name: Name
  email: Email
  country: Country
  imgs: Img[]
  bannerImgs: BannerImg[]
  eid: Eid
  role: Role
  followerCnt: Cnt
  createdAt: Timestamp
}

export const User = {
  create<T>(val: Partial<User<T>>): User<T> {
    return val as User<T>
  },
}
