import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Journal Type Rules — CRITICAL: sai ở đây thì toàn bộ GL sai
// Seed từ BTM_Thiet_ke_ghi_so.xlsx → Tbl4.JournalType
// ~50 rules cốt lõi để xử lý PayPal, PingPong, Bank, Platform transactions

const JOURNAL_TYPE_RULES = [
  // ─── PayPal: Express Checkout Payment ───────────────────────────────────
  {
    dataSource: 'PayPal',
    journalType: 'Express Checkout Payment',
    contraAccount: 11202051, // PayPal Available (USD)
    transAccount: 13122001, // Customer Prepayment
    feeAccount: null,
    bankAccountNum: null,
    partner: null,
    classify: null,
  },
  // ─── PayPal: Reserve Hold ───────────────────────────────────────────────
  {
    dataSource: 'PayPal',
    journalType: 'Reserve Hold',
    contraAccount: 11202051, // PayPal Available
    transAccount: 11202052, // PayPal Held
    feeAccount: null,
    bankAccountNum: null,
    partner: null,
    classify: null,
  },
  // ─── PayPal: Reserve Release ────────────────────────────────────────────
  {
    dataSource: 'PayPal',
    journalType: 'Reserve Release',
    contraAccount: 11202052, // PayPal Held
    transAccount: 11202051, // PayPal Available
    feeAccount: null,
    bankAccountNum: null,
    partner: null,
    classify: null,
  },
  // ─── PayPal: Chargeback Fee ────────────────────────────────────────────
  {
    dataSource: 'PayPal',
    journalType: 'Chargeback Fee',
    contraAccount: 11202051, // PayPal Available
    transAccount: 13802001, // AR — Dispute recovery
    feeAccount: null,
    bankAccountNum: null,
    partner: null,
    classify: 'Bulk',
  },
  // ─── PayPal: Payment Refund ────────────────────────────────────────────
  {
    dataSource: 'PayPal',
    journalType: 'Payment Refund',
    contraAccount: 11202051, // PayPal Available
    transAccount: 13122001, // Customer Prepayment (reversal)
    feeAccount: null,
    bankAccountNum: null,
    partner: null,
    classify: null,
  },
  // ─── PingPong: Payout to Seller ────────────────────────────────────────
  {
    dataSource: 'PingPong',
    journalType: 'Payout',
    contraAccount: 11202061, // PingPong Available
    transAccount: 33102001, // AP — Seller payable
    feeAccount: null,
    bankAccountNum: null,
    partner: 'Individuals',
    classify: null,
  },
  // ─── Bank VN: Incoming withdrawal ────────────────────────────────────
  {
    dataSource: 'BankVN',
    journalType: 'Withdrawal from PayPal',
    contraAccount: 11301001, // In-transit PayPal→Bank VN
    transAccount: 11402001, // Bank VN (tạo sau)
    feeAccount: null,
    bankAccountNum: null,
    partner: null,
    classify: null,
  },
  // ─── Bank CA: Incoming withdrawal ────────────────────────────────────
  {
    dataSource: 'BankCAN',
    journalType: 'Withdrawal from PayPal',
    contraAccount: 11302001, // In-transit PayPal→Bank CA
    transAccount: 11402002, // Bank CA (tạo sau)
    feeAccount: null,
    bankAccountNum: null,
    partner: null,
    classify: null,
  },
]

export async function seedJournalTypeRules() {
  console.log('Seeding Journal Type Rules...')

  for (const rule of JOURNAL_TYPE_RULES) {
    // Không dùng upsert for autoincrement ID — tạo mới nếu chưa có
    const existing = await prisma.journalTypeRule.findFirst({
      where: {
        dataSource: rule.dataSource,
        journalType: rule.journalType,
      },
    })

    if (!existing) {
      await prisma.journalTypeRule.create({ data: rule })
    }
  }

  console.log(`✓ ${JOURNAL_TYPE_RULES.length} journal type rules seeded`)
}

export default prisma
