import { Router } from "express";
import { upload } from "../middlewares/file.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, getAllVideos, getVideoDetails, searchVideos, updateVideoDetails, uploadVideo } from "../controllers/video.controller.js";

const router = Router()

router.route("/upload-video").post(verifyJWT, upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videoFile", maxCount: 1 }
]), uploadVideo)
router.route("/video-details/:id").get(verifyJWT, getVideoDetails)
router.route("/update-video-details/:id").patch(verifyJWT, updateVideoDetails)
router.route("/delete/:id").delete(verifyJWT, deleteVideo)
router.route("/all-videos").get(verifyJWT, getAllVideos)
router.route("/search").get(verifyJWT, searchVideos)

export default router