import Decimal from 'decimal.js'

// Precision cho mọi phép tính tài chính
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP })

/**
 * Chuyển đổi sang đồng tiền báo cáo (FncCurr = USD).
 *
 * Mul: AccountedAmt = InputAmt × rate   → CAD → USD: 1,000 CAD × 0.73 = 730 USD
 * Div: AccountedAmt = InputAmt ÷ rate   → VND → USD: 26,500,000 ÷ 26,500 = 1,000 USD
 * USD: Mul, rate = 1                    → không đổi
 */
export function convertAmount(
  amount: Decimal | number | string,
  rate: Decimal | number | string,
  rateType: 'Mul' | 'Div'
): Decimal {
  const a = new Decimal(amount)
  const r = new Decimal(rate)

  if (r.isZero()) {
    throw new Error('Exchange rate cannot be zero')
  }

  return rateType === 'Mul' ? a.mul(r) : a.div(r)
}

/**
 * Round về 2 decimals (standard accounting).
 */
export function roundAmount(amount: Decimal | number | string): Decimal {
  return new Decimal(amount).toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
}

/**
 * Convert và round trong một bước — dùng khi tính accountedDr / accountedCr.
 */
export function toFunctionalCurrency(
  inputAmt: Decimal | number | string,
  xRate: Decimal | number | string,
  rateType: 'Mul' | 'Div'
): Decimal {
  return roundAmount(convertAmount(inputAmt, xRate, rateType))
}
