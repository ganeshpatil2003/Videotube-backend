import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/Comment.model.js";

const addComment = asyncHandler(async(req,res) => {
    const {content} =  req.body;
    const {videoId} = req.params;
    if(!content) throw new ApiError(400,"Content is required");
    if(!isValidObjectId(videoId))throw new ApiError(400,"Invalid videoId");
    const comment = await Comment.create({
        content,
        video : videoId,
        owner  : req.user._id,
    });
    if(!comment){
        throw new ApiError(400,"Failed to comment");
    }
    return res.status(200).json(new ApiResponse(200,comment,"Comment on video"));
});

const updateComment = asyncHandler(async(req,res) => {
    const {content} =  req.body;
    const {commentId} = req.params;
    if(!content) throw new ApiError(400,"Content is required");
    if(!isValidObjectId(commentId))throw new ApiError(400,"Invalid videoId");
    const comment = await Comment.findByIdAndUpdate(commentId,
        {
            content,
        },
        {
            new : true,
        }
    );
    if(!comment){
        throw new ApiError(400,"Failed to comment");
    }
    return res.status(200).json(new ApiResponse(200,comment,"Update Comment on video"));
});

const getCommentById = asyncHandler(async(req,res) => {
    const {commentId} = req.params;
    if(!isValidObjectId(commentId))throw new ApiError(400,"Invalid commentId");
    const comment = await Comment.findById(commentId);
    if(!comment) throw new ApiError(404,"Comment not found");
    return res.status(200).json(new ApiResponse(200,comment,"Comment fetched successfully"));
});

const deleteComment = asyncHandler(async(req,res) => {
    const {commentId} = req.params;
    if(!isValidObjectId(commentId))throw new ApiError(400,"Invalid commentId");
    const comment = await Comment.findByIdAndDelete(commentId);
    if(!comment) throw new ApiError(404,"Comment not found");
    return res.status(200).json(new ApiResponse(200,null,"Comment deleted successfully"));
});

const getVideoComments = asyncHandler(async(req,res) => {
    const { videoId } = req.params;
    const {page = 1 , limit = 10} = req.query;
    if(!isValidObjectId(videoId))throw new ApiError(400,"Invalid videoId");
    const comments = await Comment.find({video : videoId}).skip((page-1)*limit).limit(limit);
    if(!comments) throw new ApiError(404,"Comments not found");
    return res.status(200).json(new ApiResponse(200,comments,"Comments fetched successfully"));
});

export {
    addComment,
    updateComment,
    getCommentById,
    deleteComment,
    getVideoComments
}