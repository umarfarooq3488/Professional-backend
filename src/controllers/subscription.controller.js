import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscribe = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const alreadySubscribed = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    })
    if (alreadySubscribed) {
        await Subscription.findByIdAndDelete(alreadySubscribed)
        res.status(200).json(
            new ApiResponse(200, null, "channel is unsubscribed")
        )
    } else {
        const subscribed = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId

        })
        res.status(200).json(
            new ApiResponse(200, subscribed, "Channel is subscribed successfully")
        )
    }
})

const getChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    if (!channelId) {
        throw new ApiError(401, "Channel id is not given")
    }

    const channels = await Subscription.find({ channel: channelId })
    if (!channels) {
        throw new ApiError(401, "There is a error while fetching the channels")
    }
    res.status(200).json(
        new ApiResponse(200, channels, "Channels are fetched successfully")
    )
})
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
    if (!subscriberId) {
        throw new ApiError(401, "subscriberId is not given")
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
    if (!channels) {
        throw new ApiError(401, "There is a error while fetching the subscribed channels")
    }
    res.status(200).json(
        new ApiResponse(200, channels, "Subscribed Channels are fetched successfully")
    )
})

export {
    toggleSubscribe,
    getChannelSubscribers,
    getSubscribedChannels
}