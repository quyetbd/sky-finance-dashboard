import type { ProfitRow, ProfitTotals } from './types';

export const fmt = (n: number): string =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const ZERO_TOTALS: ProfitTotals = {
  order: 0, gmv: 0, shippingCost: 0, additionalCost: 0,
  paymentGateway: 0, sellerCost: 0, supplierCost: 0, taxFee: 0, profit: 0,
};

export function sumRows(rows: ProfitRow[]): ProfitTotals {
  return rows.reduce(
    (acc, r) => ({
      order:          acc.order + r.order,
      gmv:            acc.gmv + r.gmv,
      shippingCost:   acc.shippingCost + r.shippingCost,
      additionalCost: acc.additionalCost + r.additionalCost,
      paymentGateway: acc.paymentGateway + r.paymentGateway,
      sellerCost:     acc.sellerCost + r.sellerCost,
      supplierCost:   acc.supplierCost + r.supplierCost,
      taxFee:         acc.taxFee + r.taxFee,
      profit:         acc.profit + r.profit,
    }),
    ZERO_TOTALS,
  );
}

const RAW: Omit<ProfitRow, 'key'>[] = [
  { date: '17-11-2025', seller: 'FFT DWF',  order: 1,  gmv: 41.94,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 8,      supplierCost: 8,      taxFee: 0, profit: 30.89,   profitPct: 74 },
  { date: '18-11-2025', seller: 'FFT ARG',  order: 11, gmv: 611,     shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 128.18, supplierCost: 128.18, taxFee: 0, profit: 359.59,  profitPct: 59 },
  { date: '18-11-2025', seller: 'FFT BSO',  order: 17, gmv: 1559.63, shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 316.03, supplierCost: 316.03, taxFee: 0, profit: 932.52,  profitPct: 60 },
  { date: '18-11-2025', seller: 'FFT DWF',  order: 5,  gmv: 224.7,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 50.5,   supplierCost: 50.5,   taxFee: 0, profit: 128.65,  profitPct: 57 },
  { date: '19-11-2025', seller: 'ALU',      order: 1,  gmv: 54.98,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 15.5,   supplierCost: 15.5,   taxFee: 0, profit: 28.93,   profitPct: 53 },
  { date: '19-11-2025', seller: 'BVK',      order: 5,  gmv: 204.65,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 33,     supplierCost: 33,     taxFee: 0, profit: 143.60,  profitPct: 70 },
  { date: '19-11-2025', seller: 'FFT ARG',  order: 32, gmv: 1715.68, shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 326.22, supplierCost: 326.22, taxFee: 0, profit: 1068.19, profitPct: 62 },
  { date: '19-11-2025', seller: 'FFT AXX',  order: 1,  gmv: 56.87,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 13.2,   supplierCost: 13.2,   taxFee: 0, profit: 35.42,   profitPct: 62 },
  { date: '19-11-2025', seller: 'FFT BDU',  order: 2,  gmv: 129.96,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 36.2,   supplierCost: 36.2,   taxFee: 0, profit: 62.51,   profitPct: 48 },
  { date: '19-11-2025', seller: 'FFT BGX',  order: 4,  gmv: 338.92,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 40.49,  supplierCost: 40.49,  taxFee: 0, profit: 262.89,  profitPct: 78 },
  { date: '19-11-2025', seller: 'FFT BSO',  order: 27, gmv: 2204.46, shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 456.34, supplierCost: 456.34, taxFee: 0, profit: 1296.73, profitPct: 59 },
  { date: '19-11-2025', seller: 'FFT CAR',  order: 16, gmv: 1484.63, shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 381.12, supplierCost: 381.12, taxFee: 0, profit: 727.34,  profitPct: 49 },
  { date: '19-11-2025', seller: 'FFT DAH',  order: 4,  gmv: 145.86,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 24.96,  supplierCost: 24.96,  taxFee: 0, profit: 100.89,  profitPct: 69 },
  { date: '19-11-2025', seller: 'FFT DEV',  order: 1,  gmv: 24.94,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 5.71,   supplierCost: 5.71,   taxFee: 0, profit: 18.47,   profitPct: 74 },
  { date: '19-11-2025', seller: 'FFT DWF',  order: 5,  gmv: 288.6,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 43.5,   supplierCost: 43.5,   taxFee: 0, profit: 206.55,  profitPct: 72 },
  { date: '19-11-2025', seller: 'FFT GGP',  order: 19, gmv: 1842.58, shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 201.28, supplierCost: 201.28, taxFee: 0, profit: 1444.97, profitPct: 78 },
  { date: '19-11-2025', seller: 'FFT HBA',  order: 2,  gmv: 91.96,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 23.24,  supplierCost: 23.24,  taxFee: 0, profit: 50.11,   profitPct: 54 },
  { date: '19-11-2025', seller: 'FFT HMU',  order: 1,  gmv: 20.93,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 4.52,   supplierCost: 4.52,   taxFee: 0, profit: 16.84,   profitPct: 80 },
  { date: '19-11-2025', seller: 'FFT KVC',  order: 17, gmv: 927.64,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 100.8,  supplierCost: 100.8,  taxFee: 0, profit: 730.99,  profitPct: 79 },
  { date: '19-11-2025', seller: 'FFT NON',  order: 2,  gmv: 101.95,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 14.9,   supplierCost: 14.9,   taxFee: 0, profit: 77.10,   profitPct: 76 },
  { date: '19-11-2025', seller: 'FFT OPU',  order: 3,  gmv: 144.93,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 44,     supplierCost: 44,     taxFee: 0, profit: 61.88,   profitPct: 43 },
  { date: '19-11-2025', seller: 'FFT OSB',  order: 8,  gmv: 411.76,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 85,     supplierCost: 85,     taxFee: 0, profit: 246.71,  profitPct: 60 },
  { date: '19-11-2025', seller: 'FFT QTU',  order: 4,  gmv: 307.43,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 35.6,   supplierCost: 35.6,   taxFee: 0, profit: 241.18,  profitPct: 78 },
  { date: '19-11-2025', seller: 'IVM',      order: 1,  gmv: 32.98,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 8.8,    supplierCost: 8.8,    taxFee: 0, profit: 20.33,   profitPct: 62 },
  { date: '19-11-2025', seller: 'JJC',      order: 4,  gmv: 152.38,  shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 44.53,  supplierCost: 44.53,  taxFee: 0, profit: 68.27,   profitPct: 45 },
  { date: '19-11-2025', seller: 'Test FFT', order: 1,  gmv: 13.34,   shippingCost: 4.95, additionalCost: 0, dispute: 0, paymentGateway: 0, sellerCost: 7.1,    supplierCost: 7.1,    taxFee: 0, profit: 4.09,    profitPct: 31 },
];

export const DATA: ProfitRow[] = RAW.map((r, i) => ({ ...r, key: String(i) }));

export const SELLER_OPTIONS = [...new Set(DATA.map((r) => r.seller))].map((s) => ({
  label: s,
  value: s,
}));

export const COMCODE_OPTIONS = [
  { label: 'ZeniroxPay', value: 'ZeniroxPay' },
  { label: 'Ontario',    value: 'Ontario' },
  { label: 'Vicbea',     value: 'Vicbea' },
  { label: 'MessiPay',   value: 'MessiPay' },
];

export const STATUS_OPTIONS = [
  { label: 'Fulfilled', value: 'Fulfilled' },
  { label: 'Unfulfilled', value: 'Unfulfilled' },
];