import prisma from "../lib/prisma.js";

export async function createReview(
  userId: string,
  productId: string,
  rating: number,
  comment: string
) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isDeleted: false,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      productId,
      isDeleted: false,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  return prisma.review.create({
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

export async function getProductReviews(
  productId: string,
  pageParam?: number,
  limitParam?: number
) {
  const product = await prisma.product.findFirst({
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
    prisma.review.count({ where }),
    prisma.review.findMany({
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

export async function updateReview(
  reviewId: string,
  userId: string,
  userRole: string,
  data: { rating?: number; comment?: string }
) {
  const review = await prisma.review.findFirst({
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

  return prisma.review.update({
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

export async function deleteReview(
  reviewId: string,
  userId: string,
  userRole: string
) {
  const review = await prisma.review.findFirst({
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

  return prisma.review.update({
    where: { id: reviewId },
    data: { isDeleted: true },
    select: {
      id: true,
      productId: true,
    },
  });
}
