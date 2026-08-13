"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_js_1 = __importDefault(require("./routes/auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./routes/user.routes.js"));
const category_routes_js_1 = __importDefault(require("./routes/category.routes.js"));
const product_routes_js_1 = __importDefault(require("./routes/product.routes.js"));
const review_routes_js_1 = __importDefault(require("./routes/review.routes.js"));
const order_routes_js_1 = __importDefault(require("./routes/order.routes.js"));
const error_middleware_js_1 = require("./middleware/error.middleware.js");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "E-commerce API is running",
    });
});
// Routes
app.use("/api/auth", auth_routes_js_1.default);
app.use("/api/users", user_routes_js_1.default);
app.use("/api/categories", category_routes_js_1.default);
app.use("/api/products", product_routes_js_1.default);
app.use("/api/reviews", review_routes_js_1.default);
app.use("/api/orders", order_routes_js_1.default);
// Global Error Handler
app.use(error_middleware_js_1.errorMiddleware);
exports.default = app;
