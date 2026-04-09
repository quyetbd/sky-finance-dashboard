-- CreateIndex: add composite index on year+month for fast period lookups
CREATE INDEX "fiscal_periods_year_month_idx" ON "fiscal_periods"("year", "month");