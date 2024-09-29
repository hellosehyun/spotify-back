import express from "express"
import { NextFunction, Request, Response } from "express"
import { oauth } from "@/usecase/user/oauth"
import { redirect } from "@/usecase/user/redirect"
import { spotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { userRepo } from "@/repo/userRepo/userRepo"

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
        userRepo
      ).execute({
        code: req.query?.code,
        state: req.query?.state,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)
