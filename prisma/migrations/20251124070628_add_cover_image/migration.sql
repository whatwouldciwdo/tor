-- AlterTable
ALTER TABLE "Tor" ADD COLUMN     "coverImage" TEXT,
ALTER COLUMN "budgetAmount" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "budgetCurrency" SET DEFAULT 'IDR';
