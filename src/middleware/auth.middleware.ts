import {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";


// What our JWT contains
interface JwtPayload {
  userId: string;
  role: "USER" | "ADMIN";
}


// Add these properties to Express Request
export interface AuthRequest extends Request {
  userId?: string;
  userRole?: "USER" | "ADMIN";
}


export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {

    // ==========================================
    // 1. Get Authorization Header
    // ==========================================

    const authHeader =
      req.headers.authorization;


    // ==========================================
    // 2. Check if token exists
    // ==========================================

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }


    // ==========================================
    // 3. Extract token
    // ==========================================

    const token =
      authHeader.split(" ")[1];


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }


    // ==========================================
    // 4. Get JWT secret
    // ==========================================

    const secret =
      process.env.JWT_SECRET;


    if (!secret) {
      throw new Error(
        "JWT_SECRET is not configured"
      );
    }


    // ==========================================
    // 5. Verify JWT
    // ==========================================

    const decoded =
      jwt.verify(
        token,
        secret
      ) as JwtPayload;


    // ==========================================
    // 6. Store user information in request
    // ==========================================

    req.userId =
      decoded.userId;

    req.userRole =
      decoded.role;


    // ==========================================
    // 7. Continue to controller
    // ==========================================

    next();

  } catch {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }
}