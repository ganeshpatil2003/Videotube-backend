import { isValidObjectId } from "mongoose";
import { Subscription } from "../models/Subscription.module.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggelSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channelId");
  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });
  if (existingSubscription) {
    await Subscription.findByIdAndDelete(existingSubscription._id);
    return res.status(200).json(new ApiResponse(200, null, "Unsubscribed"));
  } else {
    const newSubscription = await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
    if (!newSubscription) throw new ApiError(400, "Failed to subscribe");
    return res
      .status(200)
      .json(new ApiResponse(200, newSubscription, "Subscribed"));
  }
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscribedChannels = await Subscription.find({
    subscriber: req.user._id,
  });
  const obj = {
    subscribedChannels,
    totalSubscribed: subscribedChannels.length,
  };
  return res
    .status(200)
    .json(new ApiResponse(200, obj, "Subscribed to fetched."));
});

const getChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Channelid invalid");
  }
  const subscribers = await Subscription.find({
    channel: channelId,
  }).countDocuments();
  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers, "Subscribers fetched successfully"),
    );
});

export { toggelSubscription, getSubscribedChannels, getChannelSubscribers };
