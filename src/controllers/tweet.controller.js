import asyncHandler from "../utils/asyncHandler.js";
import { Tweet } from "../models/Tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiErrors";


const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) {
        throw new ApiError(401, "Content field is required")
    }

    const tweet = await Tweet.create({
        content: content,
        owner: req.user?._id
    })
    if (!tweet) {
        throw new ApiError(400, "Couldn't create tweet")
    }


    res.status(200).json(
        new ApiResponse(200, tweet, "Tweet is created successfully")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.user._id

    const tweets = await Tweet.findById(userId)

    if (!tweets) {
        throw new ApiError(401, "There is error while fetching tweets")
    }

    res.status(200).json(
        new ApiResponse(200, tweets, "Tweets fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    const { updatedContent } = req.body
    const { tweetId } = req.params;

    if (!updatedContent) {
        throw new ApiError(401, "updated content is not available")
    }
    if (!tweetId) {
        throw new ApiError(401, "tweet Id is not available")
    }

    const tweet = await Tweet.findByIdAndUpdate(tweetId, [
        {
            $set: {
                content: updatedContent
            }
        }
    ], {
        new: true
    })
    if (!tweet) {
        throw new ApiError(401, "There is problem while updating tweet")
    }

    res.status(200).json(
        new ApiResponse(200, tweet, "Tweet is updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId) {
        throw new ApiError(401, "tweet id is not available")
    }
    const response = await Tweet.findByIdAndDelete(tweetId);
    if (!response) {
        throw new ApiError(401, "Tweet is not valid")
    }

    res.status(200).json(
        new ApiResponse(200, {}, "Tweet is deleted successfully")
    )

})

const searchTweets = asyncHandler(async (req, res) => {
    const { query, page = 1, limit = 1, sortBy, sortType, userId } = req.query;
    const filter = {}
    if (!query) {
        throw new ApiError(401, "Search query is not provided")
    } else {
        filter.title = query
    }
    if (userId) {
        filter.owner = userId
    }

    const sortOptions = {}
    if (sortBy) {
        sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
    }


    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: sortOptions,
        populate: { path: "owner", select: "fullName userName avatar" }
    }

    const tweets = await Tweet.paginate(filter, options)
    if (!tweets) {
        throw new ApiError(400, "No tweets matched")
    }
    res.status(200).json(
        new ApiResponse(200, tweets, "Query matched")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    searchTweets
}