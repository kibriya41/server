"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReviewSchema = exports.createReviewSchema = void 0;
const zod_1 = require("zod");
exports.createReviewSchema = zod_1.z.object({
    rating: zod_1.z
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5"),
    comment: zod_1.z
        .string()
        .min(1, "Comment is required")
        .max(1000, "Comment cannot exceed 1000 characters")
        .trim(),
});
exports.updateReviewSchema = zod_1.z.object({
    rating: zod_1.z
        .number()
        .int("Rating must be an integer")
        .min(1, "Rating must be between 1 and 5")
        .max(5, "Rating must be between 1 and 5")
        .optional(),
    comment: zod_1.z
        .string()
        .min(1, "Comment is required")
        .max(1000, "Comment cannot exceed 1000 characters")
        .trim()
        .optional(),
});
