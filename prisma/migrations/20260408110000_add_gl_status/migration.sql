-- AlterTable: add glStatus column to gl_entries
ALTER TABLE "gl_entries" ADD COLUMN "glStatus" TEXT NOT NULL DEFAULT 'Posted';

-- CreateIndex for fast filter by status + dataSource
CREATE INDEX "gl_entries_glStatus_dataSource_idx" ON "gl_entries"("glStatus", "dataSource");
