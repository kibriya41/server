"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = createProduct;
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const slug_js_1 = require("../lib/slug.js");
const client_1 = require("@prisma/client");
async function createProduct(data) {
    const category = await prisma_js_1.default.category.findFirst({
        where: {
            id: data.categoryId,
            isDeleted: false,
        },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    const slug = (0, slug_js_1.createSlug)(data.name);
    const status = data.stock > 0 ? client_1.ProductStatus.ACTIVE : client_1.ProductStatus.OUT_OF_STOCK;
    return prisma_js_1.default.product.create({
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
async function getAllProducts(params) {
    const page = Math.max(1, Number(params.page) || 1);
    const rawLimit = Number(params.limit) || 10;
    const limit = Math.min(50, Math.max(1, rawLimit));
    const skip = (page - 1) * limit;
    const where = {
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
        where.status = params.status;
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
        prisma_js_1.default.product.count({ where }),
        prisma_js_1.default.product.findMany({
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
async function getProductById(id) {
    const product = await prisma_js_1.default.product.findFirst({
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
async function updateProduct(id, data) {
    const existingProduct = await prisma_js_1.default.product.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    if (data.categoryId) {
        const category = await prisma_js_1.default.category.findFirst({
            where: {
                id: data.categoryId,
                isDeleted: false,
            },
        });
        if (!category) {
            throw new Error("Category not found");
        }
    }
    const updateData = { ...data };
    if (data.name) {
        updateData.slug = (0, slug_js_1.createSlug)(data.name);
    }
    if (data.stock !== undefined) {
        if (data.stock > 0) {
            updateData.status = data.status || client_1.ProductStatus.ACTIVE;
        }
        else {
            updateData.status = client_1.ProductStatus.OUT_OF_STOCK;
        }
    }
    return prisma_js_1.default.product.update({
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
async function deleteProduct(id) {
    const existingProduct = await prisma_js_1.default.product.findFirst({
        where: {
            id,
            isDeleted: false,
        },
    });
    if (!existingProduct) {
        throw new Error("Product not found");
    }
    return prisma_js_1.default.product.update({
        where: { id },
        data: { isDeleted: true },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });
}
