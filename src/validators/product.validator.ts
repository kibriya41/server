import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").trim(),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int("Stock must be an integer").min(0, "Stock cannot be negative"),
  image: z.string().url("Image must be a valid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category ID is required"),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters").trim().optional(),
  description: z.string().optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  stock: z.number().int("Stock must be an integer").min(0, "Stock cannot be negative").optional(),
  image: z.string().url("Image must be a valid URL").optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category ID is required").optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
});
