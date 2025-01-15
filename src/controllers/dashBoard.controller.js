import mongoose from "mongoose";
import { Subscription } from "../models/Subscription.module.js";
import { Video } from "../models/Video.module.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/Like.model.js";
import { ApiResponse } from "../utils/ApiResponse";

const getChannelStats = asyncHandler(async(req,res) => {
    const {channelId} = req.params;
    if(!isValidObjectId(channelId))throw new ApiError(400,"Invalid channelId");

    const subscribers = await Subscription.find({channel : channelId}).countDocuments();
    const videoes = await Video.find({owner : channelId,isPublished : true}).countDocuments();
    const totalViews = videoes.reduce((acc,video) => acc + video.views , 0).countDocuments();
    const totalLikes = await Like.find({video : {$in : videoes.map(video => video._id)}}).countDocuments();
    const obj = {
        subscribers,
        videoes,
        totalViews,
        totalLikes,
    }
    return res.status(200).json(new ApiResponse(200,obj,"Channel stats fetched successfully"));
});

const getChannelVideoes = asyncHandler(async(req,res) => {
    const {channelId} = req.params;
    if(!isValidObjectId(channelId))throw new ApiError(400,"Invalid channelId");
    const videoes = await Video.find({owner : channelId,isPublished : true});
    return res.status(200).json(new ApiResponse(200,videoes,"Channel videoes fetched successfully"));
});

export {
    getChannelStats,
    getChannelVideoes,
}