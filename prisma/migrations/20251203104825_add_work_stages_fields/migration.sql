-- AlterTable
ALTER TABLE "Tor" ADD COLUMN     "deliveryRequirements" TEXT,
ADD COLUMN     "handoverMechanism" TEXT,
ADD COLUMN     "handoverPoint" TEXT,
ADD COLUMN     "workStagesData" JSONB,
ADD COLUMN     "workStagesExplanation" TEXT;
