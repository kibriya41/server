"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_js_1 = __importDefault(require("./app.js"));
const prisma_js_1 = __importDefault(require("./lib/prisma.js"));
const PORT = Number(process.env.PORT) || 5000;
async function startServer() {
    try {
        await prisma_js_1.default.$connect();
        console.log("Database connected successfully");
        app_js_1.default.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
}
startServer();
