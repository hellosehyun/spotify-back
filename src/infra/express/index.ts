import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser"
import { decrypt } from "./mw/decrypt"
import { log } from "./mw/log"
import { refresh } from "./mw/refresh"
import { resolve } from "./mw/resolve"
import { spotifyExt } from "../ext/spotifyExt/spotifyExt"
import { playlistController } from "./controller/playlistController"
import { userController } from "./controller/userController"
import { playerController } from "./controller/playerController"

const port = 3001
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(log)
app.use(decrypt)
app.use(refresh(spotifyExt))

app.use("/", userController)
app.use("/", playlistController)
app.use("/", playerController)
// app.use("/", trackRoute);

app.use(resolve)

app.listen(port, () => {
  console.log(`${port}번 포트로 서버 실행`)
})
