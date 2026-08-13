import { Request, Response } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";

export async function createProductController(req: Request, res: Response) {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await createProduct(validatedData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
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
      message: "Failed to create product",
    });
  }
}

export async function getProducts(req: Request, res: Response) {
  try {
    const { page, limit, search, categoryId, status, minPrice, maxPrice } = req.query;

    const result = await getAllProducts({
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
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
}

export async function getProduct(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const product = await getProductById(id);

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
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
      message: "Failed to retrieve product",
    });
  }
}

export async function updateProductController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const validatedData = updateProductSchema.parse(req.body);
    const product = await updateProduct(id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
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
      message: "Failed to update product",
    });
  }
}

export async function removeProduct(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const product = await deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: product,
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
      message: "Failed to delete product",
    });
  }
}
