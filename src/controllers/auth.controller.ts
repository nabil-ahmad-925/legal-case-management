import { Request, Response } from "express";
import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UnauthorizedError, ConflictError } from "../utils/errors";
import logger from "../utils/logger";

const prisma = new PrismaClient();

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role as UserRole,
      },
    });

    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "your-jwt-secret",
      { expiresIn: "24h" }
    );

    logger.info(`User registered: ${newUser.email} (ID: ${newUser.id})`);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    if (error instanceof ConflictError) {
      res.status(409).json({
        success: false,
        error: { message: error.message },
      });
    } else {
      logger.error("Signup error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Server error during registration" },
      });
    }
  }
};

/**
 * @desc    Login user and return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-jwt-secret",
      { expiresIn: "24h" }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    logger.info(`User logged in: ${user.email} (ID: ${user.id})`);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({
        success: false,
        error: { message: error.message },
      });
    } else {
      logger.error("Login error:", error);
      res.status(500).json({
        success: false,
        error: { message: "Server error during login" },
      });
    }
  }
};
