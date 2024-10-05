import { playlistRepo } from "@/repo/playlist/playlistRepo"
import { NextFunction, Request, Response } from "express"
import express from "express"
import { auth } from "../mw/auth"
import { getPlaylist } from "@/usecase/playlist/getPlaylist"
import { getUserPlaylist } from "@/usecase/playlist/getUserPlaylists"
import { createPlaylist } from "@/usecase/playlist/createPlaylist"
import { spotifyApi } from "@/infra/api/spotifyApi/spotifyApi"
import { fileparse } from "../mw/fileparse"
import { reorderPlaylist } from "@/usecase/playlist/reorderPlaylist"
import { deletePlaylist } from "@/usecase/playlist/deletePlaylist"

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
        creatorId: req.params.id,
        page: req.query.page,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)

playlistController.post(
  "/playlists", //
  auth,
  fileparse(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await createPlaylist(
        playlistRepo, //
        spotifyApi
      ).execute({
        eids: req.body?.eids,
        clientId: req.client?.id,
        accessToken: req.client?.accessToken,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)

playlistController.put(
  "/playlists/:id/order", //
  auth,
  fileparse(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await reorderPlaylist(
        playlistRepo //
      ).execute({
        playlistId: req.params?.id,
        clientId: req.client?.id,
        idxs: req.body?.idxs,
        pos: req.body?.pos,
      })

      return res.status(200).json(result)
    } catch (err) {
      return next(err)
    }
  }
)

playlistController.delete(
  "/playlists/:id", //
  auth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await deletePlaylist(
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
