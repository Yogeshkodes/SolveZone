import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";

const executeCodeRoutes = express.Router();

executeCodeRoutes.post("/", authMiddleware, executeCode);

export default executeCodeRoutes;
