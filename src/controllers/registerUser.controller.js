import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/User.module.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async(userid) => {
  try {
    const user = await User.findById(userid);

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    
    await user.save({validateBeforeSave : false})                                // solve the validation before save as define in schema

    return {accessToken,refreshToken}

  } catch (error) {
      throw new ApiError(500,"Something went wrong while generating access and refresh token.");
  }
}
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
  const { fullname, password ,username , email} = req.body;
//   const username = req.body.username || "default_username";
//   const email = req.body.email || "default_email@example.com";
console.log(req.files)

  if (
    [fullname, password, username, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }


const existedUser = await User.findOne(
    {
  $or: [{ username }, { email }],
}
);

if (existedUser) {
  throw new ApiError(409, "User with email or username already exists.");
}

const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverimageLocalPath = req.files?.coverimage[0]?.path;

let coverimageLocalPath = "";
if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage > 0){
    coverimageLocalPath = req.files?.coverimage[0]?.path;
}

if (!avatarLocalPath) {
  throw new ApiError(400, "Avatar file is required");
}

const avatar = await uploadOnCloudinary(avatarLocalPath)

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

res.status(201)
  .json(new ApiResponse(200, createdUser, "user registered successfully."));
});



const logInUser = asyncHandler(async (req , res) => {
  //req.body -> data
  // username or email 
  // find the user
  // password check
  // access and refresh token 
  // send secure cokkies

  const {username,password,email} = req.body;

  if(!(username || email)){
    throw new ApiError(400,"Username or Email is required");
  }
  
  const user = await User.findOne({
    $or : [{ username } , { email }]
  })

  if(!user){
    throw new ApiError(400,"User doesn't exist.")
  }

  const isValidPassword = await user.isPasswordCorrect(password);

  if(!isValidPassword){
    throw new ApiError(400,"Password is invalid.")
  }

  const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly  :true,
    secure : true
  }

  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",refreshToken,options)
  .json(
    new ApiResponse(200,
    {
      user : loggedInUser,accessToken,refreshToken
    },
    "User logged in successfully."
    ))
})

const logOutUser = asyncHandler(async (req,res) => {
  User.findByIdAndUpdate(req.user?._id,
    {
      $set : { refreshToken:undefined }
    },
    {
      new : true,
    })

    const options = {
      httpOnly : true,
      secure : true
    }

    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
      new ApiResponse(200,{},"User Logged out")
    )
})

export { registerUser,logInUser,logOutUser };

