import { Router } from "express";
import { verifyJWt } from "../middelwares/authenticate.middelware.js";
import {
  deleteVideo,
  geAllVideoes,
  getVideoById,
  publishVideo,
  toggelPublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { upload } from "../middelwares/multer.middelware.js";

const videoRoutes = Router();

videoRoutes
  .route("/")
  .get(geAllVideoes)
  .post(
    verifyJWt,
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    publishVideo,
  );

videoRoutes
  .route("/:videoId")
  .get(verifyJWt, getVideoById)
  .patch(
    verifyJWt,
    upload.fields([
      {
        name: "video",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    updateVideo,
  )
  .delete(verifyJWt, deleteVideo);

videoRoutes.route("/toggel/:videoId").patch(verifyJWt, toggelPublishStatus);

export { videoRoutes };
