import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { ConflictError } from "../utils/errors";
import logger from "../utils/logger";

const prisma = new PrismaClient();

/**
 * @desc    Create a new legal case
 * @route   POST /api/cases
 * @access  Private (Lawyers and Admins only)
 */
export const createCase = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      caseNumber,
      title,
      description,
      status,
      priority,
      practiceArea,
      filingDate,
      clientName,
      clientEmail,
      clientPhone,
      opposingParty,
      courtName,
      judgeAssigned,
      hearingDate,
      billingType,
      billingRate,
      estimatedValue,
      customFields,
    } = req.body;

    const existingCase = await prisma.case.findUnique({
      where: { caseNumber },
    });

    if (existingCase) {
      throw new ConflictError(
        `A case with number "${caseNumber}" already exists`
      );
    }

    const newCase = await prisma.case.create({
      data: {
        caseNumber,
        title,
        description,
        status,
        priority,
        practiceArea,
        filingDate: filingDate ? new Date(filingDate) : undefined,
        clientName,
        clientEmail,
        clientPhone,
        opposingParty,
        courtName,
        judgeAssigned,
        hearingDate: hearingDate ? new Date(hearingDate) : undefined,
        billingType,
        billingRate,
        estimatedValue,
        customFields: customFields || undefined,
        createdBy: req.user?.id,
      },
    });

    if (req.user?.id) {
      await prisma.caseAssignment.create({
        data: {
          caseId: newCase.id,
          userId: req.user.id,
          role: "LEAD",
        },
      });
    }

    logger.info(
      `Case created: ${newCase.caseNumber} (ID: ${newCase.id}) by user ID: ${req.user?.id}`
    );

    res.status(201).json({
      success: true,
      data: newCase,
    });
  } catch (error) {
    if (error instanceof ConflictError) {
      res.status(409).json({
        success: false,
        error: { message: error.message },
      });
    } else {
      logger.error("Error creating case:", error);
      res.status(500).json({
        success: false,
        error: { message: "Server error while creating case" },
      });
    }
  }
};
