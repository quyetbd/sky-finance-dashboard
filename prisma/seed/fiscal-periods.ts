import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// 4 comcode active (phải khớp với companies.ts)
const COMCODES = ['ZeniroxPay', 'Ontario', 'Vicbea', 'MessiPay']

// Mock: 2025 đã có đủ 12 tháng với các trạng thái thực tế
// 2026 có 4 tháng đầu năm (đang chạy), tháng còn lại chưa mở
function buildMonthlyPeriods(year: number) {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1 // 1-based

  const records: {
    id: string
    companyId: string
    year: number
    quarter: number
    month: number
    startDate: Date
    endDate: Date
    status: string
    note: string
  }[] = []

  for (const comcode of COMCODES) {
    for (let month = 1; month <= 12; month++) {
      const quarter = Math.ceil(month / 3)
      const periodStr = `${year}${String(month).padStart(2, '0')}`

      // startDate = ngày 1 của tháng (UTC)
      const startDate = new Date(Date.UTC(year, month - 1, 1))
      // endDate = ngày cuối tháng 23:59:59.999 (UTC)
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))

      // Logic status theo mock thực tế:
      let status: string
      if (year < currentYear) {
        // Năm trước: tất cả Closed (đã quyết toán)
        status = 'Closed'
      } else if (year === currentYear) {
        if (month < currentMonth - 1) {
          // Các tháng cũ hơn tháng trước: Closed
          status = 'Closed'
        } else if (month === currentMonth - 1) {
          // Tháng trước: một số công ty vẫn Open (đang quyết toán)
          // ZeniroxPay và Ontario đã Closed, Vicbea và MessiPay còn Open
          status = ['ZeniroxPay', 'Ontario'].includes(comcode) ? 'Closed' : 'Open'
        } else if (month === currentMonth) {
          // Tháng hiện tại: tất cả Open
          status = 'Open'
        } else {
          // Tháng tương lai trong năm này: Pending
          status = 'Pending'
        }
      } else {
        // Năm tương lai: Pending hết
        status = 'Pending'
      }

      records.push({
        id: `${comcode}_${periodStr}`,
        companyId: comcode,
        year,
        quarter,
        month,
        startDate,
        endDate,
        status,
        note: `Kỳ báo cáo ${year}`,
      })
    }
  }

  return records
}

export async function seedFiscalPeriods() {
  console.log('Seeding FiscalPeriods...')

  // Xóa data cũ để seed lại sạch
  await prisma.fiscalPeriod.deleteMany({})

  const years = [2025, 2026]
  let total = 0

  for (const year of years) {
    const records = buildMonthlyPeriods(year)

    await prisma.fiscalPeriod.createMany({
      data: records,
      skipDuplicates: true,
    })

    total += records.length
    console.log(`  ✓ Year ${year}: ${records.length} records (${COMCODES.length} companies × 12 months)`)
  }

  console.log(`✓ ${total} FiscalPeriod records seeded`)
}

export default prisma
