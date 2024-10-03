import { Cnt, Eid, Id, Img, Timestamp } from "@/shared/vo"
import { BannerImg, Role, Name, Email, Country } from "./vo"

export type User = {
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

export const User = (val: User): User => {
  return val as User
}
