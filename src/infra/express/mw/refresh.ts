import { NextFunction, Request, Response } from "express"
import { SpotifyApi } from "@/infra/api/spotifyApi/spotifyApi"
import { encryptToken } from "@/shared/helper/jwt"
import { InternalError } from "@/shared/static/exception"

export const refresh =
  (spotifyExt: SpotifyApi) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const time = 10 * 60 * 1000 // 10 minutes in ms

      // if (req.client && Date.now() >= req.client.expireAt - time) {
      if (req.client) {
        const extRes = await spotifyExt.refreshToken({
          refreshToken: req.client.refreshToken,
        })
        if (!extRes.ok) throw new InternalError()

        const spotifyToken = extRes.data!

        const newUser = {
          id: req.client.id,
          role: req.client.role,
          refreshToken: req.client.refreshToken,
          accessToken: spotifyToken.access_token,
          expireAt: Date.now() + spotifyToken.expires_in * 1000,
        }
        const newToken = encryptToken(newUser)

        req.client = newUser
        res.cookie("accessToken", newUser.accessToken)
        res.cookie("token", newToken)
      }

      return next()
    } catch (err) {
      return next(err)
    }
  }
