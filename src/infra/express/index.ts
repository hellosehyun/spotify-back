import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser"
import { decrypt } from "./mw/decrypt"
import { log } from "./mw/log"
import { refresh } from "./mw/refresh"
import { resolve } from "./mw/resolve"
import { userController } from "./controller/userController"
import { spotifyApi } from "../api/spotifyApi/spotifyApi"
import { playlistController } from "./controller/playlistController"
import { initElastic } from "./init/initElastic"
import { elasticExt } from "../elastic/elasticExt"
import { trackController } from "./controller/trackController"

const port = 3001
const app = express()

const run = async () => {
  try {
    await initElastic(elasticExt)

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())

    app.use(log)
    app.use(decrypt)
    app.use(refresh(spotifyApi))

    app.use("/", userController)
    app.use("/", playlistController)
    app.use("/", trackController)

    app.use(resolve)

    app.listen(port, () => {
      console.log(`${port}번 포트로 서버 실행`)
    })
  } catch (err) {
    process.exit(1)
  }
}

run()
