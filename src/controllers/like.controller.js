import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Like } from "../models/Like.model.js";
import { ApiResponse } from "../utils/ApiResponse";
import { Tweet } from "../models/Tweet.model.js";

const toggelVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  const existingLike = await Like.findOne({
    $and: [{ video: videoId }, { likedBy: req.user._id }],
  });
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res.status(200).json(new ApiResponse(200, null, "unliked video"));
  } else {
    const newLike = await Like.create({
      video: videoId,
      likedBy: req.user._id,
    });
    if (!newLike) throw new ApiError(400, "Failed to like video");
    return res.status(200).json(200, newLike, "Liked video.");
  }
});

const toggelCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid commentId");
  }
  const existingComment = await Like.findOne({
    comment: commentId,
    likedBy: req.user.id,
  });

  if (existingComment) {
    await Like.findByIdAndDelete(existingComment._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed from comment"));
  } else {
    const newLike = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    if (!newLike) throw new ApiError(400, "Liked failed");
    return res
      .status(200)
      .json(new ApiResponse(200, newLike, "Like added to comment"));
  }
});

const toggelTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }
  const existingTweet = await Like.findOne({
    likedBy: req.user._id,
    tweet: tweetId,
  });
  if (existingTweet) {
    await Like.findByIdAndDelete(existingTweet._id);
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Like removed from tweet."));
  } else {
    const newLike = await Like.create({
      likedBy: req.user._id,
      tweet: tweetId,
    });
    if (!newLike) throw new ApiError(400, "Liked failed");
    return res.status(200).json(200, newLike, "Liked the tweet");
  }
});

const getLikedVideoes = asyncHandler(async (req, res) => {
  const videoes = await Like.find({
    video: { $ne: null },
    likedBy: req.user._id,
  });
  if (!videoes.length) {
    return res.status(200).json(200, [], "Not any videoes liked by user.");
  } else {
    return res.status(200).json(200, videoes, "All liked videoes are fetched.");
  }
});

const getLikedTweets = asyncHandler(async (req, res) => {
  const tweets = await Like.find({
    tweet: { $ne: null },
    likedBy: req.user._id,
  });
  if (!tweets.length) {
    return res.status(200).json(200, [], "Not any tweets liked by user.");
  } else {
    return res.status(200).json(200, tweets, "All liked tweets are fetched.");
  }
});

const getLikedComments = asyncHandler(async (req, res) => {
  const comments = await Like.find({
    comment: { $ne: null },
    likedBy: req.user._id,
  });
  if (!comments.length) {
    return res.status(200).json(200, [], "Not any videoes liked by user.");
  } else {
    return res
      .status(200)
      .json(200, comments, "All liked videoes are fetched.");
  }
});

export {
  getLikedVideoes,
  getLikedComments,
  getLikedTweets,
  toggelCommentLike,
  toggelTweetLike,
  toggelVideoLike,
};
