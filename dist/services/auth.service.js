"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getCurrentUser = getCurrentUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
const jwt_js_1 = require("../lib/jwt.js");
async function registerUser(name, email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma_js_1.default.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });
    if (existingUser && !existingUser.isDeleted) {
        throw new Error("Email is already registered");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = existingUser
        ? await prisma_js_1.default.user.update({
            where: {
                id: existingUser.id,
            },
            data: {
                name,
                email: normalizedEmail,
                password: hashedPassword,
                role: "USER",
                isDeleted: false,
            },
        })
        : await prisma_js_1.default.user.create({
            data: {
                name,
                email: normalizedEmail,
                password: hashedPassword,
                role: "USER",
            },
        });
    const token = (0, jwt_js_1.generateToken)(user.id, user.role);
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
}
async function loginUser(email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await prisma_js_1.default.user.findUnique({
        where: {
            email: normalizedEmail,
        },
    });
    if (!user || user.isDeleted) {
        throw new Error("Invalid email or password");
    }
    const passwordMatch = await bcrypt_1.default.compare(password, user.password);
    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }
    const token = (0, jwt_js_1.generateToken)(user.id, user.role);
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        token,
    };
}
async function getCurrentUser(userId) {
    const user = await prisma_js_1.default.user.findFirst({
        where: {
            id: userId,
            isDeleted: false,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}
