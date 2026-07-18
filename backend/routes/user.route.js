import express from "express";
import rateLimit from "express-rate-limit";
import {
    checkUser,
    deleteUser,
    getProfile,
    listAllUsers,
    login,
    logout,
    logoutAllSessions,
    register,
    updateProfile,
} from "../controllers/user.controller.js";
import {
    authenticateToken,
    authorizeRoles,
} from "../middlewares/auth.middleware.js";

export const userRouter = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
});

userRouter.post("/register", register);
userRouter.post("/login", authLimiter, login);
userRouter.get("/profile", authenticateToken, getProfile);
userRouter.put("/profile", authenticateToken, updateProfile);
userRouter.get("/", authenticateToken, authorizeRoles("admin"), listAllUsers);
userRouter.delete("/:id", authenticateToken, authorizeRoles("admin"), deleteUser);
userRouter.post("/logout", authenticateToken, logout);
userRouter.post("/logout-all-sessions", authenticateToken, logoutAllSessions);
userRouter.get("/check-user", authenticateToken, checkUser);