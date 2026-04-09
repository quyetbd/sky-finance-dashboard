-- Add arapType (nullable, no issue)
ALTER TABLE "chart_of_accounts" ADD COLUMN "arapType" TEXT;

-- Add createdAt with DEFAULT for existing rows
ALTER TABLE "chart_of_accounts" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add updatedAt with DEFAULT for existing rows (Prisma @updatedAt cần NOT NULL)
ALTER TABLE "chart_of_accounts" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
