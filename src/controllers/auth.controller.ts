import { Request, Response, NextFunction } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../services/auth.service.js";
import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validatedData = registerSchema.parse(req.body);

    const result = await registerUser(
      validatedData.name,
      validatedData.email,
      validatedData.password
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(
      validatedData.email,
      validatedData.password
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await getCurrentUser(req.userId);

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
}