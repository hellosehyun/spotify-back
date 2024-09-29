import { Id, Timestamp } from "@/shared/vo"
import {
  BannerImg,
  FollowerCnt,
  Img,
  Role,
  ProfileEid,
  Name,
  Email,
  ProfileEuri,
  Country,
} from "./vo"

export type User = {
  id: Id
  name: Name
  email: Email
  country: Country
  imgs: Img[]
  bannerImgs: BannerImg[]
  profileEid: ProfileEid
  profileEuri: ProfileEuri
  role: Role
  followerCnt: FollowerCnt
  createdAt: Timestamp
}

export const User = {
  create(val: User) {
    return val as User
  },
}
