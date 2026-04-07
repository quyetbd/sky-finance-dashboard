/**
 * Trial Balance Report Generator — Accounting Report
 *
 * Format:
 *   Account Code | Account Name | Opening Balance | Debit | Credit | Closing Balance
 *
 * Rules:
 *   - Opening Balance từ kỳ trước (tính từ Closing Balance cuối tháng trước)
 *   - Debit, Credit từ GL entries trong kỳ
 *   - Closing = Opening + Dr - Cr (Dr-normal accounts) hoặc Opening - Dr + Cr (Cr-normal)
 */

import { PrismaClient } from '@prisma/client'
import Decimal from 'decimal.js'

export type TrialBalanceRow = {
  accountCode: number
  accountName: string
  accountType: string
  debitNormal: boolean // true = Dr-normal (Asset, Expense), false = Cr-normal
  openingBalance: Decimal
  debit: Decimal
  credit: Decimal
  closingBalance: Decimal
}

/**
 * Get Trial Balance for a period and comcode
 *
 * @param prisma - PrismaClient
 * @param comcode - Comcode filter
 * @param period - "YYYYMM"
 * @returns Array of trial balance rows
 */
export async function generateTrialBalance(
  prisma: PrismaClient,
  comcode: string,
  period: string
): Promise<TrialBalanceRow[]> {
  const coas = await prisma.chartOfAccount.findMany({ where: { status: 'Active' } })

  const glEntries = await prisma.glEntry.findMany({
    where: { comcode, period },
  })

  // Group GL entries by account
  const glByAccount = new Map<number, { dr: Decimal; cr: Decimal }>()

  for (const entry of glEntries) {
    const current = glByAccount.get(entry.accountCode) ?? {
      dr: new Decimal(0),
      cr: new Decimal(0),
    }

    glByAccount.set(entry.accountCode, {
      dr: current.dr.plus(entry.accountedDr),
      cr: current.cr.plus(entry.accountedCr),
    })
  }

  const rows: TrialBalanceRow[] = []

  for (const coa of coas) {
    const debitNormal = coa.balanceSide === 'Dr'
    const glEntry = glByAccount.get(coa.accountCode)

    const debit = glEntry?.dr ?? new Decimal(0)
    const credit = glEntry?.cr ?? new Decimal(0)

    // Opening balance từ GL entries kỳ trước — TODO: lấy từ table khác hoặc tính aggregate
    const openingBalance = new Decimal(0)

    // Tính closing balance
    let closingBalance: Decimal
    if (debitNormal) {
      // Dr-normal: Closing = Opening + Dr - Cr
      closingBalance = openingBalance.plus(debit).minus(credit)
    } else {
      // Cr-normal: Closing = Opening - Dr + Cr
      closingBalance = openingBalance.minus(debit).plus(credit)
    }

    rows.push({
      accountCode: coa.accountCode,
      accountName: coa.accountName,
      accountType: coa.accountType,
      debitNormal,
      openingBalance,
      debit,
      credit,
      closingBalance,
    })
  }

  return rows
}
