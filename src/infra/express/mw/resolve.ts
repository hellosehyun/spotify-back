import { BadRequest, Conflict, Forbidden, NotFound, Unauthorized } from "@/shared/static/exception"
import { NextFunction, Request, Response } from "express"

export const resolve = (err: any, req: Request, res: Response, next: NextFunction) => {
  let status

  if (err instanceof BadRequest) status = 400
  else if (err instanceof Unauthorized) status = 401
  else if (err instanceof Forbidden) status = 403
  else if (err instanceof NotFound) status = 404
  else if (err instanceof Conflict) status = 409
  else status = 500

  const message = err.message || "something broke..."

  console.log(err)

  return res.status(status).json({ message })
}
