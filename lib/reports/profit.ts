/**
 * Profit Report Generator — Management Report
 *
 * Queries ProfitSummary table (materialized view).
 * Tính lợi nhuận theo Seller, theo thị trường.
 *
 * Formula:
 *   GMV = Σ (UnitPrice × Quantity) per Order
 *   Profit = GMV - ShippingCost - AdditionalCost - PaymentGatewayCost
 *          - SellerCost - SupplierCost - TaxFee - DisputeCost
 *   %Profit = Profit / GMV
 */

import { PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'

export type ProfitReportRow = {
  sellerEmail: string
  storeName: string
  buyerCountry?: string
  paymentGateway?: string
  orderCount: number
  gmv: Decimal
  shippingCost: Decimal
  additionalCost: Decimal
  taxFee: Decimal
  supplierCost: Decimal
  sellerCost: Decimal
  fulfillCost: Decimal
  disputeEst: Decimal // 3% estimate
  profit: Decimal
  profitMargin: number // %
}

/**
 * Get Profit Report for a period and comcode
 *
 * @param prisma - PrismaClient
 * @param comcode - Comcode filter
 * @param period - "YYYYMM"
 * @returns Array of profit rows grouped by seller + country
 */
export async function generateProfitReport(
  prisma: PrismaClient,
  comcode: string,
  period: string
): Promise<ProfitReportRow[]> {
  const summaries = await prisma.profitSummary.findMany({
    where: { comcode, period },
  })

  const rows: ProfitReportRow[] = summaries.map((s) => {
    const gmv = new Decimal(s.gmv)
    const shippingCost = new Decimal(s.shippingCost)
    const additionalCost = new Decimal(s.additionalCost)
    const taxFee = new Decimal(s.taxFee)
    const supplierCost = new Decimal(s.supplierCost)
    const sellerCost = new Decimal(s.sellerCost)
    const fulfillCost = new Decimal(s.fulfillCost)

    // Dispute cost estimate: 3%
    const disputeEst = gmv.mul(0.03)

    // Calculate profit
    const profit = gmv
      .minus(shippingCost)
      .minus(additionalCost)
      .minus(taxFee)
      .minus(supplierCost)
      .minus(sellerCost)
      .minus(fulfillCost)
      .minus(disputeEst)

    // Margin %
    const profitMargin = gmv.isZero()
      ? 0
      : parseFloat(profit.div(gmv).mul(100).toFixed(2))

    return {
      sellerEmail: s.sellerEmail,
      storeName: s.storeName,
      buyerCountry: s.buyerCountry || undefined,
      paymentGateway: s.paymentGateway || undefined,
      orderCount: s.orderCount,
      gmv,
      shippingCost,
      additionalCost,
      taxFee,
      supplierCost,
      sellerCost,
      fulfillCost,
      disputeEst,
      profit,
      profitMargin,
    }
  })

  return rows
}
