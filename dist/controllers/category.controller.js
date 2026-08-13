"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategoryController = createCategoryController;
exports.getCategories = getCategories;
exports.getCategory = getCategory;
exports.updateCategoryController = updateCategoryController;
exports.removeCategory = removeCategory;
const category_service_js_1 = require("../services/category.service.js");
const category_validator_js_1 = require("../validators/category.validator.js");
async function createCategoryController(req, res) {
    try {
        const validatedData = category_validator_js_1.createCategorySchema.parse(req.body);
        const category = await (0, category_service_js_1.createCategory)(validatedData.name, validatedData.description);
        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
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
            message: "Failed to create category",
        });
    }
}
async function getCategories(_req, res) {
    try {
        const categories = await (0, category_service_js_1.getAllCategories)();
        return res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            data: categories,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve categories",
        });
    }
}
async function getCategory(req, res) {
    try {
        const id = req.params.id;
        const category = await (0, category_service_js_1.getCategoryById)(id);
        return res.status(200).json({
            success: true,
            message: "Category retrieved successfully",
            data: category,
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
            message: "Failed to retrieve category",
        });
    }
}
async function updateCategoryController(req, res) {
    try {
        const id = req.params.id;
        const validatedData = category_validator_js_1.updateCategorySchema.parse(req.body);
        const category = await (0, category_service_js_1.updateCategory)(id, validatedData);
        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
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
            message: "Failed to update category",
        });
    }
}
async function removeCategory(req, res) {
    try {
        const id = req.params.id;
        const category = await (0, category_service_js_1.deleteCategory)(id);
        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category,
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
            message: "Failed to delete category",
        });
    }
}
