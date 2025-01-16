import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./routes/user.routes.js";
import { videoRoutes } from "./routes/video.routes.js";
import { tweetRoutes } from "./routes/tweet.routes.js";
import { playListRoutes } from "./routes/playlist.routes.js";
import { subscriptionRoutes } from "./routes/subscription.routes.js";
import { commentRoutes } from "./routes/comment.routes.js";
import { likeRoutes } from "./routes/like.routes.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: "16kb",
  }),
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  }),
);

app.use(express.static("public"));

app.use(cookieParser());

app.use("/api/v1/users", userRouter);

app.use("/api1/v1/videoes", videoRoutes);

app.use("/api1/v1/tweets", tweetRoutes);

app.use("/api1/v1/playLists", playListRoutes);

app.use("/api1/v1/subscriptions", subscriptionRoutes);

app.use("/api1/v1/comments", commentRoutes);

app.use("/api1/v1/likes", likeRoutes);

export { app };
