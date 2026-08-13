"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviewController = createReviewController;
exports.getReviewsController = getReviewsController;
exports.updateReviewController = updateReviewController;
exports.removeReviewController = removeReviewController;
const review_service_js_1 = require("../services/review.service.js");
const review_validator_js_1 = require("../validators/review.validator.js");
async function createReviewController(req, res) {
    try {
        const productId = req.params.productId;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const validatedData = review_validator_js_1.createReviewSchema.parse(req.body);
        const review = await (0, review_service_js_1.createReview)(userId, productId, validatedData.rating, validatedData.comment);
        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: review,
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
            message: "Failed to create review",
        });
    }
}
async function getReviewsController(req, res) {
    try {
        const productId = req.params.productId;
        const { page, limit } = req.query;
        const result = await (0, review_service_js_1.getProductReviews)(productId, page ? Number(page) : undefined, limit ? Number(limit) : undefined);
        return res.status(200).json({
            success: true,
            message: "Reviews retrieved successfully",
            data: result.reviews,
            pagination: result.pagination,
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
            message: "Failed to retrieve reviews",
        });
    }
}
async function updateReviewController(req, res) {
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
        const validatedData = review_validator_js_1.updateReviewSchema.parse(req.body);
        const review = await (0, review_service_js_1.updateReview)(id, userId, userRole, validatedData);
        return res.status(200).json({
            success: true,
            message: "Review updated successfully",
            data: review,
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
            message: "Failed to update review",
        });
    }
}
async function removeReviewController(req, res) {
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
        const review = await (0, review_service_js_1.deleteReview)(id, userId, userRole);
        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: review,
        });
    }
    catch (error) {
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
