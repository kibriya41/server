import { Router } from "express";

import {
  getUsers,
  getUser,
  updateUserProfile,
  changeUserRole,
  removeUser,
} from "../controllers/user.controller.js";

import {
  authMiddleware,
} from "../middleware/auth.middleware.js";

import {
  adminMiddleware,
} from "../middleware/admin.middleware.js";


const router = Router();


// ==========================================
// GET ALL USERS
// ADMIN ONLY
// ==========================================

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getUsers
);


// ==========================================
// GET USER BY ID
// USER = OWN PROFILE
// ADMIN = ANY PROFILE
// ==========================================

router.get(
  "/:id",
  authMiddleware,
  getUser
);


// ==========================================
// UPDATE USER
// USER = OWN PROFILE
// ADMIN = ANY PROFILE
// ==========================================

router.patch(
  "/:id",
  authMiddleware,
  updateUserProfile
);


// ==========================================
// CHANGE ROLE
// ADMIN ONLY
// ==========================================

router.patch(
  "/:id/role",
  authMiddleware,
  adminMiddleware,
  changeUserRole
);


// ==========================================
// DELETE USER
// ADMIN ONLY
// ==========================================

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  removeUser
);


export default router;