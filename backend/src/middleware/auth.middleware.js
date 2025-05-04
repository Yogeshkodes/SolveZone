import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized - No token provided",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized - Invalid token",
      });
    }

    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        image: true,
        name: true,
        role: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Error authenticating user" });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const userID = req.user.id;

    const user = await db.user.findUnique({
      where: {
        id: userID,
      },
      select: {
        role: true,
      },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden access - Admin accesss only",
      });
    }

    next();
  } catch (error) {
    console.error("Error checing admin role :", error);
    res.status(500).json({ message: "Error checking admin role" });
  }
};
