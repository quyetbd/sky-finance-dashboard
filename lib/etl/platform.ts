/**
 * Platform Order Parser — ETL for Platform Order Excel
 *
 * Input: Excel từ Bettamax Platform với columns:
 *   OrderID | StoreName | SellerEmail | ItemCode | Quantity | UnitPrice | ShippingFee |
 *   SupplierCost | SellerCost | AdditionalCost | TaxFee | Segment | ItemStatus |
 *   PaidAt | FulfilledAt | PaymentGateway | BuyerCountry | Domain
 *
 * Output: { orders: Order[], orderItems: OrderItem[] }
 */

import * as XLSX from 'xlsx'
import Decimal from 'decimal.js'

export type PlatformOrderRow = {
  OrderID: string
  StoreName: string
  SellerEmail: string
  ItemCode: string
  Quantity: number
  UnitPrice: number
  ShippingFee?: number
  SupplierCost?: number
  SellerCost?: number
  AdditionalCost?: number
  TaxFee?: number
  Segment?: string
  ItemStatus: string
  PaidAt?: string
  FulfilledAt?: string
  PaymentGateway: string
  BuyerCountry?: string
  Domain?: string
}

export type OrderParsed = {
  orderId: string
  storeName: string
  segment?: string
  itemStatus: string
  paidAt?: Date
  fulfilledAt?: Date
  sellerEmail: string
  buyerCountry?: string
  domain?: string
  paymentGatewayName: string
}

export type OrderItemParsed = {
  orderId: string
  itemCode: string
  quantity: number
  unitPrice: Decimal
  shippingFee: Decimal
  totalPrice: Decimal
  supplierCost?: Decimal
  sellerCost?: Decimal
  additionalCost?: Decimal
  taxFee?: Decimal
}

/**
 * Parse Platform Order Excel file
 */
export function parsePlatformOrders(
  fileBuffer: Buffer
): { orders: OrderParsed[]; orderItems: OrderItemParsed[] } {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<PlatformOrderRow>(sheet)

  const ordersMap = new Map<string, OrderParsed>()
  const orderItems: OrderItemParsed[] = []

  for (const row of rows) {
    const orderId = row.OrderID

    // Create or get order
    if (!ordersMap.has(orderId)) {
      ordersMap.set(orderId, {
        orderId,
        storeName: row.StoreName,
        segment: row.Segment || undefined,
        itemStatus: row.ItemStatus,
        paidAt: row.PaidAt ? new Date(row.PaidAt) : undefined,
        fulfilledAt: row.FulfilledAt ? new Date(row.FulfilledAt) : undefined,
        sellerEmail: row.SellerEmail,
        buyerCountry: row.BuyerCountry || undefined,
        domain: row.Domain || undefined,
        paymentGatewayName: row.PaymentGateway,
      })
    }

    // Add order item
    const totalPrice =
      new Decimal(row.UnitPrice).mul(row.Quantity).plus(row.ShippingFee || 0)

    orderItems.push({
      orderId,
      itemCode: row.ItemCode,
      quantity: row.Quantity,
      unitPrice: new Decimal(row.UnitPrice),
      shippingFee: new Decimal(row.ShippingFee || 0),
      totalPrice,
      supplierCost: row.SupplierCost ? new Decimal(row.SupplierCost) : undefined,
      sellerCost: row.SellerCost ? new Decimal(row.SellerCost) : undefined,
      additionalCost: row.AdditionalCost ? new Decimal(row.AdditionalCost) : undefined,
      taxFee: row.TaxFee ? new Decimal(row.TaxFee) : undefined,
    })
  }

  return {
    orders: Array.from(ordersMap.values()),
    orderItems,
  }
}
