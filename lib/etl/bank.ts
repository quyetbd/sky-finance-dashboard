/**
 * Banking Statement Parser — ETL for Bank VN / Bank CA CSV
 *
 * Input: CSV từ ngân hàng VN/CA với columns tùy theo bank
 *   Date | Description | Debit | Credit | Balance | Currency | ReferenceID
 *
 * Output: BankTransaction[] ready to insert
 */

import Papa from 'papaparse'
import Decimal from 'decimal.js'

export type BankStatementRow = {
  Date: string
  Description: string
  Debit?: string
  Credit?: string
  Balance?: string
  Currency: string
  ReferenceID?: string
}

export type BankTransactionParsed = {
  comcode: string
  bankType: string
  date: Date
  description?: string
  debit: Decimal
  credit: Decimal
  balance?: Decimal
  currency: string
  referenceId?: string
  period?: string
}

/**
 * Parse Bank Statement CSV
 */
export function parseBankStatement(
  csvContent: string,
  comcode: string,
  bankType: 'BankVN' | 'BankCAN'
): BankTransactionParsed[] {
  const result = Papa.parse<BankStatementRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  if (result.errors.length > 0) {
    throw new Error(`CSV parse error: ${result.errors[0].message}`)
  }

  const transactions: BankTransactionParsed[] = []

  for (const row of result.data) {
    const date = new Date(row.Date)
    if (isNaN(date.getTime())) {
      console.warn(`Skipping bank row with invalid date: ${row.Date}`)
      continue
    }

    // Compute period
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const period = `${year}${month}`

    transactions.push({
      comcode,
      bankType,
      date,
      description: row.Description || undefined,
      debit: new Decimal(row.Debit || 0),
      credit: new Decimal(row.Credit || 0),
      balance: row.Balance ? new Decimal(row.Balance) : undefined,
      currency: row.Currency,
      referenceId: row.ReferenceID || undefined,
      period,
    })
  }

  return transactions
}
