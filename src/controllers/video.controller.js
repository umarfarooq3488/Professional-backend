import asyncHandler from "../utils/asyncHandler.js"
import { Video } from "../models/Video.model.js"
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import uploadFileOnCloudinary from "../utils/Cloudinary.js";
import { User } from "../models/User.model.js"


const uploadVideo = asyncHandler(async (req, res) => {
    const { title, description, duration } = req.body;
    if ([title, description, duration].some(field => field.trim() === "")) {
        throw new ApiError(401, "All fields are required")
    }
    const thumbnailLocalPath = req.files.thumbnail[0]?.path;
    const videoLocalPath = req.files.videoFile[0]?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError("Please upload the thumbnail")
    }
    if (!videoLocalPath) {
        throw new ApiError("Please upload the video file")
    }
    const thumbnail = await uploadFileOnCloudinary(thumbnailLocalPath);
    const video = await uploadFileOnCloudinary(videoLocalPath);

    // const user = await User.findById(req.user?._id).select("-password -refreshToken");

    const uploadedVideo = await Video.create({
        title: title,
        description: description,
        duration: duration,
        owner: req.user?._id,
        videoFile: video.url,
        thumbnail: thumbnail.url,
        views: 0,
        isPublished: true
    })


    res.status(200).json(
        new ApiResponse(200, uploadedVideo, "Video is uploaded")
    )
})

const getVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(401, "video id is not available")
    }
    const video = await Video.findById(videoId).populate("owner", "userName fullName avatar");
    if (!video) {
        throw new ApiError(401, "Couldn't fetch the video with the given id")
    }

    video.views += 1;
    await video.save()

    res.status(200).json(
        new ApiResponse(200, video, "Video details are fetched successfully")
    )
})

const updateVideoDetails = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(401, "video id is not available")
    }
    const { title, description, duration } = req.body;
    if ([title, description, duration].some(field => field.trim() === "")) {
        throw new ApiError(401, "All fields are required")
    }


    const video = await Video.findByIdAndUpdate(videoId, {
        $set: {
            title,
            description,
            duration
        }
    }, {
        new: true
    });
    if (!video) {
        throw new ApiError(400, "video Id is not valid")
    }
    res.status(200).json(
        new ApiResponse(200, video, "Video details are updated successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new ApiError(401, "videoId is not provided")
    }
    const deletedVideo = await Video.findByIdAndDelete(videoId)
    if (!deletedVideo) {
        throw new ApiError(401, "Couldn't find the video with given id")
    }

    res.status(200).json(
        new ApiResponse(200, deletedVideo, "Video deleted successfully")
    )
})

const getAllVideos = asyncHandler(async (req, res) => {
    const allVideos = await Video.find().populate("owner", "userName fullName avatar")
    if (!allVideos) {
        throw new ApiError(401, "There is a problem while fetching the videos")
    }

    res.status(200, allVideos, "All videos fetched successfully")
})

const searchVideos = asyncHandler(async (req, res) => {
    const { query } = req.query;
    if (!query) {
        throw new ApiError(401, "Search query is not provided")
    }

    const videos = await Video.find({
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } }
        ]
    }).populate("owner", "userName fullName avatar")
    if (!videos) {
        throw new ApiError(400, "No videos matched")
    }
    res.status(200).json(
        new ApiResponse(200, videos, "Query matched")
    )
})

export {
    uploadVideo,
    getVideoDetails,
    updateVideoDetails,
    deleteVideo,
    getAllVideos,
    searchVideos
}