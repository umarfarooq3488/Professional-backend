import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import uploadFileOnCloudinary from '../utils/Cloudinary.js';
import { User } from '../models/User.model.js';
import jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async (user_id) => {
    const user = await User.findById(user_id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken };
}

const options = {
    httpOnly: true,
    secure: true,
}

const userRegister = asyncHandler(async (req, res) => {

    const { userName, email, fullName, password } = req.body;
    // console.log("Email:", email);
    console.log("Body data:", req.body);


    if ([userName, email, fullName, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "Please fill all the fields");
    }

    console.log("Files:", req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath = null;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
        // console.log("Cover Image URL:", coverImage);
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Please upload the avatar image");
    }

    const avatar = await uploadFileOnCloudinary(avatarLocalPath);
    const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);
    // console.log("Avatar URL:", avatar);
    if (!avatar) {
        throw new ApiError(500, "Error while uploading avatar image");
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    });
    if (existedUser) {
        throw new ApiError(400, "User already exists");
    }

    const createUser = await User.create({
        userName: userName.toLowerCase().trim(),
        email,
        fullName,
        password,
        avatar: avatar.url, // do check here if it is secure_url or only url
        coverImage: coverImage?.url || ""
    });

    const userResponse = await User.findById(createUser._id).select("-password -refreshToken");
    if (!userResponse) {
        throw new ApiError(500, "Error while creating user");
    }

    res.status(201).json(
        new ApiResponse(201, userResponse, "User has been created successfully")
    );

});

const userLogin = asyncHandler(async (req, res) => {
    const { email, userName, password } = req.body;
    console.log("Body data:", req.body);
    if (!email || !userName) {
        throw new ApiError(400, "Please provide email or username");
    }

    const user = await User.findOne({
        $or: [{ email }, { userName }]
    });
    if (!user) {
        throw new ApiError(401, "Invalid email or username");
    }
    const checkPassword = user.isPassword(password);
    if (!checkPassword) {
        throw new ApiError(401, "Invalid password");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);


    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    res.status(200).cookie("AccessToken", accessToken, options).cookie("RefreshToken", refreshToken, options).json(
        new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        }, "User has been logged in successfully")
    );

});
const userLogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        }
    })
    res.clearCookie("AccessToken", options).clearCookie("RefreshToken", options).json(
        new ApiResponse(200, null, "User has been logged out successfully")
    );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Refresh Token is not valid")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh Token is invalid or used")
        }

        const { accessToken, refreshToken } = generateAccessAndRefreshToken(user?._id)

        res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
            new ApiResponse(200, { accessToken, refreshToken }, "Your access token is refreshed")
        )
    } catch (error) {
        throw new ApiError(400, "Refresh Token is not valid");
    }
})
export { userRegister, userLogin, userLogout, refreshAccessToken };