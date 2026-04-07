/**
 * PingPong Statement Parser — ETL for PingPong CSV Statement
 *
 * Input: CSV từ PingPong với columns:
 *   Date | Type | Description | Amount | Fee | Net | Currency | BalanceAfter | ReferenceID
 *
 * Output: PingPongTransaction[] ready to insert
 */

import Papa from 'papaparse'
import Decimal from 'decimal.js'

export type PingPongRow = {
  Date: string
  Type: string
  Description: string
  Amount: string
  Fee?: string
  Net: string
  Currency: string
  BalanceAfter?: string
  ReferenceID?: string
}

export type PingPongTransactionParsed = {
  comcode: string
  date: Date
  type: string
  currency: string
  amount: Decimal
  fee: Decimal
  net: Decimal
  transactionId: string // Generated từ ReferenceID hoặc Date+Amount
  referenceId?: string
  sellerEmail?: string
  period?: string
}

/**
 * Parse PingPong Statement CSV
 */
export function parsePingPongStatement(
  csvContent: string,
  comcode: string
): PingPongTransactionParsed[] {
  const result = Papa.parse<PingPongRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  if (result.errors.length > 0) {
    throw new Error(`CSV parse error: ${result.errors[0].message}`)
  }

  const transactions: PingPongTransactionParsed[] = []

  for (const row of result.data) {
    const date = new Date(row.Date)
    if (isNaN(date.getTime())) {
      console.warn(`Skipping PingPong row with invalid date: ${row.Date}`)
      continue
    }

    // Compute period
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const period = `${year}${month}`

    // Generate transaction ID
    const transactionId = row.ReferenceID || `PP-${date.getTime()}-${row.Amount}`

    transactions.push({
      comcode,
      date,
      type: row.Type,
      currency: row.Currency,
      amount: new Decimal(row.Amount),
      fee: new Decimal(row.Fee || 0),
      net: new Decimal(row.Net),
      transactionId,
      referenceId: row.ReferenceID || undefined,
      sellerEmail: undefined, // Sẽ map từ description hoặc cần thêm column
      period,
    })
  }

  return transactions
}
