import { Router } from "express";
import { userRegister, userLogin, userLogout, refreshAccessToken, updateUserDetails, updateUserAvatar, updateUserCoverImage, updateUserPassword, getCurrentUser, getUserChannelDetails, getUserWatchHistory } from "../controllers/User.controller.js";
import { upload } from "../middlewares/file.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ])
    , userRegister);

router.route("/login").post(userLogin);
router.route("/refresh-token").post(refreshAccessToken)

// secure routes
router.route("/logout").post(verifyJWT, userLogout)
router.route("/update-profile").patch(verifyJWT, updateUserDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)
router.route("/update-password").patch(verifyJWT, updateUserPassword)
router.route("current-user").get(verifyJWT, getCurrentUser)
router.route("/channel/:userName").get(verifyJWT, getUserChannelDetails)
router.route("/history").get(verifyJWT, getUserWatchHistory)


export default router;