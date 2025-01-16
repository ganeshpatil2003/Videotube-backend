import { Router } from "express";
import { verifyJWt } from "../middelwares/authenticate.middelware.js";
import {
  addComment,
  deleteComment,
  getCommentById,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";

const commentRoutes = Router();

commentRoutes.use(verifyJWt);

commentRoutes.route("/").post(addComment);

commentRoutes
  .route("/:commentId")
  .get(getCommentById)
  .patch(updateComment)
  .delete(deleteComment);

commentRoutes.route("/:commentId/:videoId").get(getVideoComments);

export { commentRoutes };
