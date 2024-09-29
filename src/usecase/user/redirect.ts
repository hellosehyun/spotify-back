import { Country, Email, Img, Name, ProfileEid, ProfileEuri, Role } from "@/entity/user/vo"
import { SpotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { UserRepo } from "@/repo/userRepo/userRepo"
import { encryptToken } from "@/shared/helper/jwt"
import { BadRequest, InternalError } from "@/shared/static/exception"
import { Id } from "@/shared/vo"
import schema from "zod"

type In = {
  code: any
  state: any
}

type Out = Promise<{
  id: Id
  role: Role
  name: Name
  imgs: Img[]
  country: Country
  token: string
}>

export const redirect = (
  spotifyExt: SpotifyExt, //
  userRepo: UserRepo
) => ({
  execute: async (params: In): Promise<Out> => {
    const dto1 = pre1(params)

    const res1 = await spotifyExt.getToken({
      code: dto1.code,
      state: dto1.state,
    })
    if (!res1.ok) throw new InternalError()

    const spotifyToken = res1.data!

    const res2 = await spotifyExt.getProfile({
      accessToken: spotifyToken.access_token,
    })
    if (!res2.ok) throw new InternalError()

    const dto2 = pre2(res2.data)

    let user = await userRepo.findUser({ profileEid: dto2.profileEid })
    if (!user) user = await userRepo.createUser({ ...dto2 })

    const token = encryptToken({
      id: user.id,
      role: user.role,
      accessToken: spotifyToken.access_token,
      refreshToken: spotifyToken.refresh_token,
      expireAt: Date.now() + spotifyToken.expires_in * 1000,
    })

    console.log(user, "\n")
    console.log(spotifyToken.access_token, "\n")
    console.log(`token=${token}\n`)

    return {
      id: user.id,
      role: user.role,
      name: user.name,
      imgs: user.imgs,
      country: user.country,
      token,
    }
  },
})

const pre1 = (params: In) => {
  return schema
    .object({
      code: schema.string(),
      state: schema.string(),
    })
    .parse(params)
}

const pre2 = (params: any) => {
  try {
    return {
      name: Name.create(params.display_name!),
      profileEuri: ProfileEuri.create(params.uri!),
      country: Country.create(params.country!),
      imgs: params.images!.map((img: any) =>
        Img.create({
          url: img.url!,
          width: img.width!,
          height: img.height!,
        })
      ) as Img[],
      profileEid: ProfileEid.create(params.id!),
      email: Email.create(params.email!),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
