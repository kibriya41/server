import prisma from "../lib/prisma.js";
import { createSlug } from "../lib/slug.js";
import { ProductStatus } from "../generated/prisma/index.js";

export interface GetProductsQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
  categoryId: string;
}) {
  const category = await prisma.category.findFirst({
    where: {
      id: data.categoryId,
      isDeleted: false,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  const slug = createSlug(data.name);
  const status: ProductStatus = data.stock > 0 ? ProductStatus.ACTIVE : ProductStatus.OUT_OF_STOCK;

  return prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description || null,
      price: data.price,
      stock: data.stock,
      image: data.image || null,
      status,
      categoryId: data.categoryId,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      stock: true,
      image: true,
      status: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getAllProducts(params: GetProductsQuery) {
  const page = Math.max(1, Number(params.page) || 1);
  const rawLimit = Number(params.limit) || 10;
  const limit = Math.min(50, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;

  const where: any = {
    isDeleted: false,
  };

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.categoryId) {
    where.categoryId = params.categoryId;
  }

  if (params.status) {
    where.status = params.status as ProductStatus;
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    where.price = {};
    if (params.minPrice !== undefined) {
      where.price.gte = params.minPrice;
    }
    if (params.maxPrice !== undefined) {
      where.price.lte = params.maxPrice;
    }
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        stock: true,
        image: true,
        status: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      stock: true,
      image: true,
      status: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      reviews: {
        where: { isDeleted: false },
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
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    image?: string;
    categoryId?: string;
    status?: ProductStatus;
  }
) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  if (data.categoryId) {
    const category = await prisma.category.findFirst({
      where: {
        id: data.categoryId,
        isDeleted: false,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }
  }

  const updateData: any = { ...data };

  if (data.name) {
    updateData.slug = createSlug(data.name);
  }

  if (data.stock !== undefined) {
    if (data.stock > 0) {
      updateData.status = data.status || ProductStatus.ACTIVE;
    } else {
      updateData.status = ProductStatus.OUT_OF_STOCK;
    }
  }

  return prisma.product.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      stock: true,
      image: true,
      status: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function deleteProduct(id: string) {
  const existingProduct = await prisma.product.findFirst({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  return prisma.product.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}
