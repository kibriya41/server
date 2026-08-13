"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleSchema = exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .optional(),
    email: zod_1.z
        .string()
        .email("Please provide a valid email")
        .optional(),
});
exports.updateUserRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["USER", "ADMIN"]),
});
