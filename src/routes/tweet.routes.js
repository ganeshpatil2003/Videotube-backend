import { Router } from "express";
import { verifyJWt } from "../middelwares/authenticate.middelware.js";
import {
  createTweet,
  deleteTweet,
  getUsersTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const tweetRoutes = Router();

tweetRoutes.use(verifyJWt);

tweetRoutes.route("/").post(createTweet).get(getUsersTweets);

tweetRoutes.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export { tweetRoutes };
