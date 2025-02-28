import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.COOKIE_ORIGIN,
    credentials: true,
}))
app.use(express.json({ limit: "12kb" }))
app.use(express.urlencoded({ limit: "12kb", extended: true }))
app.use(cookieParser())

import userRouter from "./routes/User.routes.js"
import videoRouter from "./routes/Video.routes.js"
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)

export { app }