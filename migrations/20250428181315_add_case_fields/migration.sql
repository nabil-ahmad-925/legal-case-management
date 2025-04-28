-- CreateEnum
CREATE TYPE "BillingType" AS ENUM ('HOURLY', 'FLAT_FEE', 'CONTINGENCY', 'PRO_BONO');

-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "billing_rate" DOUBLE PRECISION,
ADD COLUMN     "billing_type" "BillingType",
ADD COLUMN     "client_email" TEXT,
ADD COLUMN     "client_name" TEXT,
ADD COLUMN     "client_phone" TEXT,
ADD COLUMN     "court_name" TEXT,
ADD COLUMN     "created_by" INTEGER,
ADD COLUMN     "custom_fields" JSONB,
ADD COLUMN     "estimated_value" DOUBLE PRECISION,
ADD COLUMN     "hearing_date" TIMESTAMP(3),
ADD COLUMN     "judge_assigned" TEXT,
ADD COLUMN     "opposing_party" TEXT;
