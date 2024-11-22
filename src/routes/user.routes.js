import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUSerChannelProfile,
  getWatchHistory,
  logInUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
} from "../controllers/registerUser.controller.js";
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

router.route("/logout").post(verifyJWt, logOutUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWt, changeCurrentPassword);

router.route("/current-user").get(verifyJWt, getCurrentUser);

router.route("/update-user").patch(verifyJWt, updateAccountDetails);

router
  .route("/update-avatar")
  .patch(verifyJWt, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-coverimage")
  .patch(verifyJWt, upload.single("coverimage"), updateUserCoverImage);

router.route("/c/:username").get(verifyJWt, getUSerChannelProfile);

router.route("/watchhistory").get(verifyJWt, getWatchHistory);

export { router as userRouter };
