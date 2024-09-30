import express from "express"
import { NextFunction, Request, Response } from "express"
import { auth } from "../mw/auth"
import { spotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { play } from "@/usecase/player/play"

export const playerController = express.Router()

playerController.put(
  "/player/play", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await play(
        spotifyExt //
      ).execute({
        accessToken: req.user?.accessToken,
        deviceEid: req.body?.deviceEid,
        index: req.body?.index,
        euri: req.body?.euri,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)
