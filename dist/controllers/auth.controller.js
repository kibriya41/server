"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
const auth_service_js_1 = require("../services/auth.service.js");
const auth_validator_js_1 = require("../validators/auth.validator.js");
async function register(req, res) {
    try {
        const validatedData = auth_validator_js_1.registerSchema.parse(req.body);
        const result = await (0, auth_service_js_1.registerUser)(validatedData.name, validatedData.email, validatedData.password);
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: result,
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
            message: "Something went wrong",
        });
    }
}
async function login(req, res) {
    try {
        const validatedData = auth_validator_js_1.loginSchema.parse(req.body);
        const result = await (0, auth_service_js_1.loginUser)(validatedData.email, validatedData.password);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
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
            message: "Something went wrong",
        });
    }
}
async function me(req, res) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
            });
        }
        const user = await (0, auth_service_js_1.getCurrentUser)(req.userId);
        return res.status(200).json({
            success: true,
            message: "User retrieved successfully",
            data: user,
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
            message: "Something went wrong",
        });
    }
}
