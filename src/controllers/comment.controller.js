import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiErrors";
import { Comment } from "../models/Comment.model.js";

const createComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { videoId } = req.params
    if (!content) {
        throw new ApiError(401, "Content is required")
    }
    const comment = Comment.create({
        content: content,
        video: videoId,
        commentedBy: req.user._id
    })

    if (!comment) {
        throw new ApiError(401, "Problem in creating")
    }

    res.status(200).json(
        new ApiResponse(200, comment, "Comment is created")
    )
})

const getAllComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        populate: { path: "commentedBy", select: "userName fullName avatar" }
    }
    const filter = {}
    if (videoId) {
        filter.video = videoId
    }


    const comments = await Comment.paginate(filter, options)
    if (!comments) {
        throw new ApiError(401, "There is a problem in fetching the comments")
    }

    res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    const { updatedContent } = req.body
    const { commentId } = req.params;

    if (!updatedContent) {
        throw new ApiError(401, "updated content is not available")
    }
    if (!commentId) {
        throw new ApiError(401, "tweet Id is not available")
    }

    const comment = await Comment.findByIdAndUpdate(commentId, [
        {
            $set: {
                content: updatedContent
            }
        }
    ], {
        new: true
    })
    if (!comment) {
        throw new ApiError(401, "There is problem while updating tweet")
    }

    res.status(200).json(
        new ApiResponse(200, comment, "Tweet is updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!commentId) {
        throw new ApiError(401, "tweet id is not available")
    }
    const response = await Tweet.findByIdAndDelete(commentId);
    if (!response) {
        throw new ApiError(401, "Tweet is not valid")
    }

    res.status(200).json(
        new ApiResponse(200, {}, "Tweet is deleted successfully")
    )

})

export {
    createComment,
    getAllComments,
    updateComment,
    deleteComment
}