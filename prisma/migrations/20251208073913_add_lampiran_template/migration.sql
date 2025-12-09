-- CreateTable
CREATE TABLE "LampiranTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "technicalParticulars" JSONB,
    "inspectionTestingPlans" JSONB,
    "documentRequestSheets" JSONB,
    "performanceGuarantees" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LampiranTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LampiranTemplate_name_key" ON "LampiranTemplate"("name");
