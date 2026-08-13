import { Router } from "express";
import {
  createProductController,
  getProducts,
  getProduct,
  updateProductController,
  removeProduct,
} from "../controllers/product.controller.js";
import {
  createReviewController,
  getReviewsController,
} from "../controllers/review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = Router();

// Product CRUD
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", authMiddleware, adminMiddleware, createProductController);
router.patch("/:id", authMiddleware, adminMiddleware, updateProductController);
router.delete("/:id", authMiddleware, adminMiddleware, removeProduct);

// Nested Product Reviews
router.post("/:productId/reviews", authMiddleware, createReviewController);
router.get("/:productId/reviews", getReviewsController);

export default router;
