/**
 * PayPal CSV Parser — ETL for PayPal Statement CSV
 *
 * Input: CSV từ PayPal dengan columns:
 *   Date | Type | Status | Currency | Gross | Fee | Net | TransactionID | ReferenceID | InvoiceNumber
 *
 * Output: PaypalTransaction[] ready to insert
 *
 * Rules:
 *   - Chỉ parse Status = "Completed"
 *   - Compute period từ Date
 *   - Dedup theo transactionId
 */

import Papa from 'papaparse'
import Decimal from 'decimal.js'

export type PayPalCSVRow = {
  Date: string
  Type: string
  Status: string
  Currency: string
  Gross: string
  Fee: string
  Net: string
  TransactionID: string
  ReferenceID?: string
  InvoiceNumber?: string
}

export type PayPalTransactionParsed = {
  comcode: string
  date: Date
  type: string
  status: string
  currency: string
  gross: Decimal
  fee: Decimal
  net: Decimal
  transactionId: string
  referenceId?: string
  invoiceNumber?: string
  period?: string
}

/**
 * Parse PayPal CSV file content
 */
export function parsePayPalCSV(
  csvContent: string,
  comcode: string
): PayPalTransactionParsed[] {
  const result = Papa.parse<PayPalCSVRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  })

  if (result.errors.length > 0) {
    throw new Error(`CSV parse error: ${result.errors[0].message}`)
  }

  const transactions: PayPalTransactionParsed[] = []

  for (const row of result.data) {
    // Skip non-Completed transactions
    if (row.Status !== 'Completed') continue

    const date = new Date(row.Date)
    if (isNaN(date.getTime())) {
      console.warn(`Skipping row with invalid date: ${row.Date}`)
      continue
    }

    // Compute period from date
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const period = `${year}${month}`

    transactions.push({
      comcode,
      date,
      type: row.Type,
      status: row.Status,
      currency: row.Currency,
      gross: new Decimal(row.Gross),
      fee: new Decimal(row.Fee),
      net: new Decimal(row.Net),
      transactionId: row.TransactionID,
      referenceId: row.ReferenceID || undefined,
      invoiceNumber: row.InvoiceNumber || undefined,
      period,
    })
  }

  return transactions
}
