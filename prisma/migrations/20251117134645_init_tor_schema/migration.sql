-- CreateEnum
CREATE TYPE "TorStatusStage" AS ENUM ('DRAFT', 'APPROVAL_1', 'APPROVAL_2', 'APPROVAL_3', 'APPROVAL_4', 'APPROVAL_4_1', 'REVISE');

-- CreateEnum
CREATE TYPE "TorActionType" AS ENUM ('SUBMIT', 'APPROVE', 'REVISE', 'REJECT', 'EXPORT');

-- CreateTable
CREATE TABLE "Bidang" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bidang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Position" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "bidangId" INTEGER,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "levelOrder" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Position_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "positionId" INTEGER NOT NULL,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionRole" (
    "positionId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "PositionRole_pkey" PRIMARY KEY ("positionId","roleId")
);

-- CreateTable
CREATE TABLE "Workflow" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bidangId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowStep" (
    "id" SERIAL NOT NULL,
    "workflowId" INTEGER NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "positionId" INTEGER NOT NULL,
    "statusStage" "TorStatusStage" NOT NULL,
    "canRevise" BOOLEAN NOT NULL DEFAULT false,
    "revisionTargetStep" INTEGER NOT NULL DEFAULT 0,
    "isLastStep" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tor" (
    "id" SERIAL NOT NULL,
    "number" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "bidangId" INTEGER NOT NULL,
    "creatorUserId" INTEGER NOT NULL,
    "currentStepNumber" INTEGER NOT NULL DEFAULT 0,
    "statusStage" "TorStatusStage" NOT NULL DEFAULT 'DRAFT',
    "isFinalApproved" BOOLEAN NOT NULL DEFAULT false,
    "isExported" BOOLEAN NOT NULL DEFAULT false,
    "exportedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TorApprovalHistory" (
    "id" SERIAL NOT NULL,
    "torId" INTEGER NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "action" "TorActionType" NOT NULL,
    "fromStatusStage" "TorStatusStage",
    "toStatusStage" "TorStatusStage" NOT NULL,
    "actedByUserId" INTEGER NOT NULL,
    "actedByNameSnapshot" TEXT NOT NULL,
    "actedByPositionSnapshot" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TorApprovalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bidang_code_key" ON "Bidang"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_positionId_key" ON "User"("positionId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Workflow_bidangId_key" ON "Workflow"("bidangId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowStep_workflowId_stepNumber_key" ON "WorkflowStep"("workflowId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Tor_number_key" ON "Tor"("number");

-- CreateIndex
CREATE INDEX "Tor_bidangId_idx" ON "Tor"("bidangId");

-- CreateIndex
CREATE INDEX "Tor_currentStepNumber_idx" ON "Tor"("currentStepNumber");

-- CreateIndex
CREATE INDEX "Tor_statusStage_idx" ON "Tor"("statusStage");

-- CreateIndex
CREATE INDEX "TorApprovalHistory_torId_idx" ON "TorApprovalHistory"("torId");

-- CreateIndex
CREATE INDEX "TorApprovalHistory_actedByUserId_idx" ON "TorApprovalHistory"("actedByUserId");

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionRole" ADD CONSTRAINT "PositionRole_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PositionRole" ADD CONSTRAINT "PositionRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workflow" ADD CONSTRAINT "Workflow_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowStep" ADD CONSTRAINT "WorkflowStep_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tor" ADD CONSTRAINT "Tor_bidangId_fkey" FOREIGN KEY ("bidangId") REFERENCES "Bidang"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tor" ADD CONSTRAINT "Tor_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TorApprovalHistory" ADD CONSTRAINT "TorApprovalHistory_torId_fkey" FOREIGN KEY ("torId") REFERENCES "Tor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TorApprovalHistory" ADD CONSTRAINT "TorApprovalHistory_actedByUserId_fkey" FOREIGN KEY ("actedByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
