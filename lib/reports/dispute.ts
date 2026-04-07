/**
 * Dispute Report Generator — Management Report
 *
 * Các loại dispute:
 *   - Open: chờ xử lý
 *   - Closed - Win: Bettamax thắng, không mất tiền
 *   - Closed - Loss: Bettamax thua, mất tiền + phí
 *   - Closed - Refund: hoàn lại cho buyer
 */

import { PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'

export type DisputeReportRow = {
  caseId: string
  caseType: string
  normalizedStatus: string
  filingDate?: Date
  closureDate?: Date
  invoiceId?: string
  storeName?: string
  sellerEmail?: string
  buyerCountry?: string
  disputedAmount: Decimal
  feeAmount: Decimal
  finalCaseOutcome?: string
  moneyMovement?: string
}

/**
 * Get Dispute Report for a period
 *
 * @param prisma - PrismaClient
 * @param comcode - Comcode filter
 * @param normalizedStatus - "Open" | "Closed" | undefined (all)
 * @returns Array of dispute cases
 */
export async function generateDisputeReport(
  prisma: PrismaClient,
  comcode: string,
  normalizedStatus?: string
): Promise<DisputeReportRow[]> {
  const where: any = { comcode }
  if (normalizedStatus) {
    where.normalizedStatus = normalizedStatus
  }

  const cases = await prisma.disputeCase.findMany({
    where,
    include: {
      // NOTE: DisputeCase không có relation tới Order trong schema
      // Cần join qua invoiceId để lấy storeName, sellerEmail, buyerCountry
    },
  })

  // TODO: Join with Orders để lấy storeName, sellerEmail, buyerCountry
  // Hiện tại return basic info

  const rows: DisputeReportRow[] = cases.map((c) => ({
    caseId: c.id,
    caseType: c.caseType,
    normalizedStatus: c.normalizedStatus,
    filingDate: c.filingDate || undefined,
    closureDate: c.closureDate || undefined,
    invoiceId: c.invoiceId || undefined,
    storeName: undefined, // TODO: join from orders
    sellerEmail: undefined, // TODO: join from orders
    buyerCountry: undefined, // TODO: join from orders
    disputedAmount: new Decimal(c.disputedAmount || 0),
    feeAmount: new Decimal(c.feeAmount || 0),
    finalCaseOutcome: c.finalCaseOutcome || undefined,
    moneyMovement: c.moneyMovement || undefined,
  }))

  return rows
}
