import asyncHandler from '../utils/asynchandler.js';
import ApiError from '../utils/apiError.js';
import { User } from '../models/user.models.js';
import { UploadOnCloudinary } from "../utils/cloudinary.js"
import ApiResponse from '../utils/apiResponse.js'

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

  const avatarLocalpath = req.files?.avatar?.[0]?.path || '';
  const coverimageLocalpath = req.files?.cover?.[0]?.path || '';

  //upload images to cloudinary
  if (!avatarLocalpath && !coverimageLocalpath) {
    throw new ApiError(400, 'At least one image (avatar or cover) is required');
  }
  const avatar = avatarLocalpath ? await UploadOnCloudinary(avatarLocalpath) : '';
  const coverimage = coverimageLocalpath ? await UploadOnCloudinary(coverimageLocalpath) : '';
  // Here you would typically save the user to the database and handle file uploads
  if (!avatar) {
    throw new ApiError(400, 'Avatar image is required');

  }


  const user = await User.create({
    username,
    fullname,
    email,
    password,
    avatar: avatar.url, // Store the Cloudinary URL
    coverimage: coverimage ? coverimage.secure_url : '', // Optional cover image
  });
  // Check if user creation was successful
  const usercreated = await User.findById(user._id).select('-password -refreshToken');
  if (!usercreated) {
    throw new ApiError(500, 'User creation failed');
  }

  console.log('User created successfully:', usercreated);
  return res.status(201).json(new ApiResponse(usercreated, 201, 'User registered successfully'));
});



export { registerUser };