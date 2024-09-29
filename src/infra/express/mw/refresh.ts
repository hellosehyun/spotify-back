import { NextFunction, Request, Response } from "express"
import { SpotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { encryptToken } from "@/shared/helper/jwt"

export const refresh =
  (spotifyExt: SpotifyExt) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const time = 10 * 60 * 1000 // 10 minutes in ms

      if (req.user && Date.now() >= req.user.expireAt - time) {
        const extRes = await spotifyExt.refreshToken({
          refreshToken: req.user.refreshToken,
        })

        const newUser = {
          ...req.user,
          accessToken: extRes.data!.access_token,
          expiresIn: extRes.data!.expires_in,
        }
        const newToken = encryptToken(newUser)

        req.user = newUser
        res.cookie("token", newToken)
      }

      return next()
    } catch (err) {
      return next(err)
    }
  }
