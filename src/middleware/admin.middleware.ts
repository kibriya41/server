import { NextFunction, Response } from "express";
import prisma from "../lib/prisma.js";
import { AuthRequest } from "./auth.middleware.js";

export async function adminMiddleware(
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

    const user = await prisma.user.findFirst({
      where: {
        id: req.userId,
        isDeleted: false,
      },
      select: {
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}