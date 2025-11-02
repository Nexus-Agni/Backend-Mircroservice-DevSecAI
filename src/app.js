import express from "express"; 
import cookieParser from "cookie-parser";
import cors from "cors";
import { urlencoded } from "express";
import {userRouter} from './routers/user.route.js'

const app = express()

// TODO: Set credentials true for handling cookies, jwt
app.use(cors({
    origin : process.env.CORS_ORIGIN, 
    // credentials: true
}))

app.use(express.json({
    limit : "20kb"
}))

app.use(urlencoded({
    extended : true
}))

app.use(cookieParser())

// app.get("/", (req, res)=>{
//     res.json({
//         "message" : "Hello world testing"
//     })
// })

app.use('/api/v1/users', userRouter)

export default app