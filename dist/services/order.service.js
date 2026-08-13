"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = createOrder;
exports.getOrders = getOrders;
exports.getOrderById = getOrderById;
exports.updateOrderStatus = updateOrderStatus;
exports.deleteOrder = deleteOrder;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const client_1 = require("@prisma/client");
async function createOrder(userId, items) {
    return prisma_js_1.default.$transaction(async (tx) => {
        let totalAmount = 0;
        const orderItemsToCreate = [];
        for (const item of items) {
            const product = await tx.product.findFirst({
                where: {
                    id: item.productId,
                    isDeleted: false,
                },
            });
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }
            if (product.status !== client_1.ProductStatus.ACTIVE) {
                throw new Error(`Product "${product.name}" is not currently available for purchase`);
            }
            if (product.stock < item.quantity) {
                throw new Error("Insufficient stock");
            }
            const itemPrice = Number(product.price);
            const subtotal = itemPrice * item.quantity;
            totalAmount += subtotal;
            orderItemsToCreate.push({
                productId: product.id,
                quantity: item.quantity,
                price: itemPrice,
            });
            // Update product stock and status
            const newStock = product.stock - item.quantity;
            const newStatus = newStock === 0 ? client_1.ProductStatus.OUT_OF_STOCK : product.status;
            await tx.product.update({
                where: { id: product.id },
                data: {
                    stock: newStock,
                    status: newStatus,
                },
            });
        }
        // Create Order and OrderItems
        const order = await tx.order.create({
            data: {
                userId,
                totalAmount,
                status: client_1.OrderStatus.PENDING,
                items: {
                    create: orderItemsToCreate,
                },
            },
            select: {
                id: true,
                totalAmount: true,
                status: true,
                createdAt: true,
                items: {
                    select: {
                        id: true,
                        productId: true,
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });
        return order;
    });
}
async function getOrders(userId, userRole, pageParam, limitParam) {
    const page = Math.max(1, Number(pageParam) || 1);
    const rawLimit = Number(limitParam) || 10;
    const limit = Math.min(50, Math.max(1, rawLimit));
    const skip = (page - 1) * limit;
    const where = {
        isDeleted: false,
    };
    if (userRole !== "ADMIN") {
        where.userId = userId;
    }
    const [total, orders] = await Promise.all([
        prisma_js_1.default.order.count({ where }),
        prisma_js_1.default.order.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                totalAmount: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                items: {
                    select: {
                        id: true,
                        productId: true,
                        quantity: true,
                        price: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);
    return {
        orders,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
}
async function getOrderById(orderId, userId, userRole) {
    const order = await prisma_js_1.default.order.findFirst({
        where: {
            id: orderId,
            isDeleted: false,
        },
        select: {
            id: true,
            totalAmount: true,
            status: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            items: {
                select: {
                    id: true,
                    productId: true,
                    quantity: true,
                    price: true,
                    product: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        },
                    },
                },
            },
        },
    });
    if (!order) {
        throw new Error("Order not found");
    }
    if (order.userId !== userId && userRole !== "ADMIN") {
        throw new Error("You can only view your own order");
    }
    return order;
}
async function updateOrderStatus(orderId, newStatus) {
    const existingOrder = await prisma_js_1.default.order.findFirst({
        where: {
            id: orderId,
            isDeleted: false,
        },
        include: {
            items: true,
        },
    });
    if (!existingOrder) {
        throw new Error("Order not found");
    }
    const currentStatus = existingOrder.status;
    // Invalid state transitions check
    if (currentStatus === client_1.OrderStatus.DELIVERED && newStatus === client_1.OrderStatus.PENDING) {
        throw new Error("Cannot revert a DELIVERED order to PENDING");
    }
    if (currentStatus === client_1.OrderStatus.CANCELLED && newStatus === client_1.OrderStatus.SHIPPED) {
        throw new Error("Cannot ship a CANCELLED order");
    }
    // Handle order cancellation stock restoration in a transaction
    if (newStatus === client_1.OrderStatus.CANCELLED && currentStatus !== client_1.OrderStatus.CANCELLED) {
        return prisma_js_1.default.$transaction(async (tx) => {
            for (const item of existingOrder.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId },
                });
                if (product) {
                    const restoredStock = product.stock + item.quantity;
                    const restoredStatus = product.status === client_1.ProductStatus.OUT_OF_STOCK && restoredStock > 0
                        ? client_1.ProductStatus.ACTIVE
                        : product.status;
                    await tx.product.update({
                        where: { id: product.id },
                        data: {
                            stock: restoredStock,
                            status: restoredStatus,
                        },
                    });
                }
            }
            return tx.order.update({
                where: { id: orderId },
                data: { status: newStatus },
                select: {
                    id: true,
                    totalAmount: true,
                    status: true,
                    updatedAt: true,
                },
            });
        });
    }
    return prisma_js_1.default.order.update({
        where: { id: orderId },
        data: { status: newStatus },
        select: {
            id: true,
            totalAmount: true,
            status: true,
            updatedAt: true,
        },
    });
}
async function deleteOrder(orderId) {
    const existingOrder = await prisma_js_1.default.order.findFirst({
        where: {
            id: orderId,
            isDeleted: false,
        },
    });
    if (!existingOrder) {
        throw new Error("Order not found");
    }
    return prisma_js_1.default.order.update({
        where: { id: orderId },
        data: { isDeleted: true },
        select: {
            id: true,
            status: true,
        },
    });
}
