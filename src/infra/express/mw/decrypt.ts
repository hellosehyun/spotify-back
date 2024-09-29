import { NextFunction, Request, Response } from "express"
import { decryptToken } from "@/shared/helper/jwt"

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

interface User {
  id: number
  role: string
  accessToken: string
  refreshToken: string
  expireAt: number
}

export const decrypt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.cookies.token) {
      const user = decryptToken(req.cookies.token)
      req.user = user
    } else {
      req.user = undefined
    }

    return next()
  } catch (err) {
    return next(err)
  }
}
