import { Router } from "express";
import { verifyJWt } from "../middelwares/authenticate.middelware.js";
import {
  addVideoToPlayList,
  createPlayList,
  deltePlayList,
  getPlayListById,
  getPlayListByOwner,
  removeVideoFromPlayList,
  updatePlayList,
} from "../controllers/playList.controller.js";

const playListRoutes = Router();

playListRoutes.use(verifyJWt);

playListRoutes.route("/").post(createPlayList).get(getPlayListByOwner);

playListRoutes
  .route("/:playListId")
  .get(getPlayListById)
  .patch(updatePlayList)
  .delete(deltePlayList);

playListRoutes.route("/add/:playListId/:videoId").patch(addVideoToPlayList);

playListRoutes.route("/remove/:playListId/:videoId").patch(removeVideoFromPlayList);

export { playListRoutes };
