import { Router } from "express";
import { createCase } from "../controllers/case.controller";
import { validate } from "../middleware/validation.middleware";
import { createCaseSchema } from "../validations/case.validation";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { UserRole } from "@prisma/client";

const router = Router();

/**
 * @route POST /api/cases
 * @desc Create a new legal case
 * @access Private (Lawyers and Admins only)
 */
router.post(
  "/",
  authenticate,
  authorize([UserRole.LAWYER, UserRole.ADMIN]),
  validate(createCaseSchema),
  createCase
);

export default router;
