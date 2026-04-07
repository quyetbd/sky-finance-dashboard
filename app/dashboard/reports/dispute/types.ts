export type DisputeRow = {
  key: string;
  caseType: string;
  orderId: string;
  disputeAmt: number;
  disputeExp: number;
  sellerCost: number;
  supplierCost: number;
  totalFulfillCost: number;
  totalTaxFee: number;
  totalAdditionalCost: number;
  totalPrice: number;
  dispute3Pct: number;
  netDisputeCost: number;
};

export type DisputeTotals = {
  totalFulfillCost: number;
  totalTaxFee: number;
  totalAdditionalCost: number;
  totalPrice: number;
};
