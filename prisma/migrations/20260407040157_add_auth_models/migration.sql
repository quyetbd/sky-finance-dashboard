-- CreateEnum
CREATE TYPE "Role" AS ENUM ('FC', 'Accountant', 'Director', 'Viewer');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "taxId" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "country" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chart_of_accounts" (
    "accountCode" INTEGER NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "balanceSide" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "arap" TEXT,

    CONSTRAINT "chart_of_accounts_pkey" PRIMARY KEY ("accountCode")
);

-- CreateTable
CREATE TABLE "journal_type_rules" (
    "id" SERIAL NOT NULL,
    "dataSource" TEXT NOT NULL,
    "journalType" TEXT NOT NULL,
    "bankAccountNum" TEXT,
    "contraAccount" INTEGER NOT NULL,
    "transAccount" INTEGER NOT NULL,
    "feeAccount" INTEGER,
    "partner" TEXT,
    "classify" TEXT,

    CONSTRAINT "journal_type_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiscal_periods" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "note" TEXT,

    CONSTRAINT "fiscal_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exchange_rates" (
    "id" SERIAL NOT NULL,
    "period" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "fncCurr" TEXT NOT NULL,
    "inputCurr" TEXT NOT NULL,
    "rateType" TEXT NOT NULL,
    "rate" DECIMAL(18,6) NOT NULL,

    CONSTRAINT "exchange_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "partnerTaxId" TEXT NOT NULL,
    "partnerCode" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "bankAccount" TEXT,
    "bankType" TEXT,
    "relatedParty" BOOLEAN NOT NULL DEFAULT false,
    "comcode" TEXT,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "orderId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "segment" TEXT,
    "itemStatus" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "fulfilledAt" TIMESTAMP(3),
    "transactionId" TEXT,
    "sellerEmail" TEXT,
    "buyerCountry" TEXT,
    "buyerProvince" TEXT,
    "domain" TEXT,
    "carrier" TEXT,
    "trackingNumber" TEXT,
    "paymentGatewayName" TEXT,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "sku" TEXT,
    "productSku" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(18,4) NOT NULL,
    "shippingFee" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "totalPrice" DECIMAL(18,4) NOT NULL,
    "supplierCost" DECIMAL(18,4),
    "sellerCost" DECIMAL(18,4),
    "additionalCost" DECIMAL(18,4),
    "taxFee" DECIMAL(18,4),
    "fulfillCost" DECIMAL(18,4),
    "profit" DECIMAL(18,4),

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paypal_transactions" (
    "id" SERIAL NOT NULL,
    "comcode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "gross" DECIMAL(18,4) NOT NULL,
    "fee" DECIMAL(18,4) NOT NULL,
    "net" DECIMAL(18,4) NOT NULL,
    "transactionId" TEXT NOT NULL,
    "referenceId" TEXT,
    "invoiceNumber" TEXT,
    "balanceImpact" TEXT NOT NULL,
    "period" TEXT,
    "glPosted" BOOLEAN NOT NULL DEFAULT false,
    "glPostDate" TIMESTAMP(3),

    CONSTRAINT "paypal_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform_staging" (
    "id" SERIAL NOT NULL,
    "comcode" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,
    "rowCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "errorMsg" TEXT,

    CONSTRAINT "platform_staging_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pingpong_transactions" (
    "id" SERIAL NOT NULL,
    "comcode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "fee" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "net" DECIMAL(18,4) NOT NULL,
    "transactionId" TEXT NOT NULL,
    "referenceId" TEXT,
    "sellerEmail" TEXT,
    "period" TEXT,
    "glPosted" BOOLEAN NOT NULL DEFAULT false,
    "glPostDate" TIMESTAMP(3),

    CONSTRAINT "pingpong_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_transactions" (
    "id" SERIAL NOT NULL,
    "comcode" TEXT NOT NULL,
    "bankType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "debit" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "credit" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "balance" DECIMAL(18,4),
    "currency" TEXT NOT NULL,
    "referenceId" TEXT,
    "period" TEXT,
    "glPosted" BOOLEAN NOT NULL DEFAULT false,
    "glPostDate" TIMESTAMP(3),

    CONSTRAINT "bank_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispute_cases" (
    "id" TEXT NOT NULL,
    "comcode" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "caseStatus" TEXT NOT NULL,
    "normalizedStatus" TEXT NOT NULL,
    "filingDate" TIMESTAMP(3),
    "closureDate" TIMESTAMP(3),
    "disputedAmount" DECIMAL(18,4),
    "disputedCurrency" TEXT,
    "moneyMovement" TEXT,
    "settlementType" TEXT,
    "finalCaseOutcome" TEXT,
    "invoiceId" TEXT,
    "transactionId" TEXT,
    "cardType" TEXT,
    "grossAmount" DECIMAL(18,4),
    "feeAmount" DECIMAL(18,4),
    "sellerProtection" TEXT,

    CONSTRAINT "dispute_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gl_entries" (
    "id" TEXT NOT NULL,
    "comcode" TEXT NOT NULL,
    "dataSource" TEXT NOT NULL,
    "journalType" TEXT NOT NULL,
    "docNum" TEXT NOT NULL,
    "referenceTxnId" TEXT,
    "bankAccountNum" TEXT,
    "accountCode" INTEGER NOT NULL,
    "partner" TEXT,
    "period" TEXT NOT NULL,
    "refNum" TEXT,
    "transDate" TIMESTAMP(3) NOT NULL,
    "docDate" TIMESTAMP(3) NOT NULL,
    "inputCurr" TEXT NOT NULL,
    "fncCurr" TEXT NOT NULL DEFAULT 'USD',
    "inputDr" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "inputCr" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "xRate" DECIMAL(18,6) NOT NULL DEFAULT 1,
    "rateType" TEXT NOT NULL DEFAULT 'Mul',
    "accountedDr" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "accountedCr" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "description" TEXT,
    "balanceImpact" TEXT,
    "isReversal" BOOLEAN NOT NULL DEFAULT false,
    "reversedId" TEXT,
    "partnerTaxId" TEXT,
    "segment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,

    CONSTRAINT "gl_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profit_summaries" (
    "id" SERIAL NOT NULL,
    "comcode" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "sellerEmail" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "buyerCountry" TEXT,
    "paymentGateway" TEXT,
    "orderCount" INTEGER NOT NULL,
    "gmv" DECIMAL(18,4) NOT NULL,
    "shippingCost" DECIMAL(18,4) NOT NULL,
    "additionalCost" DECIMAL(18,4) NOT NULL,
    "taxFee" DECIMAL(18,4) NOT NULL,
    "supplierCost" DECIMAL(18,4) NOT NULL,
    "sellerCost" DECIMAL(18,4) NOT NULL,
    "fulfillCost" DECIMAL(18,4) NOT NULL,
    "refreshedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profit_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" SERIAL NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "comcode" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'New',
    "partnerId" INTEGER NOT NULL,
    "period" TEXT NOT NULL,
    "incurDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidDate" TIMESTAMP(3),
    "amount" DECIMAL(18,4) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "glPosted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "amConfirmedBy" TEXT,
    "amConfirmedAt" TIMESTAMP(3),
    "dirConfirmedBy" TEXT,
    "dirConfirmedAt" TIMESTAMP(3),
    "fcConfirmedBy" TEXT,
    "fcConfirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_flow_plans" (
    "id" SERIAL NOT NULL,
    "comcode" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "lineItem" TEXT NOT NULL,
    "plannedAmt" DECIMAL(18,4) NOT NULL,
    "actualAmt" DECIMAL(18,4),
    "note" TEXT,

    CONSTRAINT "cash_flow_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "allowedComcodes" TEXT[],
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "failedLoginCount" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viewer_permissions" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "comcode" TEXT NOT NULL,
    "reportKey" TEXT NOT NULL,

    CONSTRAINT "viewer_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fiscal_periods_companyId_status_idx" ON "fiscal_periods"("companyId", "status");

-- CreateIndex
CREATE INDEX "exchange_rates_period_inputCurr_idx" ON "exchange_rates"("period", "inputCurr");

-- CreateIndex
CREATE UNIQUE INDEX "partners_partnerTaxId_key" ON "partners"("partnerTaxId");

-- CreateIndex
CREATE UNIQUE INDEX "partners_partnerCode_key" ON "partners"("partnerCode");

-- CreateIndex
CREATE INDEX "orders_segment_paidAt_idx" ON "orders"("segment", "paidAt");

-- CreateIndex
CREATE INDEX "orders_sellerEmail_idx" ON "orders"("sellerEmail");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "paypal_transactions_transactionId_key" ON "paypal_transactions"("transactionId");

-- CreateIndex
CREATE INDEX "paypal_transactions_comcode_period_idx" ON "paypal_transactions"("comcode", "period");

-- CreateIndex
CREATE INDEX "paypal_transactions_invoiceNumber_idx" ON "paypal_transactions"("invoiceNumber");

-- CreateIndex
CREATE INDEX "paypal_transactions_referenceId_idx" ON "paypal_transactions"("referenceId");

-- CreateIndex
CREATE INDEX "paypal_transactions_glPosted_idx" ON "paypal_transactions"("glPosted");

-- CreateIndex
CREATE INDEX "platform_staging_comcode_period_idx" ON "platform_staging"("comcode", "period");

-- CreateIndex
CREATE UNIQUE INDEX "pingpong_transactions_transactionId_key" ON "pingpong_transactions"("transactionId");

-- CreateIndex
CREATE INDEX "pingpong_transactions_comcode_period_idx" ON "pingpong_transactions"("comcode", "period");

-- CreateIndex
CREATE INDEX "pingpong_transactions_sellerEmail_idx" ON "pingpong_transactions"("sellerEmail");

-- CreateIndex
CREATE INDEX "bank_transactions_comcode_period_idx" ON "bank_transactions"("comcode", "period");

-- CreateIndex
CREATE INDEX "dispute_cases_comcode_normalizedStatus_idx" ON "dispute_cases"("comcode", "normalizedStatus");

-- CreateIndex
CREATE INDEX "dispute_cases_invoiceId_idx" ON "dispute_cases"("invoiceId");

-- CreateIndex
CREATE INDEX "gl_entries_comcode_period_idx" ON "gl_entries"("comcode", "period");

-- CreateIndex
CREATE INDEX "gl_entries_accountCode_period_idx" ON "gl_entries"("accountCode", "period");

-- CreateIndex
CREATE INDEX "gl_entries_docNum_idx" ON "gl_entries"("docNum");

-- CreateIndex
CREATE INDEX "gl_entries_referenceTxnId_idx" ON "gl_entries"("referenceTxnId");

-- CreateIndex
CREATE INDEX "profit_summaries_comcode_period_idx" ON "profit_summaries"("comcode", "period");

-- CreateIndex
CREATE UNIQUE INDEX "profit_summaries_comcode_period_sellerEmail_buyerCountry_pa_key" ON "profit_summaries"("comcode", "period", "sellerEmail", "buyerCountry", "paymentGateway");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoiceNo_key" ON "invoices"("invoiceNo");

-- CreateIndex
CREATE INDEX "invoices_comcode_period_idx" ON "invoices"("comcode", "period");

-- CreateIndex
CREATE INDEX "invoices_partnerId_status_idx" ON "invoices"("partnerId", "status");

-- CreateIndex
CREATE INDEX "cash_flow_plans_comcode_period_idx" ON "cash_flow_plans"("comcode", "period");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "viewer_permissions_userId_comcode_reportKey_key" ON "viewer_permissions"("userId", "comcode", "reportKey");

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viewer_permissions" ADD CONSTRAINT "viewer_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
