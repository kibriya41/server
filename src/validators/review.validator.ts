import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(1000, "Comment cannot exceed 1000 characters")
    .trim(),
});

export const updateReviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5")
    .optional(),
  comment: z
    .string()
    .min(1, "Comment is required")
    .max(1000, "Comment cannot exceed 1000 characters")
    .trim()
    .optional(),
});
