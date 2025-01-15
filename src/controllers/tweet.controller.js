import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/Tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }
  const tweet = await Tweet.create({
    content,
    owner: req.user._id,
  });
  if (!tweet) {
    throw new ApiError(400, "Tweet creation failed.");
  }
  return res.status(200).json(new ApiResponse(200, tweet, "Tweet created"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  if (!content) throw new ApiError(400, "content is required");
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet id");
  }
  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      content,
    },
    {
      new: true,
    },
  );

  if (!tweet) throw new ApiError(400, "Tweet not updated.");
  return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated."));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Tweet id invalid.");
  }
  const tweet = await Tweet.findByIdAndDelete(tweetId);
  if (!tweet) {
    throw new ApiError(400, "Tweet deletion failed");
  }
  return res.status(200).json(200, {}, "Tweet deleted.");
});

const getUsersTweets = asyncHandler(async (req, res) => {
  const tweets = await Tweet.find({
    owner: req.user._id,
  });
  if (!tweets.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No tweets created by user."));
  }
  return res.status(200).json(new ApiResponse(200, tweets, "Tweets fetched."));
});

export { getUsersTweets, updateTweet, createTweet, deleteTweet };
