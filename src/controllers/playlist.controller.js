import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { Playlist } from "../models/Playlist.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, desc } = req.body
    if (!name || !desc) {
        throw new ApiError(401, "Name and description are required")
    }
    const playlist = await Playlist.create({
        name: name,
        description: desc,
        videos: [],
        owner: req.user._id
    })
    if (!playlist) {
        throw new ApiError(401, "There is problem while creating playlist")
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist is created successfully")
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new ApiError(401, "userId is not given")
    }
    const playlists = await Playlist.find({ owner: userId });

    if (!playlists) {
        throw new ApiError(401, "Problem in fetching playlists")
    }
    res.status(200).json(
        new ApiResponse(200, playlists, "Playlists fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!playlistId || !videoId) {
        throw new ApiError(401, "playlistId or videoId is not given")
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    );

    if (!playlist) {
        throw new ApiError(401, "Problem in fetching playlist")
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlists fetched successfully")
    )
})
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!playlistId || !videoId) {
        throw new ApiError(401, "playlistId or videoId is not given")
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId,
        {
            $pull: {
                videos: videoId
            }
        },
        {
            new: true
        }
    );

    if (!playlist) {
        throw new ApiError(401, "Problem in fetching playlist")
    }

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlists fetched successfully")
    )
})
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    if (!playlistId) {
        throw new ApiError(401, "playlistId is not given")
    }
    const playlist = await Playlist.findByIdAndDelete(playlistId)

    if (!playlist) {
        throw new ApiError(401, "Problem in deleting playlist")
    }

    res.status(200).json(
        new ApiResponse(200, null, "Playlist deleted successfully")
    )
})
const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { updateName, updatedDesc } = req.body;
    if (!updateName || !updatedDesc) {
        throw new ApiError(401, "Name and description are required")
    }
    if (!playlistId) {
        throw new ApiError(401, "playlistId is not given")
    }
    const playlist = await Playlist.findByIdAndUpdate(playlistId, {
        $set: {
            name: updateName,
            description: updatedDesc
        }
    }, {
        new: true
    })

    if (!playlist) {
        throw new ApiError(401, "Problem in updating playlist")
    }

    res.status(200).json(
        new ApiResponse(200, null, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}


