import { spotifyApi } from "@/infra/api/spotifyApi/spotifyApi"
import { playlistRepo } from "@/repo/playlist/playlistRepo"
import { userRepo } from "@/repo/user/userRepo"
import { oauth } from "@/usecase/user/oauth"
import { redirect } from "@/usecase/user/redirect"
import { NextFunction, Request, Response } from "express"
import express from "express"
import { auth } from "../mw/auth"

export const userController = express.Router()

userController.get(
  "/users/oauth", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = oauth().execute()

      res.clearCookie("id")
      res.clearCookie("name")
      res.clearCookie("role")
      res.clearCookie("img")
      res.clearCookie("country")
      res.clearCookie("accessToken")
      res.clearCookie("token")

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)

userController.get(
  "/users/oauth/redirect", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await redirect(
        spotifyApi, //
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
