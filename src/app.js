import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()
app.use(cors())
app.use(cookieParser())
app.use(express.static("public"))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))


import router from "./routes/user.routes.js"

app.use("/api",router)

export {app}