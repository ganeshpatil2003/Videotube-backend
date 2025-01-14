import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/Video.module.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { removeMediaFromCloudinary } from "../utils/removeMediaFromCloudinary.js";
import { removeFromCloudinary } from "../utils/removeFromCloudinary.js";
const geAllVideoes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  let match = {};
  if (query) {
    match.title = { $regex: query, $options: "i" };
    match.description = { $regex: query, $options: "i" };
  }
  if (userId) {
    match.owner = userId;
  }
  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortType === "desc" ? -1 : 1;
  }
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const videoes = await Video.aggregatePaginate(
    Video.aggregate([
      {
        $match: match,
      },
      {
        $sort: sort,
      },
      {
        $lookup: {
          localField: "owner",
          from: "users",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                fullname: 1,
                email: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          owner: {
            $first: "$owner",
          },
        },
      },
    ]),
    options,
  );
  return res
    .status(200)
    .json(new ApiResponse(200, videoes, "Videoes fetched successfully."));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        localField: "owner",
        foreignField: "_id",
        from: "users",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              email: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);
  if (!video) throw new ApiError(400, "Video not found");
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully."));
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if ([title, description].some((f) => f.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  const videoLocalePath = req?.files?.video[0]?.path;
  const thumbnailLocalePath = req.files?.thumbnail[0]?.path;
  if (
    [videoLocalePath, thumbnailLocalePath].some(
      (f) => f.trim() === "" || undefined,
    )
  )
    throw new ApiError(400, "Video file is required");
  const videoUpload = await uploadOnCloudinary(videoLocalePath);
  const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalePath);

  if (
    [videoUpload.url, thumbnailUpload.url].some(
      (f) => f.trim() === "" || undefined,
    )
  )
    throw new ApiError(400, "Failed to upload video and thumbnail");
  const video = await Video.create({
    title,
    description,
    thumbnail: thumbnailUpload.url,
    videoFile: videoUpload.url,
  });
  if (!video) throw new ApiError(400, "failed to create video.");
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video vreated successfully."));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const videoLocalePath = req?.files?.video[0]?.path;
  const thumbnailLocalePath = req?.files?.video[0]?.path;
  const { title, description } = req.body;
  const video = await Video.findById(videoId);

  if (title !== "") {
    video.title = title;
  }

  if (description !== "") {
    video.description = description;
  }

  if (videoLocalePath !== ("" || undefined)) {
    if (video.videoFile) {
      await removeMediaFromCloudinary(video.videoFile);
    }
    const uploadVideo = await uploadOnCloudinary(videoLocalePath);
    video.videoFile = uploadVideo.url;
  }
  if (videoLocalePath !== ("" || undefined)) {
    if (video.videoFile) {
      await removeMediaFromCloudinary(video.videoFile);
    }
    const uploadVideo = await uploadOnCloudinary(videoLocalePath);
    video.videoFile = uploadVideo.url;
  }

  if (thumbnailLocalePath !== ("" || undefined)) {
    if (video.thumbnail) {
      await removeFromCloudinary(video.thumbnail);
    }
    const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalePath);
    video.thumbnail = uploadThumbnail.url;
  }

  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully."));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (video.videoFile) {
    await removeMediaFromCloudinary(video.videoFile);
  }
  if (video.thumbnail) {
    await removeFromCloudinary(video.thumbnail);
  }
  const deletee = await Video.findByIdAndDelete(videoId);
  if (!deletee) {
    throw new ApiError(200, "Error while delete video.");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Video deleted."));
});

const toggelPublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "Video cant found.");
  }
  video.isPublished = !video.isPublished;
  await video.save();
  return res.status(200).json(200, {}, "Published status toggeled.");
});

export {
  getVideoById,
  geAllVideoes,
  publishVideo,
  updateVideo,
  deleteVideo,
  toggelPublishStatus,
};
