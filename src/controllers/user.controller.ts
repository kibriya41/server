import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  deleteUser,
} from "../services/user.service.js";
import {
  updateUserSchema,
  updateUserRoleSchema,
} from "../validators/user.validator.js";

export async function getUsers(_req: Request, res: Response) {
  try {
    const users = await getAllUsers();
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
    });
  }
}

export async function getUser(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.userId !== id && req.userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You can only view your own profile",
      });
    }

    const user = await getUserById(id);

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
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
      message: "Failed to retrieve user",
    });
  }
}

export async function updateUserProfile(req: AuthRequest, res: Response) {
  try {
    const id = req.params.id as string;

    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.userId !== id && req.userRole !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "You can only update your own profile",
      });
    }

    const validatedData = updateUserSchema.parse(req.body);
    const user = await updateUser(id, validatedData);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
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
      message: "Failed to update user",
    });
  }
}

export async function changeUserRole(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const validatedData = updateUserRoleSchema.parse(req.body);
    const user = await updateUserRole(id, validatedData.role);

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user,
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
      message: "Failed to update user role",
    });
  }
}

export async function removeUser(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const user = await deleteUser(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: user,
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
      message: "Failed to delete user",
    });
  }
}