import { Cnt, Eid, Id, Img, Timestamp } from "@/shared/vo"
import { BannerImg, Role, Name, Email, Country } from "./vo"

export type User<T = {}> = T & {
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
}

export const User = <T>(val: Partial<User<T>>): User<T> => {
  return val as User<T>
}
