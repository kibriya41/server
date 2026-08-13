"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters"),
    email: zod_1.z
        .string()
        .email("Please provide a valid email"),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must not exceed 100 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .email("Please provide a valid email"),
    password: zod_1.z
        .string()
        .min(1, "Password is required"),
});
