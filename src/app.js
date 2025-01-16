import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes.js";
import { videoRoutes } from "./routes/video.routes.js";
import { tweetRoutes } from "./routes/tweet.routes.js";
const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))

app.use(express.json({
    limit : "16kb"
}))

app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

app.use("/api/v1/users",userRouter)

app.use('/api1/v1/videoes',videoRoutes);

app.use('/api1/v1/tweets',tweetRoutes);

export { app };
