import { Unauthorized } from "@/shared/static/exception"
import { NextFunction, Request, Response } from "express"

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new Unauthorized()

    return next()
  } catch (err) {
    return next(err)
  }
}
