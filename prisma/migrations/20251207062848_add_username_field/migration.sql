/*
  Warnings:

  - You are about to drop the column `drsData` on the `Tor` table. All the data in the column will be lost.
  - You are about to drop the column `itpData` on the `Tor` table. All the data in the column will be lost.
  - You are about to drop the column `pgrsData` on the `Tor` table. All the data in the column will be lost.
  - You are about to drop the column `tpgData` on the `Tor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tor" DROP COLUMN "drsData",
DROP COLUMN "itpData",
DROP COLUMN "pgrsData",
DROP COLUMN "tpgData",
ADD COLUMN     "documentRequestSheets" JSONB,
ADD COLUMN     "inspectionTestingPlans" JSONB,
ADD COLUMN     "performanceGuarantees" JSONB,
ADD COLUMN     "riskAssessment" TEXT,
ADD COLUMN     "technicalParticulars" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "PositionBidangAccess" (
    "id" SERIAL NOT NULL,
    "positionId" INTEGER NOT NULL,
    "bidangId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PositionBidangAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PositionBidangAccess_positionId_idx" ON "PositionBidangAccess"("positionId");

-- CreateIndex
CREATE INDEX "PositionBidangAccess_bidangId_idx" ON "PositionBidangAccess"("bidangId");

-- CreateIndex
CREATE UNIQUE INDEX "PositionBidangAccess_positionId_bidangId_key" ON "PositionBidangAccess"("positionId", "bidangId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "PositionBidangAccess" ADD CONSTRAINT "PositionBidangAccess_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionBidangAccess" ADD CONSTRAINT "PositionBidangAccess_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE CASCADE ON UPDATE CASCADE;
