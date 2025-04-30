import bcrypt, { hash } from "bcryptjs";
import { db } from "../../libs/db.js";
import { Router } from "express";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  // get the data from req

  const { email, password, name } = req.body;

  try {
    // check if user already exist and return error
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User is already exists",
      });
    }

    // if user not exists then hash the password and create user in db

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.USER,
      },
    });

    // JWT token created
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "developement",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      success: true,
      message: "User created Succesfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        emai: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.error("Error in creating User : ", error);
    res.status(201).json({
      error: "Error in creating User",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error Logging user:", error);
    res.status(500).json({
      error: "Error logging in user",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    res.status(200).json({
      success: true,
      message: "User logged out Succesfully",
    });
  } catch (error) {
    console.error("Error Logging Out user:", error);
    res.status(500).json({
      error: "Error logging Out in user",
    });
  }
};
export const check = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User is authenticated Successfully",
      user: req.user,
    });
  } catch (error) {
    console.error("Error checking User:", error);
    res.status(500).json({
      error: "Error checking User",
    });
  }
};
