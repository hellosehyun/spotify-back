import { Type } from "@/entity/playlist/vo"
import { Country, Email, Name, Role } from "@/entity/user/vo"
import { SpotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { PlaylistRepo } from "@/repo/playlistRepo/playlistRepo"
import { UserRepo } from "@/repo/userRepo/userRepo"
import { encryptToken } from "@/shared/helper/jwt"
import { BadGateway, BadRequest } from "@/shared/static/exception"
import { Eid, Id, Img } from "@/shared/vo"

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
  accessToken: string
  token: string
}>

export const redirect = (
  spotifyExt: SpotifyExt, //
  userRepo: UserRepo,
  playlistRepo: PlaylistRepo
) => ({
  execute: async (params: In): Out => {
    const dto1 = pre1(params)

    const res1 = await spotifyExt.getToken({
      code: dto1.code,
      state: dto1.state,
    })
    if (!res1.ok) throw new BadGateway()

    const spotifyToken = res1.data!

    const res2 = await spotifyExt.getProfile({
      accessToken: spotifyToken.access_token,
    })
    if (!res2.ok) throw new BadGateway()

    const dto2 = pre2(res2.data)

    let user = await userRepo.findUser({ eid: dto2.eid })
    if (!user) {
      user = await userRepo.createUser({ ...dto2 })
      const res3 = await spotifyExt.getLikeTracks({ accessToken: spotifyToken.access_token })
      if (!res3.ok) throw new BadGateway()

      const items = res3.data!

      await playlistRepo.createPlaylist({
        craetorId: user.id,
        type: Type.create("like"),
        items,
      })
    }

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
      accessToken: spotifyToken.access_token,
      token,
    }
  },
})

const pre1 = (params: In) => {
  try {
    return {
      code: params.code!,
      state: params.state!,
    }
  } catch (err) {
    throw new BadRequest()
  }
}

const pre2 = (params: any) => {
  try {
    return {
      name: Name.create(params.display_name!),
      country: Country.create(params.country!),
      imgs: params.images!.map((img: any) =>
        Img.create({
          url: img.url!,
          width: img.width!,
          height: img.height!,
        })
      ) as Img[],
      eid: Eid.create(params.id!),
      email: Email.create(params.email!),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
