export type ByMarketRow = {
  key: string;
  country: string;
  order: number;
  gmv: number;
  shippingCost: number;
  additionalCost: number;
  dispute3Pct: number;
  paymentGateway: number;
  sellerCost: number;
  supplierCost: number;
  taxFee: number;
  profit: number;
  profitPct: number;
  children?: ByMarketRow[];
};

export type ByMarketTotals = {
  order: number;
  gmv: number;
  shippingCost: number;
  additionalCost: number;
  dispute3Pct: number;
  paymentGateway: number;
  sellerCost: number;
  supplierCost: number;
  taxFee: number;
  profit: number;
};
