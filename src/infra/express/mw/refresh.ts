import { NextFunction, Request, Response } from "express"
import { SpotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { encryptToken } from "@/shared/helper/jwt"
import { InternalError } from "@/shared/static/exception"

export const refresh =
  (spotifyExt: SpotifyExt) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const time = 10 * 60 * 1000 // 10 minutes in ms

      // if (req.user && Date.now() >= req.user.expireAt - time) {
      if (req.user) {
        const extRes = await spotifyExt.refreshToken({
          refreshToken: req.user.refreshToken,
        })
        if (!extRes.ok) throw new InternalError()

        const spotifyToken = extRes.data!

        const newUser = {
          id: req.user.id,
          role: req.user.role,
          refreshToken: req.user.refreshToken,
          accessToken: spotifyToken.access_token,
          expireAt: Date.now() + spotifyToken.expires_in * 1000,
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
