import Joi from "joi";
import { UserRole } from "@prisma/client";

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least {#limit} characters long",
    "any.required": "Password is required",
  }),
  firstName: Joi.string().required().messages({
    "string.empty": "First name is required",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "string.empty": "Last name is required",
    "any.required": "Last name is required",
  }),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required()
    .messages({
      "any.only": "Role must be one of: ADMIN, LAWYER, PARALEGAL, ASSISTANT",
      "any.required": "Role is required",
    }),
});
