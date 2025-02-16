import { Router } from "express";
import { userRegister } from "../controllers/User.controller.js";
import { upload } from "../middlewares/file.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ])
    , userRegister);

export default router;