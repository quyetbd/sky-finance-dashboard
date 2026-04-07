import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Chart of Accounts — 14 tài khoản cốt lõi của BTM Finance
// Source: BTM_Thiet_ke_ghi_so.xlsx → Tbl3.CoA
// Bổ sung ~106 TK còn lại từ file Excel trước khi go-live
const COA_DATA = [
  // ── PayPal Accounts ─────────────────────────────────────────────
  { accountCode: 11202051, accountName: 'PayPal — Available (USD)',              accountType: 'A', balanceSide: 'Dr', arap: null },
  { accountCode: 11202052, accountName: 'PayPal — Held/Reserve/Review (USD)',    accountType: 'A', balanceSide: 'Dr', arap: null },
  { accountCode: 11202053, accountName: 'PayPal — Available (CAD)',              accountType: 'A', balanceSide: 'Dr', arap: null },
  { accountCode: 11202054, accountName: 'PayPal — Held/Reserve (CAD)',           accountType: 'A', balanceSide: 'Dr', arap: null },
  // ── PingPong Accounts ────────────────────────────────────────────
  { accountCode: 11202061, accountName: 'PingPong — Available (USD)',            accountType: 'A', balanceSide: 'Dr', arap: null },
  { accountCode: 11202062, accountName: 'PingPong — Pending/Reserve (USD)',      accountType: 'A', balanceSide: 'Dr', arap: null },
  // ── Bank Transfer in Transit ─────────────────────────────────────
  { accountCode: 11301001, accountName: 'Rút PayPal → Bank VN (đang chuyển)',   accountType: 'A', balanceSide: 'Dr', arap: null },
  { accountCode: 11302001, accountName: 'Rút PayPal → Bank CA (đang chuyển)',   accountType: 'A', balanceSide: 'Dr', arap: null },
  // ── Receivables ──────────────────────────────────────────────────
  { accountCode: 13122001, accountName: 'Khách hàng trả tiền trước (Global/CA)', accountType: 'A', balanceSide: 'Dr', arap: 'AR' },
  { accountCode: 13802001, accountName: 'Phải thu — Chargeback/Dispute chờ xử lý', accountType: 'A', balanceSide: 'Dr', arap: 'AR' },
  // ── Payables ─────────────────────────────────────────────────────
  { accountCode: 33102001, accountName: 'Phải trả Seller',                      accountType: 'L', balanceSide: 'Cr', arap: 'AP' },
  { accountCode: 33102002, accountName: 'Phải trả Supplier',                    accountType: 'L', balanceSide: 'Cr', arap: 'AP' },
  // ── Revenue ──────────────────────────────────────────────────────
  { accountCode: 51112001, accountName: 'Doanh thu bán hàng',                   accountType: 'R', balanceSide: 'Cr', arap: null },
  { accountCode: 51131001, accountName: 'Doanh thu phí vận chuyển',             accountType: 'R', balanceSide: 'Cr', arap: null },
]

export async function seedCoA() {
  console.log('Seeding Chart of Accounts...')

  for (const account of COA_DATA) {
    await prisma.chartOfAccount.upsert({
      where: { accountCode: account.accountCode },
      update: account,
      create: account,
    })
  }

  console.log(`✓ ${COA_DATA.length} accounts seeded`)
}

export default prisma
