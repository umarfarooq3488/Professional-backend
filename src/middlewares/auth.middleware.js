import { User } from "../models/User.model";
import { ApiError } from "../utils/ApiErrors";
import asyncHandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.headers("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Access Token is not available")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).select("-password -refreshToken");
        if (!decodedToken) {
            throw new ApiError("400", "Access Token is not valid")
        }

        const user = User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Couldn't verify the User")
    }
})

export { verifyJWT }