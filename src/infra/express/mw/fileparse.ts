import mul from "multer"
import { Request, Response, NextFunction } from "express"

interface Opts {
  field?: string
  limit?: number
}

export const fileparse = (opts: Opts = {}) => {
  const {
    field = "img",
    limit = 10 * 1024 * 1024, // 10mb
  } = opts

  const upload = mul({
    storage: mul.memoryStorage(),
    limits: { fileSize: limit },
  })

  return [
    upload.single(field),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.file) req.body[field] = req.file.buffer
      else if (Array.isArray(req.files)) req.body[field] = req.files.map((file) => file.buffer)

      return next()
    },
  ]
}
