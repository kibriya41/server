"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.updateUserProfile = updateUserProfile;
exports.changeUserRole = changeUserRole;
exports.removeUser = removeUser;
const user_service_js_1 = require("../services/user.service.js");
const user_validator_js_1 = require("../validators/user.validator.js");
async function getUsers(_req, res) {
    try {
        const users = await (0, user_service_js_1.getAllUsers)();
        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users,
        });
    }
    catch {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve users",
        });
    }
}
async function getUser(req, res) {
    try {
        const id = req.params.id;
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
        const user = await (0, user_service_js_1.getUserById)(id);
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
            message: "Failed to retrieve user",
        });
    }
}
async function updateUserProfile(req, res) {
    try {
        const id = req.params.id;
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
        const validatedData = user_validator_js_1.updateUserSchema.parse(req.body);
        const user = await (0, user_service_js_1.updateUser)(id, validatedData);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
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
            message: "Failed to update user",
        });
    }
}
async function changeUserRole(req, res) {
    try {
        const id = req.params.id;
        const validatedData = user_validator_js_1.updateUserRoleSchema.parse(req.body);
        const user = await (0, user_service_js_1.updateUserRole)(id, validatedData.role);
        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: user,
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
            message: "Failed to update user role",
        });
    }
}
async function removeUser(req, res) {
    try {
        const id = req.params.id;
        const user = await (0, user_service_js_1.deleteUser)(id);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
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
            message: "Failed to delete user",
        });
    }
}
