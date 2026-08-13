"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = adminMiddleware;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
async function adminMiddleware(req, res, next) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const user = await prisma_js_1.default.user.findFirst({
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
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
}
