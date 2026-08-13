import { Router } from "express";
import {
  createOrderController,
  getOrdersController,
  getOrderController,
  updateOrderStatusController,
  removeOrderController,
} from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = Router();

router.post("/", authMiddleware, createOrderController);
router.get("/", authMiddleware, getOrdersController);
router.get("/:id", authMiddleware, getOrderController);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateOrderStatusController);
router.delete("/:id", authMiddleware, adminMiddleware, removeOrderController);

export default router;
