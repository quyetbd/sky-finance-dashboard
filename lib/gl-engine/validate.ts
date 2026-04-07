import Decimal from 'decimal.js'

export type GLEntryInput = {
  docNum: string
  accountedDr: Decimal | number | string
  accountedCr: Decimal | number | string
}

/**
 * Validates double-entry rule: Σ Dr = Σ Cr per docNum.
 * Tolerance: ±0.01 để tránh floating point noise.
 *
 * CRITICAL: Hàm này phải pass trước khi ghi bất kỳ batch nào vào GL.
 * Throws nếu bất kỳ docNum nào mất cân bằng.
 */
export function validateDoubleEntry(entries: GLEntryInput[]): void {
  const byDocNum = new Map<string, { dr: Decimal; cr: Decimal }>()

  for (const entry of entries) {
    const current = byDocNum.get(entry.docNum) ?? { dr: new Decimal(0), cr: new Decimal(0) }
    byDocNum.set(entry.docNum, {
      dr: current.dr.plus(entry.accountedDr),
      cr: current.cr.plus(entry.accountedCr),
    })
  }

  const errors: string[] = []
  for (const [docNum, { dr, cr }] of byDocNum.entries()) {
    if (dr.minus(cr).abs().greaterThan(0.01)) {
      errors.push(`DocNum ${docNum}: Dr=${dr.toFixed(2)} ≠ Cr=${cr.toFixed(2)}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Double-entry validation failed:\n${errors.join('\n')}`)
  }
}
