import { Router } from "express";
import { userRegister, userLogin, userLogout, refreshAccessToken } from "../controllers/User.controller.js";
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

// secure routes
router.route("/logout").post(verifyJWT, userLogout)
router.route("/refresh-token", refreshAccessToken)

export default router;