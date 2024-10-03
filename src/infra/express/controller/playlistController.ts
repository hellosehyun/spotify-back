import { playlistRepo } from "@/repo/playlist/playlistRepo"
import { NextFunction, Request, Response } from "express"
import express from "express"
import { auth } from "../mw/auth"
import { getPlaylist } from "@/usecase/playlist/getPlaylist"
import { getUserPlaylist } from "@/usecase/playlist/getUserPlaylists"

export const playlistController = express.Router()

playlistController.get(
  "/playlists/:id", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getPlaylist(
        playlistRepo //
      ).execute({
        clientId: req.client?.id,
        playlistId: req.params.id,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)

playlistController.get(
  "/users/:id/playlists", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getUserPlaylist(
        playlistRepo //
      ).execute({
        clientId: req.client?.id,
        userId: req.params.id,
        offset: req.query.offset,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)
