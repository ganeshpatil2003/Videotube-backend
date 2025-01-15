import { PlayList } from "../models/Playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlayList = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if ([name, description].some((f) => f.trim() === ""))
    throw new ApiError(400, "Name and description is required");
  const playList = await PlayList.create({
    name,
    description,
    owner: req.user._id,
  });
  if (!playList) throw new ApiError(400, "Failed to create playlist");
  return res
    .status(200)
    .json(new ApiResponse(200, playList, "Playlist created successfully"));
});

const deltePlayList = asyncHandler(async (req, res) => {
  const { playListId } = req.params;
  if (!isValidObjectId(playListId))
    throw new ApiError(400, "Invalid playlistId");
  const playList = await PlayList.findByIdAndDelete(playListId);
  if (!playList) throw new ApiError(404, "Playlist not found");
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

const updatePlayList = asyncHandler(async (req, res) => {
  const { playListId } = req.params;
  const { name, description } = req.body;
  if (!isValidObjectId(playListId))
    throw new ApiError(400, "Invalid playlistId");
  const playList = await PlayList.findById(playListId);
  if (name !== "") {
    playList.name = name;
  }
  if (description !== "") {
    playList.description = description;
  }
  const updatedPlayList = await playList.save();
  if (!updatedPlayList) throw new ApiError(400, "Failed to update playlist");
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlayList, "Playlist updated successfully"),
    );
});

const getPlayListById = asyncHandler(async (req, res) => {
  const { playListId } = req.params;
  if (!isValidObjectId(playListId))
    throw new ApiError(400, "Invalid playlistId");
  const playlist = await PlayList.findById(playListId);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const getPlayListByOwner = asyncHandler(async (req, res) => {
  const playLists = await PlayList.find({ owner: req.user._id });
  if (!playLists) throw new ApiError(404, "Playlist not found");
  return res
    .status(200)
    .json(new ApiResponse(200, playLists, "Playlist fetched successfully"));
});

const addVideoToPlayList = asyncHandler(async (req, res) => {
  const { playListId, videoId } = req.params;
  if (!isValidObjectId(playListId) || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid playlistId or videoId");
  const playList = await PlayList.findById(playListId);
  if (!playList) throw new ApiError(404, "Playlist not found");
  if (playList.video.includes(videoId))
    throw new ApiError(400, "Video already in playlist");
  playList.video.push(videoId);
  await playList.save();
  return res
    .status(200)
    .json(new ApiResponse(200, playList, "Video added to playlist"));
});

const removeVideoFromPlayList = asyncHandler(async (req, res) => {
  const { playListId, videoId } = req.params;
  if (!isValidObjectId(playListId) || !isValidObjectId(videoId))
    throw new ApiError(400, "Invalid playlistId or videoId");
  const playList = await PlayList.findById(playListId);
  if (!playList) throw new ApiError(404, "Playlist not found");
  if (!playList.video.includes(videoId))
    throw new ApiError(400, "Video not in playlist");
  const index = playList.video.findIndex((v) => v === videoId);
  if (index > -1) {
    playList.video.splice(index, 1);
  } else {
    throw new ApiError(400, "Video not found in playlist");
  }
  await playList.save();
  return res
    .status(200)
    .json(new ApiResponse(200, playList, "Video removed from playlist"));
});

export {
    createPlayList,
    deltePlayList,
    updatePlayList,
    getPlayListById,
    getPlayListByOwner,
    addVideoToPlayList,
    removeVideoFromPlayList,
}
