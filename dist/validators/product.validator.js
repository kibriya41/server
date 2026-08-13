"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
exports.createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Product name must be at least 2 characters").trim(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive("Price must be a positive number"),
    stock: zod_1.z.number().int("Stock must be an integer").min(0, "Stock cannot be negative"),
    image: zod_1.z.string().url("Image must be a valid URL").optional().or(zod_1.z.literal("")),
    categoryId: zod_1.z.string().min(1, "Category ID is required"),
});
exports.updateProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Product name must be at least 2 characters").trim().optional(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number().positive("Price must be a positive number").optional(),
    stock: zod_1.z.number().int("Stock must be an integer").min(0, "Stock cannot be negative").optional(),
    image: zod_1.z.string().url("Image must be a valid URL").optional().or(zod_1.z.literal("")),
    categoryId: zod_1.z.string().min(1, "Category ID is required").optional(),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK"]).optional(),
});
