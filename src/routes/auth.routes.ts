import { Router } from "express";
import { loginSchema, signupSchema } from "../validations/auth.validation";
import { validate } from "../middleware/validation.middleware";
import { login, signup } from "../controllers/auth.controller";

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post("/signup", validate(signupSchema), signup);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post("/login", validate(loginSchema), login);

export default router;
