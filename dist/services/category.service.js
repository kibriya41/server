"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
exports.getAllCategories = getAllCategories;
exports.getCategoryById = getCategoryById;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const slug_js_1 = require("../lib/slug.js");
async function createCategory(name, description) {
    const normalizedName = name.trim().replace(/\s+/g, " ");
    const slug = (0, slug_js_1.createSlug)(normalizedName);
    const existingCategory = await prisma_js_1.default.category.findFirst({
        where: {
            name: {
                equals: normalizedName,
                mode: "insensitive",
            },
            isDeleted: false,
        },
    });
    if (existingCategory) {
        throw new Error("Category already exists");
    }
    const existingSlug = await prisma_js_1.default.category.findFirst({
        where: {
            slug,
            isDeleted: false,
        },
    });
    if (existingSlug) {
        throw new Error("Category slug already exists");
    }
    return prisma_js_1.default.category.create({
        data: {
            name: normalizedName,
            slug,
            description: description || null,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
async function getAllCategories() {
    return prisma_js_1.default.category.findMany({
        where: {
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}
async function getCategoryById(categoryId) {
    const category = await prisma_js_1.default.category.findFirst({
        where: {
            id: categoryId,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!category) {
        throw new Error("Category not found");
    }
    return category;
}
async function updateCategory(categoryId, data) {
    const existingCategory = await prisma_js_1.default.category.findFirst({
        where: {
            id: categoryId,
            isDeleted: false,
        },
    });
    if (!existingCategory) {
        throw new Error("Category not found");
    }
    const updateData = {};
    if (data.name) {
        const normalizedName = data.name.trim().replace(/\s+/g, " ");
        const slug = (0, slug_js_1.createSlug)(normalizedName);
        const duplicateName = await prisma_js_1.default.category.findFirst({
            where: {
                name: {
                    equals: normalizedName,
                    mode: "insensitive",
                },
                id: {
                    not: categoryId,
                },
                isDeleted: false,
            },
        });
        if (duplicateName) {
            throw new Error("Category name already exists");
        }
        updateData.name = normalizedName;
        updateData.slug = slug;
    }
    if (data.description !== undefined) {
        updateData.description = data.description;
    }
    return prisma_js_1.default.category.update({
        where: {
            id: categoryId,
        },
        data: updateData,
        select: {
            id: true,
            name: true,
            slug: true,
            description: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
async function deleteCategory(categoryId) {
    const existingCategory = await prisma_js_1.default.category.findFirst({
        where: {
            id: categoryId,
            isDeleted: false,
        },
    });
    if (!existingCategory) {
        throw new Error("Category not found");
    }
    return prisma_js_1.default.category.update({
        where: {
            id: categoryId,
        },
        data: {
            isDeleted: true,
        },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });
}
