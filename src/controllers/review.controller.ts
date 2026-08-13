import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../services/review.service.js";
import {
  createReviewSchema,
  updateReviewSchema,
} from "../validators/review.validator.js";

export async function createReviewController(req: AuthRequest, res: Response) {
  try {
    const productId = req.params.productId as string;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const validatedData = createReviewSchema.parse(req.body);

    const review = await createReview(
      userId,
      productId,
      validatedData.rating,
      validatedData.comment
    );

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
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
      message: "Failed to create review",
    });
  }
}

export async function getReviewsController(req: Request, res: Response) {
  try {
    const productId = req.params.productId as string;
    const { page, limit } = req.query;

    const result = await getProductReviews(
      productId,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined
    );

    return res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: result.reviews,
      pagination: result.pagination,
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
      message: "Failed to retrieve reviews",
    });
  }
}

export async function updateReviewController(req: AuthRequest, res: Response) {
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

    const validatedData = updateReviewSchema.parse(req.body);
    const review = await updateReview(id, userId, userRole, validatedData);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
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
      message: "Failed to update review",
    });
  }
}

export async function removeReviewController(req: AuthRequest, res: Response) {
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

    const review = await deleteReview(id, userId, userRole);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: review,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
    });
  }
}
