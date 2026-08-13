import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int("Quantity must be an integer").min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});
