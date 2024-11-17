import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.module.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // get user details from user
  // validation - not empty
  // check user already exists : username email
  // check for avatar coverimage
  //upload them to cloudinary
  // create entry in db - create user object
  // remove password and tokenfield from response
  // check for user creation
  // return response
  const { fullname, password, username, email } = req.body;
  if (
    [fullname, password, username, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
});

const existedUser = User.findOne({
  $or: [{ username }, { email }],
});

if (existedUser) {
  throw new ApiError(409, "User with email or username already exists.");
}

const avatarLocalPath = req.files?.avatar[0]?.path;
const coverimageLocalPath = req.files?.coverimage[0]?.path;

if (!avatarLocalPath) {
  throw new ApiError(400, "Avatar file is required");
}

const avatar = await uploadOnCloudinary(avatarLocalPath);

const coverimage = await uploadOnCloudinary(coverimageLocalPath);

if (!avatar) {
  throw new ApiError(400, "Avatar file is required");
}

const user = await User.create({
  fullname,
  avatar: avatar.url,
  coverimage: coverimage?.url || "",
  email,
  password,
  username: username.toLowerCase(),
});

const createdUser = await User.findById(user?._id).select(
  " -password -refreshToken",
);

if (!createdUser) {
  throw new ApiError(500, "Something went wrong whiel regestering the user.");
}

res
  .status(201)
  .json(new ApiResponse(200, createdUser, "user registered successfully."));

export { registerUser };
