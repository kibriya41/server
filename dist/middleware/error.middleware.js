"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const zod_1 = require("zod");
const app_error_js_1 = require("../lib/app-error.js");
function errorMiddleware(err, _req, res, _next) {
    if (err instanceof app_error_js_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    if (err instanceof zod_1.ZodError) {
        const message = err.issues.map((issue) => issue.message).join(", ") || "Validation failed";
        return res.status(400).json({
            success: false,
            message,
        });
    }
    if (err instanceof Error) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
}
