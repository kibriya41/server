import { Request, Response } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../services/category.service.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";

export async function createCategoryController(req: Request, res: Response) {
  try {
    const validatedData = createCategorySchema.parse(req.body);
    const category = await createCategory(
      validatedData.name,
      validatedData.description
    );

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
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
      message: "Failed to create category",
    });
  }
}

export async function getCategories(_req: Request, res: Response) {
  try {
    const categories = await getAllCategories();
    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories",
    });
  }
}

export async function getCategory(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const category = await getCategoryById(id);

    return res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
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
      message: "Failed to retrieve category",
    });
  }
}

export async function updateCategoryController(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const validatedData = updateCategorySchema.parse(req.body);
    const category = await updateCategory(id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
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
      message: "Failed to update category",
    });
  }
}

export async function removeCategory(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const category = await deleteCategory(id);

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: category,
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
      message: "Failed to delete category",
    });
  }
}