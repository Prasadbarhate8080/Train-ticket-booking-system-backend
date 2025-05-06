import { Router } from "express";
import { registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser
 } from "../controllers/user.controller.js";

const userRoutes = Router();
import multer from "multer";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const upload = multer();

userRoutes.route("/register").post(upload.none(),registerUser)
userRoutes.route("/login").post(loginUser)
userRoutes.route("/logout").post(verifyJWT,logoutUser)
userRoutes.route("/current-user").get(verifyJWT,getCurrentUser)

export {userRoutes};