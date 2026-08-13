"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = getAllUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.updateUserRole = updateUserRole;
exports.deleteUser = deleteUser;
const prisma_js_1 = __importDefault(require("../lib/prisma.js"));
async function getAllUsers() {
    return prisma_js_1.default.user.findMany({
        where: {
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
        orderBy: {
            createdAt: "desc",
        },
    });
}
async function getUserById(userId) {
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
async function updateUser(userId, data) {
    const existingUser = await prisma_js_1.default.user.findFirst({
        where: {
            id: userId,
            isDeleted: false,
        },
    });
    if (!existingUser) {
        throw new Error("User not found");
    }
    if (data.email) {
        const normalizedEmail = data.email.toLowerCase().trim();
        const emailExists = await prisma_js_1.default.user.findFirst({
            where: {
                email: normalizedEmail,
                id: {
                    not: userId,
                },
                isDeleted: false,
            },
        });
        if (emailExists) {
            throw new Error("Email is already in use");
        }
        data.email = normalizedEmail;
    }
    return prisma_js_1.default.user.update({
        where: {
            id: userId,
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}
async function updateUserRole(userId, role) {
    const user = await prisma_js_1.default.user.findFirst({
        where: {
            id: userId,
            isDeleted: false,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return prisma_js_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            role,
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
}
async function deleteUser(userId) {
    const user = await prisma_js_1.default.user.findFirst({
        where: {
            id: userId,
            isDeleted: false,
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return prisma_js_1.default.user.update({
        where: {
            id: userId,
        },
        data: {
            isDeleted: true,
        },
        select: {
            id: true,
            name: true,
            email: true,
        },
    });
}
