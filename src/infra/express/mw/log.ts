import { createObjectCsvWriter as csvWrite } from "csv-writer"
import { NextFunction, Request, Response } from "express"
import fs from "fs"
import path from "path"
import moment from "moment-timezone"

const timezone = "Asia/Seoul"

const header = [
  { id: "status", title: "Status" },
  { id: "createdAt", title: "Created At" },
  { id: "resTime", title: "Response Time" },
  { id: "url", title: "URL" },
  { id: "method", title: "Method" },
  { id: "userId", title: "User Id" },
  { id: "query", title: "Request Query" },
  { id: "params", title: "Request Params" },
  { id: "body", title: "Request Body" },
]

export const log = async (originalReq: Request, res: Response, next: NextFunction) => {
  const req = { ...originalReq }
  const startTime = Date.now()

  res.on("finish", async () => {
    try {
      const resTime = Date.now() - startTime
      const logPath = getLogPath()

      fs.mkdirSync(logPath, { recursive: true })

      const row = {
        status: res.statusCode,
        createdAt: moment().tz(timezone).format("YYYY-MM-DD HH:mm:ss"),
        resTime,
        url: req.url,
        method: req.method,
        userId: req.user?.id,
        query: JSON.stringify(req.query),
        params: JSON.stringify(req.params),
        body: JSON.stringify(req.body),
      }

      const status = res.statusCode.toString()

      write(path.join(logPath, "all.csv"), row)

      if (status.startsWith("4")) {
        write(path.join(logPath, "client_error.csv"), row)
      } else if (status.startsWith("5")) {
        write(path.join(logPath, "server_error.csv"), row)
      }

      return
    } catch (err) {
      return
    }
  })

  return next()
}

const getLogPath = () => {
  const curDate = moment().tz(timezone).format("YYMMDD")
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
