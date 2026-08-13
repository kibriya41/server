import { Router } from "express";
import {
  createCategoryController,
  getCategories,
  getCategory,
  updateCategoryController,
  removeCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategory);

router.post("/", authMiddleware, adminMiddleware, createCategoryController);
router.patch("/:id", authMiddleware, adminMiddleware, updateCategoryController);
router.delete("/:id", authMiddleware, adminMiddleware, removeCategory);

export default router;
