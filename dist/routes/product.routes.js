"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_js_1 = require("../controllers/product.controller.js");
const review_controller_js_1 = require("../controllers/review.controller.js");
const auth_middleware_js_1 = require("../middleware/auth.middleware.js");
const admin_middleware_js_1 = require("../middleware/admin.middleware.js");
const router = (0, express_1.Router)();
// Product CRUD
router.get("/", product_controller_js_1.getProducts);
router.get("/:id", product_controller_js_1.getProduct);
router.post("/", auth_middleware_js_1.authMiddleware, admin_middleware_js_1.adminMiddleware, product_controller_js_1.createProductController);
router.patch("/:id", auth_middleware_js_1.authMiddleware, admin_middleware_js_1.adminMiddleware, product_controller_js_1.updateProductController);
router.delete("/:id", auth_middleware_js_1.authMiddleware, admin_middleware_js_1.adminMiddleware, product_controller_js_1.removeProduct);
// Nested Product Reviews
router.post("/:productId/reviews", auth_middleware_js_1.authMiddleware, review_controller_js_1.createReviewController);
router.get("/:productId/reviews", review_controller_js_1.getReviewsController);
exports.default = router;
