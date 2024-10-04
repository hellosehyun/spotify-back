import { playlistRepo } from "@/repo/playlist/playlistRepo"
import { NextFunction, Request, Response } from "express"
import express from "express"
import { auth } from "../mw/auth"
import { likeTracks } from "@/usecase/track/likeTracks"
import { spotifyApi } from "@/infra/api/spotifyApi/spotifyApi"
import { unlikeTracks } from "@/usecase/track/unlikeTracks"

export const trackController = express.Router()

trackController.put(
  "/tracks/like", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await likeTracks(
        playlistRepo, //
        spotifyApi
      ).execute({
        clientId: req.client?.id,
        accessToken: req.client?.accessToken,
        eids: req.body?.eids,
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
      const result = await unlikeTracks(
        playlistRepo //
      ).execute({
        clientId: req.client?.id,
        accessToken: req.client?.accessToken,
        idxs: req.body?.idxs,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)
