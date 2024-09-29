import express from "express"
import { NextFunction, Request, Response } from "express"
import { auth } from "../mw/auth"

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
