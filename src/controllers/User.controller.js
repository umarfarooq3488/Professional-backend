import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiErrors.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import uploadFileOnCloudinary from '../utils/Cloudinary.js';
import { User } from '../models/User.model.js';

const userRegister = asyncHandler(async (req, res) => {
    try {
        const { userName, email, fullName, password } = req.body;
        console.log("Email:", email);

        if ([userName, email, fullName, password].some(field => field?.trim() === "")) {
            throw new ApiError(400, "Please fill all the fields");
        }

        const avatarLocalPath = req.files?.avatar[0]?.path;
        const coverImageLocalPath = req.files?.coverImage[0]?.path;

        if (!avatarLocalPath) {
            throw new ApiError(400, "Please upload the avatar image");
        }

        const avatar = await uploadFileOnCloudinary(avatarLocalPath);
        const coverImage = await uploadFileOnCloudinary(coverImageLocalPath);
        console.log("Avatar URL:", avatar);
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
    } catch (error) {
        console.error("Error in userRegister:", error);
        throw new ApiError(500, "Internal Server Error");
    }
});

export { userRegister };