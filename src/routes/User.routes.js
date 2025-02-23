import { Router } from "express";
import { userRegister, userLogin, userLogout } from "../controllers/User.controller.js";
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
router.route("/logout").post(verifyJWT, userLogout)

export default router;