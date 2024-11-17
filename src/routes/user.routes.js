import { Router } from "express";
import { registerUser } from "../controllers/registerUser.controller.js";
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

export { router as userRouter };
