import Joi from "joi";
import { CaseStatus, CasePriority } from "@prisma/client";

const BillingType = {
  HOURLY: "HOURLY",
  FLAT_FEE: "FLAT_FEE",
  CONTINGENCY: "CONTINGENCY",
  PRO_BONO: "PRO_BONO",
};

export const createCaseSchema = Joi.object({
  caseNumber: Joi.string().required().messages({
    "string.empty": "Case number is required",
    "any.required": "Case number is required",
  }),
  title: Joi.string().required().min(3).max(255).messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least {#limit} characters long",
    "string.max": "Title cannot exceed {#limit} characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().allow("").max(2000).messages({
    "string.max": "Description cannot exceed {#limit} characters",
  }),
  status: Joi.string()
    .required()
    .valid(...Object.values(CaseStatus))
    .messages({
      "string.empty": "Status is required",
      "any.required": "Status is required",
      "any.only": "Status must be one of: OPEN, CLOSED, PENDING, ARCHIVED",
    }),
  priority: Joi.string()
    .valid(...Object.values(CasePriority))
    .optional()
    .messages({
      "any.only": "Priority must be one of: LOW, MEDIUM, HIGH, URGENT",
    }),
  practiceArea: Joi.string().allow("").max(100).messages({
    "string.max": "Practice area cannot exceed {#limit} characters",
  }),

  clientName: Joi.string().optional().max(255).messages({
    "string.max": "Client name cannot exceed {#limit} characters",
  }),
  clientEmail: Joi.string().email().optional().messages({
    "string.email": "Client email must be a valid email address",
  }),
  clientPhone: Joi.string().optional().max(50).messages({
    "string.max": "Client phone cannot exceed {#limit} characters",
  }),
  opposingParty: Joi.string().optional().max(255).messages({
    "string.max": "Opposing party cannot exceed {#limit} characters",
  }),
  courtName: Joi.string().optional().max(255).messages({
    "string.max": "Court name cannot exceed {#limit} characters",
  }),
  judgeAssigned: Joi.string().optional().max(255).messages({
    "string.max": "Judge name cannot exceed {#limit} characters",
  }),

  filingDate: Joi.date().iso().optional().messages({
    "date.base": "Filing date must be a valid date",
    "date.format": "Filing date must be in ISO format (YYYY-MM-DD)",
  }),
  hearingDate: Joi.date().iso().optional().messages({
    "date.base": "Hearing date must be a valid date",
    "date.format": "Hearing date must be in ISO format (YYYY-MM-DD)",
  }),

  billingType: Joi.string()
    .valid(...Object.values(BillingType))
    .optional()
    .messages({
      "any.only":
        "Billing type must be one of: HOURLY, FLAT_FEE, CONTINGENCY, PRO_BONO",
    }),
  billingRate: Joi.number().optional().min(0).messages({
    "number.base": "Billing rate must be a number",
    "number.min": "Billing rate cannot be negative",
  }),
  estimatedValue: Joi.number().optional().min(0).messages({
    "number.base": "Estimated value must be a number",
    "number.min": "Estimated value cannot be negative",
  }),

  customFields: Joi.object().optional().messages({
    "object.base": "Custom fields must be a valid JSON object",
  }),
});
