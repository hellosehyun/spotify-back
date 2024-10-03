import { Type } from "@/entity/playlist/vo"
import { Country, Email, Name, Role } from "@/entity/user/vo"
import { db } from "@/infra/drizzle/db"
import { SpotifyApi } from "@/infra/api/spotifyApi/spotifyApi"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { UserRepo } from "@/repo/user/userRepo"
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
  img: Img
  country: Country
  accessToken: string
  token: string
}>

export const redirect = (
  spotifyExt: SpotifyApi, //
  userRepo: UserRepo,
  playlistRepo: PlaylistRepo
) => ({
  execute: async (arg: In): Out => {
    const dto1 = pre1(arg)

    const res1 = await spotifyExt.getToken({ code: dto1.code, state: dto1.state })
    if (!res1.ok) throw new BadGateway()

    const spotifyToken = res1.data!

    const res2 = await spotifyExt.getProfile({ accessToken: spotifyToken.access_token })
    if (!res2.ok) throw new BadGateway()

    const dto2 = pre2(res2.data!)

    let user = await userRepo.findUser({ eid: dto2.eid })
    if (user === undefined) {
      const res3 = await spotifyExt.getMyLikeTracks({ accessToken: spotifyToken.access_token })
      if (!res3.ok) throw new BadGateway()

      const myLiketracks = res3.data!
      const type = Type("like")
      const name = Name("좋아요 표시한 곡")

      user = await db.transaction(async (tx) => {
        const user = await userRepo.createUser(dto2, tx)
        const playlist = await playlistRepo.createPlaylist({ creatorId: user.id, name, type }, tx)
        playlistRepo.createItems({ playlistId: playlist.id, tracks: myLiketracks }, tx)
        playlistRepo.updatePlaylistItemCnt(
          { calculate: { playlistId: playlist.id, type: "add", val: myLiketracks.length } },
          tx
        )
        return user
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
      img: user.img,
      country: user.country,
      accessToken: spotifyToken.access_token,
      token,
    }
  },
})

const pre1 = (arg: In) => {
  try {
    return {
      code: arg.code!,
      state: arg.state!,
    }
  } catch (err) {
    throw new BadRequest()
  }
}

const pre2 = (arg: any) => {
  try {
    return {
      name: Name(arg.display_name!),
      country: Country(arg.country!),
      img: arg.images!.map((img: any) =>
        Img({
          url: img.url!,
          width: img.width!,
          height: img.height!,
        })
      ),
      eid: Eid(arg.id!),
      email: Email(arg.email!),
    }
  } catch (err) {
    throw new BadRequest()
  }
}
