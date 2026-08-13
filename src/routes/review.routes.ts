import { Router } from "express";
import {
  updateReviewController,
  removeReviewController,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.patch("/:id", authMiddleware, updateReviewController);
router.delete("/:id", authMiddleware, removeReviewController);

export default router;
