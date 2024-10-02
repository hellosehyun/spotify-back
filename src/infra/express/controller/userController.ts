import { spotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { playlistRepo } from "@/repo/playlist/playlistRepo"
import { userRepo } from "@/repo/user/userRepo"
import { oauth } from "@/usecase/user/oauth"
import { redirect } from "@/usecase/user/redirect"
import { NextFunction, Request, Response } from "express"
import express from "express"

export const userController = express.Router()

userController.get(
  "/users/oauth", //
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = oauth().execute()

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)

userController.get(
  "/users/oauth/redirect", //
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await redirect(
        spotifyExt, //
        userRepo,
        playlistRepo
      ).execute({
        code: req.query?.code,
        state: req.query?.state,
      })

      res.cookie("id", result.id)
      res.cookie("name", result.name)
      res.cookie("role", result.role)
      res.cookie("img", result.img)
      res.cookie("country", result.country)
      res.cookie("accessToken", result.accessToken)
      res.cookie("token", result.token)

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)
