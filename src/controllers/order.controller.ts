import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../services/order.service.js";
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from "../validators/order.validator.js";

export async function createOrderController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const validatedData = createOrderSchema.parse(req.body);
    const order = await createOrder(userId, validatedData.items);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
    });
  }
}

export async function getOrdersController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId;
    const userRole = req.userRole || "USER";

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { page, limit } = req.query;

    const result = await getOrders(
      userId,
      userRole,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined
    );

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
    });
  }
}

export async function getOrderController(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const userId = req.userId;
    const userRole = req.userRole || "USER";

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const order = await getOrderById(id, userId, userRole);

    return res.status(200).json({
      success: true,
      message: "Order retrieved successfully",
      data: order,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
    });
  }
}

export async function updateOrderStatusController(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const validatedData = updateOrderStatusSchema.parse(req.body);

    const order = await updateOrderStatus(id, validatedData.status);

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
}

export async function removeOrderController(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;
    const order = await deleteOrder(id);

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      data: order,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
    });
  }
}
