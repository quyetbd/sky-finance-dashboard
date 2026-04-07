import type { DisputeRow, DisputeTotals } from './types';

export const fmt = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ZERO_TOTALS: DisputeTotals = {
  totalFulfillCost: 0,
  totalTaxFee: 0,
  totalAdditionalCost: 0,
  totalPrice: 0,
};

export function sumRows(rows: DisputeRow[]): DisputeTotals {
  return rows.reduce(
    (acc, r) => ({
      totalFulfillCost:    acc.totalFulfillCost    + r.totalFulfillCost,
      totalTaxFee:         acc.totalTaxFee          + r.totalTaxFee,
      totalAdditionalCost: acc.totalAdditionalCost  + r.totalAdditionalCost,
      totalPrice:          acc.totalPrice           + r.totalPrice,
    }),
    ZERO_TOTALS,
  );
}

const RAW: Omit<DisputeRow, 'key'>[] = [
  {
    caseType:            'Chargeback',
    orderId:             '',
    disputeAmt:          1,
    disputeExp:          104.99,
    sellerCost:          20,
    supplierCost:        4,
    totalFulfillCost:    3,
    totalTaxFee:         3,
    totalAdditionalCost: 0,
    totalPrice:          3,
    dispute3Pct:         0.09,
    netDisputeCost:      2.91,
  },
];

export const DATA: DisputeRow[] = RAW.map((r, i) => ({ ...r, key: String(i) }));

export const CASE_TYPE_OPTIONS = [
  { label: 'All',               value: 'All' },
  { label: 'Dispute',           value: 'Dispute' },
  { label: 'Chargeback',        value: 'Chargeback' },
  { label: 'Claim',             value: 'Claim' },
  { label: 'Unauthorized Claim',value: 'Unauthorized Claim' },
  { label: 'Bank Return',       value: 'Bank Return' },
];

export const CASE_STATUS_OPTIONS = [
  { label: 'All',    value: 'All' },
  { label: 'Open',   value: 'Open' },
  { label: 'Closed', value: 'Closed' },
];

export const FINAL_OUTCOME_OPTIONS = [
  { label: 'All',    value: 'All' },
  { label: 'Win',    value: 'Win' },
  { label: 'Loss',   value: 'Loss' },
  { label: 'Refund', value: 'Refund' },
];
