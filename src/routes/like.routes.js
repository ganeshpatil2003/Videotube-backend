import { Router } from "express";
import {
  getLikedComments,
  getLikedTweets,
  getLikedVideoes,
  toggelCommentLike,
  toggelTweetLike,
  toggelVideoLike,
} from "../controllers/like.controller.js";

const likeRoutes = Router();

likeRoutes.route("/toggel/v/:videoId").post(toggelVideoLike);
likeRoutes.route("/toggel/c/:commentId").post(toggelCommentLike);
likeRoutes.route("/toggel/t/:videoId").post(toggelTweetLike);

likeRoutes.route("/v").get(getLikedVideoes);
likeRoutes.route("/c").get(getLikedComments);
likeRoutes.route("/t").get(getLikedTweets);

export { likeRoutes };
