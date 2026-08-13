"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductController = createProductController;
exports.getProducts = getProducts;
exports.getProduct = getProduct;
exports.updateProductController = updateProductController;
exports.removeProduct = removeProduct;
const product_service_js_1 = require("../services/product.service.js");
const product_validator_js_1 = require("../validators/product.validator.js");
async function createProductController(req, res) {
    try {
        const validatedData = product_validator_js_1.createProductSchema.parse(req.body);
        const product = await (0, product_service_js_1.createProduct)(validatedData);
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
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
            message: "Failed to create product",
        });
    }
}
async function getProducts(req, res) {
    try {
        const { page, limit, search, categoryId, status, minPrice, maxPrice } = req.query;
        const result = await (0, product_service_js_1.getAllProducts)({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search: search ? String(search) : undefined,
            categoryId: categoryId ? String(categoryId) : undefined,
            status: status ? String(status) : undefined,
            minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
            maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
        });
        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: result.products,
            pagination: result.pagination,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products",
        });
    }
}
async function getProduct(req, res) {
    try {
        const id = req.params.id;
        const product = await (0, product_service_js_1.getProductById)(id);
        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product,
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
            message: "Failed to retrieve product",
        });
    }
}
async function updateProductController(req, res) {
    try {
        const id = req.params.id;
        const validatedData = product_validator_js_1.updateProductSchema.parse(req.body);
        const product = await (0, product_service_js_1.updateProduct)(id, validatedData);
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
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
            message: "Failed to update product",
        });
    }
}
async function removeProduct(req, res) {
    try {
        const id = req.params.id;
        const product = await (0, product_service_js_1.deleteProduct)(id);
        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product,
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
            message: "Failed to delete product",
        });
    }
}
