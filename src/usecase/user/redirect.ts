import { Detail, IsPublic, Name as PlaylistName, Type } from "@/entity/playlist/vo"
import { BannerImg, Country, Email, Name as UserName, Role } from "@/entity/user/vo"
import { Cnt, Eid, Id, Img, Timestamp } from "@/shared/vo"
import { User } from "@/entity/user/user"
import { Playlist } from "@/entity/playlist/playlist"
import { db } from "@/infra/drizzle/db"
import { SpotifyApi } from "@/infra/api/spotifyApi/spotifyApi"
import { PlaylistRepo } from "@/repo/playlist/playlistRepo"
import { UserRepo } from "@/repo/user/userRepo"
import { encryptToken } from "@/shared/helper/jwt"
import { BadGateway, BadRequest } from "@/shared/static/exception"
import { nanoid } from "nanoid"

type In = {
  code: any
  state: any
}

type Out = Promise<{
  id: Id
  role: Role
  name: UserName
  img: Img
  country: Country
  accessToken: string
  token: string
}>

export const redirect = (
  spotifyApi: SpotifyApi, //
  userRepo: UserRepo,
  playlistRepo: PlaylistRepo
) => ({
  execute: async (arg: In): Out => {
    const dto = pre(arg)

    const res1 = await spotifyApi.getToken({ code: dto.code, state: dto.state })
    if (!res1.ok) throw new BadGateway()

    const spotifyToken = res1.data!

    const res2 = await spotifyApi.getProfile({ accessToken: spotifyToken.access_token })
    if (!res2.ok) throw new BadGateway()

    const profile = res2.data!

    let user = await userRepo.findUser({ eid: Eid(profile.id) })
    if (user === undefined) {
      const res3 = await spotifyApi.getMyLikeTracks({ accessToken: spotifyToken.access_token })
      if (!res3.ok) throw new BadGateway()

      user = User({
        id: Id(nanoid(20)),
        name: UserName(profile.display_name),
        country: Country(profile.country),
        img: Img(
          profile.images.length > 0
            ? {
                2: {
                  url: profile.images[0].url,
                  width: profile.images[0].width,
                  height: profile.images[0].height,
                },
                1: {
                  url: profile.images[1].url,
                  width: profile.images[1].width,
                  height: profile.images[1].height,
                },
                0: {
                  url: profile.images[2].url,
                  width: profile.images[2].width,
                  height: profile.images[2].height,
                },
              }
            : {}
        ),
        eid: Eid(profile.id),
        email: Email(profile.email),
        bannerImg: BannerImg({}),
        role: Role("general"),
        followerCnt: Cnt(0),
        createdAt: Timestamp(new Date()),
      })

      const playlist = Playlist({
        id: Id(nanoid(20)),
        creatorId: user.id,
        img: Img({}),
        coverImgs: [],
        name: PlaylistName(`${user.name}의 좋아요 플레이리스트`),
        detail: Detail(""),
        isPublic: IsPublic(true),
        type: Type("like"),
        tracks: res3.data!,
        createdAt: Timestamp(new Date()),
      })

      await db.transaction(async (tx) => {
        userRepo.saveUser({ user: user! }, tx)
        playlistRepo.savePlaylist({ playlist }, tx)
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

const pre = (arg: In) => {
  try {
    return {
      code: arg.code!,
      state: arg.state!,
    }
  } catch (err) {
    throw new BadRequest()
  }
}
