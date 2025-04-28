import { PrismaClient } from "@prisma/client";
import app from "./app";
import logger from "./utils/logger";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info("Connected to database successfully");

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.log("error =====>", error);
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled rejection:", error);
  process.exit(1);
});

startServer();
