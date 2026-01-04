import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/apiError.js';
import { User } from '../models/user.models.js';
import { UploadOnCloudinary } from "../utils/cloudinary.js"
import ApiResponse from '../utils/apiResponse.js'
import jwt from 'jsonwebtoken';

const registerUser = asyncHandler(async (req, res) => {
  //get user data from request body
  //validation -check if the details are correct
  //create user in the database
  //return the user data
  //check for images like avatar 
  //uplaoad images to cloudinary or local storage
  //create user in DB
  //remove password and refresh token from response
  //check for user creation
  //retrun response with user data
  const { username, fullname, email, password } = req.body;
  console.log('User registration data:', { fullname, email, password });
  // Check if all fields are provided
  if ([fullname, username, email, password].some((field) => field?.trim() === '')) {
    throw new ApiError(400, 'All fields are required');

  }

  // check if the email is already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already registered');
  }

  const avatarLocalpath = req.files?.avatar?.[0]?.path;
  const coverimageLocalpath = req.files?.cover?.[0]?.path;

  //upload images to cloudinary
  let avatar = '';
  if (avatarLocalpath) {
    const uploadedAvatar = await UploadOnCloudinary(avatarLocalpath);
    avatar = uploadedAvatar?.url || '';
  }

  let coverimage = '';
  if (coverimageLocalpath) {
    const uploadedCover = await UploadOnCloudinary(coverimageLocalpath);
    coverimage = uploadedCover?.url || '';
  }


  const user = await User.create({
    username,
    fullname,
    email,
    password,
    avatar: avatar, // avatar variable holds the URL or empty string
    coverimage: coverimage, // Optional cover image
  });
  // Check if user creation was successful
  const usercreated = await User.findById(user._id).select('-password -refreshToken');
  if (!usercreated) {
    throw new ApiError(500, 'User creation failed');
  }

  console.log('User created successfully:', usercreated);
  return res.status(201).json(new ApiResponse(usercreated, 201, 'User registered successfully'));
});





const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isCorrectPassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        {
          user: loggedInUser,
          accessToken,
          refreshToken
        },
        200,
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  );

  const options = {
    httpOnly: true,
    secure: true
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse({}, 200, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?.id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true
    };

    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          { accessToken, refreshToken: refreshToken },
          200,
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
