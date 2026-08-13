"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderController = createOrderController;
exports.getOrdersController = getOrdersController;
exports.getOrderController = getOrderController;
exports.updateOrderStatusController = updateOrderStatusController;
exports.removeOrderController = removeOrderController;
const order_service_js_1 = require("../services/order.service.js");
const order_validator_js_1 = require("../validators/order.validator.js");
async function createOrderController(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const validatedData = order_validator_js_1.createOrderSchema.parse(req.body);
        const order = await (0, order_service_js_1.createOrder)(userId, validatedData.items);
        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });
    }
    catch (error) {
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
async function getOrdersController(req, res) {
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
        const result = await (0, order_service_js_1.getOrders)(userId, userRole, page ? Number(page) : undefined, limit ? Number(limit) : undefined);
        return res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: result.orders,
            pagination: result.pagination,
        });
    }
    catch (error) {
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
async function getOrderController(req, res) {
    try {
        const id = req.params.id;
        const userId = req.userId;
        const userRole = req.userRole || "USER";
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const order = await (0, order_service_js_1.getOrderById)(id, userId, userRole);
        return res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            data: order,
        });
    }
    catch (error) {
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
async function updateOrderStatusController(req, res) {
    try {
        const id = req.params.id;
        const validatedData = order_validator_js_1.updateOrderStatusSchema.parse(req.body);
        const order = await (0, order_service_js_1.updateOrderStatus)(id, validatedData.status);
        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });
    }
    catch (error) {
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
async function removeOrderController(req, res) {
    try {
        const id = req.params.id;
        const order = await (0, order_service_js_1.deleteOrder)(id);
        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: order,
        });
    }
    catch (error) {
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
