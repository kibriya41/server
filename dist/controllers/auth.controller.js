"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
const auth_service_js_1 = require("../services/auth.service.js");
const auth_validator_js_1 = require("../validators/auth.validator.js");
async function register(req, res, next) {
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
        next(error);
    }
}
async function login(req, res, next) {
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
        next(error);
    }
}
async function me(req, res, next) {
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
        next(error);
    }
}
