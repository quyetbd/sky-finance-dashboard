export type ProfitRow = {
  key: string;
  date: string;
  seller: string;
  order: number;
  gmv: number;
  shippingCost: number;
  additionalCost: number;
  dispute: number;
  paymentGateway: number;
  sellerCost: number;
  supplierCost: number;
  taxFee: number;
  profit: number;
  profitPct: number;
};

export type ProfitTotals = {
  order: number;
  gmv: number;
  shippingCost: number;
  additionalCost: number;
  paymentGateway: number;
  sellerCost: number;
  supplierCost: number;
  taxFee: number;
  profit: number;
};
