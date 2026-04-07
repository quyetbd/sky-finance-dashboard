import type { ByMarketRow, ByMarketTotals } from './types';

export const fmt = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ZERO_TOTALS: ByMarketTotals = {
  order: 0, gmv: 0, shippingCost: 0, additionalCost: 0,
  dispute3Pct: 0, paymentGateway: 0, sellerCost: 0,
  supplierCost: 0, taxFee: 0, profit: 0,
};

/** Sums only top-level (parent) rows — children are already included in parent totals */
export function sumRows(rows: ByMarketRow[]): ByMarketTotals {
  return rows.reduce(
    (acc, r) => ({
      order:          acc.order          + r.order,
      gmv:            acc.gmv            + r.gmv,
      shippingCost:   acc.shippingCost   + r.shippingCost,
      additionalCost: acc.additionalCost + r.additionalCost,
      dispute3Pct:    acc.dispute3Pct    + r.dispute3Pct,
      paymentGateway: acc.paymentGateway + r.paymentGateway,
      sellerCost:     acc.sellerCost     + r.sellerCost,
      supplierCost:   acc.supplierCost   + r.supplierCost,
      taxFee:         acc.taxFee         + r.taxFee,
      profit:         acc.profit         + r.profit,
    }),
    ZERO_TOTALS,
  );
}

export const DATA: ByMarketRow[] = [
  {
    key: 'CA',
    country: 'CA',
    order: 5, gmv: 314.9, shippingCost: 0, additionalCost: 0,
    dispute3Pct: 0, paymentGateway: 0, sellerCost: 0, supplierCost: 0, taxFee: 0, profit: 0, profitPct: 0,
    children: [
      { key: 'CA-AB', country: 'AB', order: 2, gmv: 149.96, shippingCost: 0, additionalCost: 0, dispute3Pct: 0, paymentGateway: 0, sellerCost: 0, supplierCost: 0, taxFee: 0, profit: 0, profitPct: 0 },
      { key: 'CA-NS', country: 'NS', order: 1, gmv: 64.98,  shippingCost: 0, additionalCost: 0, dispute3Pct: 0, paymentGateway: 0, sellerCost: 0, supplierCost: 0, taxFee: 0, profit: 0, profitPct: 0 },
      { key: 'CA-ON', country: 'ON', order: 1, gmv: 34.98,  shippingCost: 0, additionalCost: 0, dispute3Pct: 0, paymentGateway: 0, sellerCost: 0, supplierCost: 0, taxFee: 0, profit: 0, profitPct: 0 },
      { key: 'CA-PE', country: 'PE', order: 1, gmv: 64.98,  shippingCost: 0, additionalCost: 0, dispute3Pct: 0, paymentGateway: 0, sellerCost: 0, supplierCost: 0, taxFee: 0, profit: 0, profitPct: 0 },
    ],
  },
  {
    key: 'DE',
    country: 'DE',
    order: 1, gmv: 39.98, shippingCost: 0, additionalCost: 0,
    dispute3Pct: 0, paymentGateway: 0, sellerCost: 0, supplierCost: 0, taxFee: 0, profit: 0, profitPct: 0,
    children: [
      { key: 'DE-DE', country: 'DE', order: 1, gmv: 39.98, shippingCost: 0, additionalCost: 0, dispute3Pct: 0, paymentGateway: 0, sellerCost: 0, supplierCost: 0, taxFee: 0, profit: 0, profitPct: 0 },
    ],
  },
];

export const MARKET_OPTIONS = [
  { label: 'CA', value: 'CA' },
  { label: 'US', value: 'US' },
  { label: 'DE', value: 'DE' },
  { label: 'GB', value: 'GB' },
  { label: 'AU', value: 'AU' },
];
