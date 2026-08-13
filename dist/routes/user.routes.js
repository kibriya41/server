"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_js_1 = require("../controllers/user.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const admin_middleware_js_1 = require("../middleware/admin.middleware.js");
const router = (0, express_1.Router)();
// ==========================================
// GET ALL USERS
// ADMIN ONLY
// ==========================================
router.get("/", auth_middleware_js_1.authMiddleware, admin_middleware_js_1.adminMiddleware, user_controller_js_1.getUsers);
// ==========================================
// GET USER BY ID
// USER = OWN PROFILE
// ADMIN = ANY PROFILE
// ==========================================
router.get("/:id", auth_middleware_js_1.authMiddleware, user_controller_js_1.getUser);
// ==========================================
// UPDATE USER
// USER = OWN PROFILE
// ADMIN = ANY PROFILE
// ==========================================
router.patch("/:id", auth_middleware_js_1.authMiddleware, user_controller_js_1.updateUserProfile);
// ==========================================
// CHANGE ROLE
// ADMIN ONLY
// ==========================================
router.patch("/:id/role", auth_middleware_js_1.authMiddleware, admin_middleware_js_1.adminMiddleware, user_controller_js_1.changeUserRole);
// ==========================================
// DELETE USER
// ADMIN ONLY
// ==========================================
router.delete("/:id", auth_middleware_js_1.authMiddleware, admin_middleware_js_1.adminMiddleware, user_controller_js_1.removeUser);
exports.default = router;
