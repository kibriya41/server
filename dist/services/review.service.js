"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = createReview;
exports.getProductReviews = getProductReviews;
exports.updateReview = updateReview;
exports.deleteReview = deleteReview;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
async function createReview(userId, productId, rating, comment) {
    const product = await prisma_js_1.default.product.findFirst({
        where: {
            id: productId,
            isDeleted: false,
        },
    });
    if (!product) {
        throw new Error("Product not found");
    }
    const existingReview = await prisma_js_1.default.review.findFirst({
        where: {
            userId,
            productId,
            isDeleted: false,
        },
    });
    if (existingReview) {
        throw new Error("You have already reviewed this product");
    }
    return prisma_js_1.default.review.create({
        data: {
            rating,
            comment,
            userId,
            productId,
        },
        select: {
            id: true,
            rating: true,
            comment: true,
            productId: true,
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
    });
}
async function getProductReviews(productId, pageParam, limitParam) {
    const product = await prisma_js_1.default.product.findFirst({
        where: {
            id: productId,
            isDeleted: false,
        },
    });
    if (!product) {
        throw new Error("Product not found");
    }
    const page = Math.max(1, Number(pageParam) || 1);
    const rawLimit = Number(limitParam) || 10;
    const limit = Math.min(50, Math.max(1, rawLimit));
    const skip = (page - 1) * limit;
    const where = {
        productId,
        isDeleted: false,
    };
    const [total, reviews] = await Promise.all([
        prisma_js_1.default.review.count({ where }),
        prisma_js_1.default.review.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                rating: true,
                comment: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdAt: true,
                updatedAt: true,
            },
        }),
    ]);
    return {
        reviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
}
async function updateReview(reviewId, userId, userRole, data) {
    const review = await prisma_js_1.default.review.findFirst({
        where: {
            id: reviewId,
            isDeleted: false,
        },
    });
    if (!review) {
        throw new Error("Review not found");
    }
    if (review.userId !== userId && userRole !== "ADMIN") {
        throw new Error("You can only edit your own review");
    }
    return prisma_js_1.default.review.update({
        where: { id: reviewId },
        data,
        select: {
            id: true,
            rating: true,
            comment: true,
            productId: true,
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
            createdAt: true,
            updatedAt: true,
        },
    });
}
async function deleteReview(reviewId, userId, userRole) {
    const review = await prisma_js_1.default.review.findFirst({
        where: {
            id: reviewId,
            isDeleted: false,
        },
    });
    if (!review) {
        throw new Error("Review not found");
    }
    if (review.userId !== userId && userRole !== "ADMIN") {
        throw new Error("You can only delete your own review");
    }
    return prisma_js_1.default.review.update({
        where: { id: reviewId },
        data: { isDeleted: true },
        select: {
            id: true,
            productId: true,
        },
    });
}
