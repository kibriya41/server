"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_js_1 = require("../controllers/review.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const router = (0, express_1.Router)();
router.patch("/:id", auth_middleware_js_1.authMiddleware, review_controller_js_1.updateReviewController);
router.delete("/:id", auth_middleware_js_1.authMiddleware, review_controller_js_1.removeReviewController);
exports.default = router;
