import { NextResponse } from 'next/server'

// TODO: POST — Upload Orders Excel file
// - Parse file dùng parsePlatformOrders()
// - Validate dữ liệu
// - assertPeriodOpen() middleware check
// - Insert orders + order_items
// - Refresh ProfitSummary

export async function POST() {
  return NextResponse.json({
    error: 'Not implemented',
  }, { status: 501 })
}
