import express from "express"
import { NextFunction, Request, Response } from "express"
import { auth } from "../mw/auth"
import { getPlaylist } from "@/usecase/playlist/getPlaylist"
import { playlistRepo } from "@/repo/playlistRepo/playlistRepo"

export const playlistController = express.Router()

playlistController.post(
  "/playlists", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   res.status(200).json(result)
      return res.status(200).json()
    } catch (err) {
      return next(err)
    }
  }
)

playlistController.get(
  "/playlists/:id", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getPlaylist(
        playlistRepo //
      ).execute({
        id: req.params?.id,
        userId: req.user?.id,
        page: req.query?.page,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)
