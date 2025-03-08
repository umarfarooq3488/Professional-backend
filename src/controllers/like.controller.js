import asyncHandler from "../utils/asyncHandler.js";
import { Like } from "../models/Like.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(401, "videoId is not provided")
    }
    const alreadyLiked = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })
    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked)
        res.status(200).json(
            new ApiResponse(200, null, "Video unliked")
        )
    } else {
        const liked = await Like.create({
            video: videoId,
            likedBy: req.user._id
        })
        res.status(200).json(
            new ApiResponse(200, liked, "Video liked")
        )
    }

})
const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(401, "comment id is not provided")
    }
    const alreadyLiked = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    })
    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked)
        res.status(200).json(
            new ApiResponse(200, null, "Comment unliked")
        )
    } else {
        const liked = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })
        res.status(200).json(
            new ApiResponse(200, liked, "Comment liked")
        )
    }

})
const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    if (!tweetId) {
        throw new ApiError(401, "tweet id is not provided")
    }
    const alreadyLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    })
    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked)
        res.status(200).json(
            new ApiResponse(200, null, "tweet unliked")
        )
    } else {
        const liked = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })
        res.status(200).json(
            new ApiResponse(200, liked, "tweet liked")
        )
    }

})

const getLikedVideos = asyncHandler(async (req, res) => {
    const allVideos = await Like.find({ likedBy: req.user._id }).populate(
        {
            path: "video",
            select: "title thumbnail owner views",
            populate: {
                path: "owner",
                select: "fullName avatar"
            }
        })

    if (!allVideos) {
        throw new ApiError(400, "There is problem while fetching liked videos")
    }
    res.status(200).json(
        new ApiResponse(200, allVideos, "Liked videos fetched successfully")
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
