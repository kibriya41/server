"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    try {
        // ==========================================
        // 1. Get Authorization Header
        // ==========================================
        const authHeader = req.headers.authorization;
        // ==========================================
        // 2. Check if token exists
        // ==========================================
        if (!authHeader ||
            !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        // ==========================================
        // 3. Extract token
        // ==========================================
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing",
            });
        }
        // ==========================================
        // 4. Get JWT secret
        // ==========================================
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }
        // ==========================================
        // 5. Verify JWT
        // ==========================================
        const decoded = jsonwebtoken_1.default.verify(token, secret);
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
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
}
