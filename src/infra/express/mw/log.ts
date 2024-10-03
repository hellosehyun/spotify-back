import { createObjectCsvWriter as csvWrite } from "csv-writer"
import { NextFunction, Request, Response } from "express"
import fs from "fs"
import path from "path"
import moment from "moment-timezone"

const header = [
  { id: "status", title: "Status" },
  { id: "createdAt", title: "Created At (Seoul)" },
  { id: "method", title: "Method" },
  { id: "url", title: "URL" },
  { id: "latency", title: "Latency" },
  { id: "userId", title: "User Id" },
  { id: "body", title: "Request Body" },
]

export const log = async (req: Request, res: Response, next: NextFunction) => {
  const startAt = Date.now()

  res.on("finish", async () => {
    try {
      const latency = Date.now() - startAt
      const logPath = getLogPath()

      fs.mkdirSync(logPath, { recursive: true })

      const row = {
        status: res.statusCode,
        createdAt: new Date(),
        latency: `${latency} ms`,
        url: req.url,
        method: req.method,
        userId: req.client?.id,
        body: JSON.stringify(req.body),
      }

      const status = res.statusCode.toString()

      write(path.join(logPath, "all.csv"), row)

      if (status.startsWith("4") || status.startsWith("5")) {
        write(path.join(logPath, "err.csv"), row)
      }

      return
    } catch (err) {
      return
    }
  })

  return next()
}

const getLogPath = () => {
  const curDate = moment().tz("Asia/Seoul").format("YYMMDD")
  const curPath = path.dirname(__filename)
  const logPath = path.join(curPath, `../../../../log/${curDate}/`)

  return logPath
}

const write = async (path: string, row: object) => {
  return await csvWrite({
    path: path,
    header,
    append: fs.existsSync(path),
  }).writeRecords([row])
}
