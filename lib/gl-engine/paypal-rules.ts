/**
 * PayPal Journal Type Rules
 *
 * Maps PayPal transaction type strings → GL account codes.
 * Centralized here so BA/accounting team can adjust mappings without
 * touching business logic. When BA confirms final rules, migrate to
 * the `JournalTypeRule` DB table and replace this config with a DB query.
 *
 * Account codes reference (from prisma/seed/coa.ts):
 *   11202051 — PayPal Available (USD)
 *   11202052 — PayPal Held/Reserve/Review (USD)
 *   11202053 — PayPal Available (CAD)
 *   11202054 — PayPal Held/Reserve (CAD)
 *   11301001 — In-Transit PayPal → Bank VN
 *   11302001 — In-Transit PayPal → Bank CA
 *   13802001 — Phải thu Chargeback/Dispute
 *   33102001 — Phải trả Supplier (AP)
 *   51112001 — Doanh thu bán hàng
 *   60001001 — PayPal Transaction Fee (to be added to CoA seed)
 */

export interface PaypalJournalRule {
  /** Debit account code (transAccount) */
  transAccount: number
  /** Credit account code (contraAccount) */
  contraAccount: number
  /** Optional fee account — creates a separate Dr line for fee amount */
  feeAccount?: number
}

export const PAYPAL_JOURNAL_RULES: Record<string, PaypalJournalRule> = {
  // ── Incoming payments (gross > 0) ─────────────────────────────────────────
  'Express Checkout Payment':   { transAccount: 11202051, contraAccount: 51112001, feeAccount: 60001001 },
  'General Authorization':      { transAccount: 11202051, contraAccount: 51112001, feeAccount: 60001001 },
  'General Payment':            { transAccount: 11202051, contraAccount: 51112001, feeAccount: 60001001 },
  'Direct Credit Card Payment': { transAccount: 11202051, contraAccount: 51112001, feeAccount: 60001001 },
  'Payment Review':             { transAccount: 11202051, contraAccount: 51112001, feeAccount: 60001001 },
  'Payment Reversal':           { transAccount: 11202051, contraAccount: 51112001 },

  // ── Dispute & chargeback ──────────────────────────────────────────────────
  'Chargeback':                 { transAccount: 13802001, contraAccount: 11202051 },
  'Chargeback Fee':             { transAccount: 60001001, contraAccount: 11202051 },
  'Dispute Fee':                { transAccount: 60001001, contraAccount: 11202051 },
  'Reversal of General Account Hold': { transAccount: 11202051, contraAccount: 13802001 },

  // ── Refunds ────────────────────────────────────────────────────────────────
  'Payment Refund':             { transAccount: 51112001, contraAccount: 11202051 },

  // ── Reserve / hold ────────────────────────────────────────────────────────
  'Reserve Hold':               { transAccount: 11202052, contraAccount: 11202051 },
  'Reserve Release':            { transAccount: 11202051, contraAccount: 11202052 },
  'Hold on Available Balance':  { transAccount: 11202052, contraAccount: 11202051 },

  // ── Mass pay (outgoing to suppliers) ─────────────────────────────────────
  // TODO: confirm with BA — Phải trả Supplier (33102001) vs rút về VN?
  'Mass Pay Payment':           { transAccount: 33102001, contraAccount: 11202051 },
  'Mass Payment':               { transAccount: 33102001, contraAccount: 11202051 },

  // ── Fees ──────────────────────────────────────────────────────────────────
  'Partner Fee':                { transAccount: 60001001, contraAccount: 11202051 },

  // ── Withdrawals / transfers ───────────────────────────────────────────────
  // Currency-specific accounts resolved at runtime based on currency field:
  //   USD withdrawal → 11301001 (Bank VN transit)
  //   CAD withdrawal → 11302001 (Bank CA transit)
  'User Initiated Withdrawal':  { transAccount: 11301001, contraAccount: 11202051 },

  // ── Currency conversion ───────────────────────────────────────────────────
  'General Currency Conversion': { transAccount: 11202051, contraAccount: 11202053 },
}

/**
 * Resolve the PayPal available account based on currency.
 * Override transAccount/contraAccount for CAD transactions at runtime.
 */
export function resolvePaypalAccount(
  rule: PaypalJournalRule,
  currency: string
): PaypalJournalRule {
  if (currency === 'CAD') {
    // Swap USD PayPal account (11202051) → CAD (11202053)
    return {
      ...rule,
      transAccount: rule.transAccount === 11202051 ? 11202053 : rule.transAccount,
      contraAccount: rule.contraAccount === 11202051 ? 11202053 : rule.contraAccount,
    }
  }
  return rule
}
