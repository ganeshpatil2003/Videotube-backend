import { Router } from "express";
import { logInUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/registerUser.controller.js";
import { verifyJWt } from "../middelwares/authenticate.middelware.js";
import { upload } from "../middelwares/multer.middelware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(logInUser);

router.route('/logout').post(verifyJWt,logOutUser);

router.route("/refreshToken").post(refreshAccessToken);

export { router as userRouter };
