import express from "express"
import { NextFunction, Request, Response } from "express"
import { spotifyExt } from "@/infra/ext/spotifyExt/spotifyExt"
import { auth } from "../mw/auth"
import { likeTracks } from "@/usecase/track/likeTracks"
import { dislikeTrack } from "@/usecase/track/dislikeTrack"
import { playlistRepo } from "@/repo/playlistRepo/playlistRepo"

export const trackController = express.Router()

trackController.put(
  "/tracks/like", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await likeTracks(
        spotifyExt, //
        playlistRepo
      ).execute({
        userId: req.user?.id,
        eids: req.body?.eids,
        accessToken: req.user?.accessToken,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)

trackController.delete(
  "/tracks/like", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await dislikeTrack(
        spotifyExt, //
        playlistRepo
      ).execute({
        userId: req.user?.id,
        eids: req.body?.eids,
        accessToken: req.user?.accessToken,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)
