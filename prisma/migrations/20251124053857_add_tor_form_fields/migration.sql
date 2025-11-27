-- AlterTable
ALTER TABLE "Tor" ADD COLUMN     "background" TEXT,
ADD COLUMN     "budgetType" TEXT,
ADD COLUMN     "creationDate" TIMESTAMP(3),
ADD COLUMN     "creationYear" INTEGER,
ADD COLUMN     "deliveryMechanism" TEXT,
ADD COLUMN     "deliveryPoint" TEXT,
ADD COLUMN     "directorProposal" TEXT,
ADD COLUMN     "drsData" JSONB,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "durationUnit" TEXT,
ADD COLUMN     "executionYear" INTEGER,
ADD COLUMN     "fieldDirectorProposal" TEXT,
ADD COLUMN     "generalProvisions" TEXT,
ADD COLUMN     "grandTotal" DECIMAL(15,2),
ADD COLUMN     "itpData" JSONB,
ADD COLUMN     "materialJasaValue" DECIMAL(15,2),
ADD COLUMN     "objective" TEXT,
ADD COLUMN     "otherRequirements" TEXT,
ADD COLUMN     "paymentTerms" TEXT,
ADD COLUMN     "penaltyRules" TEXT,
ADD COLUMN     "pgrsData" JSONB,
ADD COLUMN     "pph" DECIMAL(15,2),
ADD COLUMN     "ppn" DECIMAL(15,2),
ADD COLUMN     "procurementMethod" TEXT,
ADD COLUMN     "program" TEXT,
ADD COLUMN     "projectEndDate" TIMESTAMP(3),
ADD COLUMN     "projectStartDate" TIMESTAMP(3),
ADD COLUMN     "rkaYear" INTEGER,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "subtotal" DECIMAL(15,2),
ADD COLUMN     "technicalSpec" TEXT,
ADD COLUMN     "tpgData" JSONB,
ADD COLUMN     "vendorRequirements" TEXT,
ADD COLUMN     "workType" TEXT;

-- CreateTable
CREATE TABLE "TorBudgetItem" (
    "id" SERIAL NOT NULL,
    "torId" INTEGER NOT NULL,
    "item" TEXT NOT NULL,
    "description" TEXT,
    "quantity" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "unitPrice" DECIMAL(15,2) NOT NULL,
    "totalPrice" DECIMAL(15,2) NOT NULL,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TorBudgetItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TorBudgetItem_torId_idx" ON "TorBudgetItem"("torId");

-- AddForeignKey
ALTER TABLE "TorBudgetItem" ADD CONSTRAINT "TorBudgetItem_torId_fkey" FOREIGN KEY ("torId") REFERENCES "Tor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
