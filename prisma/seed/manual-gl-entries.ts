import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Manual GL Entry seed data — period 202604 (April 2026 — Open)
// Format: 5 pairs (10 GL lines) trải đều các trạng thái Draft / Posted
// DocNum format: YYYYMM + 6-digit seq per (comcode, period)
//   ZeniroxPay 202604: 202604000001, 202604000002, 202604000003
//   Ontario    202604: 202604000001, 202604000002

const PERIOD = '202604'

// ─── ZeniroxPay (USD) ─────────────────────────────────────────────────────────

const ZNX_ENTRIES = [
  // Pair 1 — Draft — "Accruals" — Ghi nhận khoản phải thu Dispute tháng 4/2026
  {
    id: `${PERIOD}00000021`,
    comcode: 'ZeniroxPay', dataSource: 'Manual',
    journalType: 'Accruals',
    docNum: `${PERIOD}000001`,
    period: PERIOD,
    transDate: new Date('2026-04-01T00:00:00.000Z'),
    docDate: new Date('2026-04-01T00:00:00.000Z'),
    inputCurr: 'USD', fncCurr: 'USD',
    accountCode: 13802001,  // AR — Chargeback/Dispute
    inputDr: 320.00, inputCr: 0,
    xRate: 1, rateType: 'Mul', accountedDr: 320.00, accountedCr: 0,
    description: 'Ghi nhận phải thu — dispute order BVWQZ-040126 đã xử lý thắng',
    balanceImpact: 'Credit', referenceTxnId: null, refNum: 'ACR-ZNX-202604-001',
    isReversal: false, reversedId: null, partnerTaxId: null, segment: 'ZeniroxPay',
    glStatus: 'Draft', createdBy: 'accountant01',
  },
  {
    id: `${PERIOD}00000022`,
    comcode: 'ZeniroxPay', dataSource: 'Manual',
    journalType: 'Accruals',
    docNum: `${PERIOD}000001`,
    period: PERIOD,
    transDate: new Date('2026-04-01T00:00:00.000Z'),
    docDate: new Date('2026-04-01T00:00:00.000Z'),
    inputCurr: 'USD', fncCurr: 'USD',
    accountCode: 51112001,  // Doanh thu bán hàng
    inputDr: 0, inputCr: 320.00,
    xRate: 1, rateType: 'Mul', accountedDr: 0, accountedCr: 320.00,
    description: 'Ghi nhận phải thu — dispute order BVWQZ-040126 đã xử lý thắng',
    balanceImpact: 'Credit', referenceTxnId: null, refNum: 'ACR-ZNX-202604-001',
    isReversal: false, reversedId: null, partnerTaxId: null, segment: 'ZeniroxPay',
    glStatus: 'Draft', createdBy: 'accountant01',
  },

  // Pair 2 — Draft — "Adjustments" — Chuyển số dư Reserve sang Available
  {
    id: `${PERIOD}00000023`,
    comcode: 'ZeniroxPay', dataSource: 'Manual',
    journalType: 'Adjustments',
    docNum: `${PERIOD}000002`,
    period: PERIOD,
    transDate: new Date('2026-04-03T00:00:00.000Z'),
    docDate: new Date('2026-04-03T00:00:00.000Z'),
    inputCurr: 'USD', fncCurr: 'USD',
    accountCode: 11202051,  // PayPal Available (USD)
    inputDr: 500.00, inputCr: 0,
    xRate: 1, rateType: 'Mul', accountedDr: 500.00, accountedCr: 0,
    description: 'Điều chỉnh: Reserve tự động release — xác nhận Available Q2/2026',
    balanceImpact: 'No Impact', referenceTxnId: 'PP-ADJ-20260403-001', refNum: null,
    isReversal: false, reversedId: null, partnerTaxId: null, segment: 'ZeniroxPay',
    glStatus: 'Draft', createdBy: 'accountant01',
  },
  {
    id: `${PERIOD}00000024`,
    comcode: 'ZeniroxPay', dataSource: 'Manual',
    journalType: 'Adjustments',
    docNum: `${PERIOD}000002`,
    period: PERIOD,
    transDate: new Date('2026-04-03T00:00:00.000Z'),
    docDate: new Date('2026-04-03T00:00:00.000Z'),
    inputCurr: 'USD', fncCurr: 'USD',
    accountCode: 11202052,  // PayPal Held/Reserve (USD)
    inputDr: 0, inputCr: 500.00,
    xRate: 1, rateType: 'Mul', accountedDr: 0, accountedCr: 500.00,
    description: 'Điều chỉnh: Reserve tự động release — xác nhận Available Q2/2026',
    balanceImpact: 'No Impact', referenceTxnId: 'PP-ADJ-20260403-001', refNum: null,
    isReversal: false, reversedId: null, partnerTaxId: null, segment: 'ZeniroxPay',
    glStatus: 'Draft', createdBy: 'accountant01',
  },

  // Pair 3 — Posted — "Seller Cost Accruals" — Dự phòng phải trả Seller cuối tháng
  {
    id: `${PERIOD}00000025`,
    comcode: 'ZeniroxPay', dataSource: 'Manual',
    journalType: 'Seller Cost Accruals',
    docNum: `${PERIOD}000003`,
    period: PERIOD,
    transDate: new Date('2026-04-05T00:00:00.000Z'),
    docDate: new Date('2026-04-05T00:00:00.000Z'),
    inputCurr: 'USD', fncCurr: 'USD',
    accountCode: 33102001,  // Phải trả Seller
    inputDr: 1200.00, inputCr: 0,
    xRate: 1, rateType: 'Mul', accountedDr: 1200.00, accountedCr: 0,
    description: 'Thanh toán Seller tháng 04/2026 qua PingPong — seller@example.com',
    balanceImpact: 'Debit', referenceTxnId: null, refNum: 'PP2-ZNX-202604-PAY',
    isReversal: false, reversedId: null, partnerTaxId: 'seller@example.com', segment: 'ZeniroxPay',
    glStatus: 'Posted', createdBy: 'accountant01',
  },
  {
    id: `${PERIOD}00000026`,
    comcode: 'ZeniroxPay', dataSource: 'Manual',
    journalType: 'Seller Cost Accruals',
    docNum: `${PERIOD}000003`,
    period: PERIOD,
    transDate: new Date('2026-04-05T00:00:00.000Z'),
    docDate: new Date('2026-04-05T00:00:00.000Z'),
    inputCurr: 'USD', fncCurr: 'USD',
    accountCode: 11202061,  // PingPong Available (USD)
    inputDr: 0, inputCr: 1200.00,
    xRate: 1, rateType: 'Mul', accountedDr: 0, accountedCr: 1200.00,
    description: 'Thanh toán Seller tháng 04/2026 qua PingPong — seller@example.com',
    balanceImpact: 'Debit', referenceTxnId: null, refNum: 'PP2-ZNX-202604-PAY',
    isReversal: false, reversedId: null, partnerTaxId: 'seller@example.com', segment: 'ZeniroxPay',
    glStatus: 'Posted', createdBy: 'accountant01',
  },
]

// ─── Ontario (CAD) ────────────────────────────────────────────────────────────

const ONT_ENTRIES = [
  // Pair 4 — Draft — "Adjustments" — Đối soát số dư PayPal CAD
  {
    id: `${PERIOD}00000027`,
    comcode: 'Ontario', dataSource: 'Manual',
    journalType: 'Adjustments',
    docNum: `${PERIOD}000001`,
    period: PERIOD,
    transDate: new Date('2026-04-07T00:00:00.000Z'),
    docDate: new Date('2026-04-07T00:00:00.000Z'),
    inputCurr: 'CAD', fncCurr: 'CAD',
    accountCode: 11202053,  // PayPal Available (CAD)
    inputDr: 750.00, inputCr: 0,
    xRate: 1, rateType: 'Mul', accountedDr: 750.00, accountedCr: 0,
    description: 'Đối soát số dư PayPal CAD — khách hàng thanh toán order Q2 chưa match',
    balanceImpact: 'Credit', referenceTxnId: 'PP-ONT-ADJ-20260407', refNum: null,
    isReversal: false, reversedId: null, partnerTaxId: null, segment: 'Ontario',
    glStatus: 'Draft', createdBy: 'accountant02',
  },
  {
    id: `${PERIOD}00000028`,
    comcode: 'Ontario', dataSource: 'Manual',
    journalType: 'Adjustments',
    docNum: `${PERIOD}000001`,
    period: PERIOD,
    transDate: new Date('2026-04-07T00:00:00.000Z'),
    docDate: new Date('2026-04-07T00:00:00.000Z'),
    inputCurr: 'CAD', fncCurr: 'CAD',
    accountCode: 13122001,  // Khách hàng trả tiền trước
    inputDr: 0, inputCr: 750.00,
    xRate: 1, rateType: 'Mul', accountedDr: 0, accountedCr: 750.00,
    description: 'Đối soát số dư PayPal CAD — khách hàng thanh toán order Q2 chưa match',
    balanceImpact: 'Credit', referenceTxnId: 'PP-ONT-ADJ-20260407', refNum: null,
    isReversal: false, reversedId: null, partnerTaxId: null, segment: 'Ontario',
    glStatus: 'Draft', createdBy: 'accountant02',
  },

  // Pair 5 — Posted — "Supplier Cost Accruals" — Dự phòng phải trả Supplier
  {
    id: `${PERIOD}00000029`,
    comcode: 'Ontario', dataSource: 'Manual',
    journalType: 'Supplier Cost Accruals',
    docNum: `${PERIOD}000002`,
    period: PERIOD,
    transDate: new Date('2026-04-05T00:00:00.000Z'),
    docDate: new Date('2026-04-05T00:00:00.000Z'),
    inputCurr: 'CAD', fncCurr: 'CAD',
    accountCode: 33102002,  // Phải trả Supplier
    inputDr: 2800.00, inputCr: 0,
    xRate: 1, rateType: 'Mul', accountedDr: 2800.00, accountedCr: 0,
    description: 'Dự phòng chi phí Supplier tháng 04/2026 — Supplier A (đơn hàng Q2)',
    balanceImpact: 'Debit', referenceTxnId: null, refNum: 'SUP-ONT-202604-001',
    isReversal: false, reversedId: null, partnerTaxId: null, segment: 'Ontario',
    glStatus: 'Posted', createdBy: 'accountant02',
  },
  {
    id: `${PERIOD}00000030`,
    comcode: 'Ontario', dataSource: 'Manual',
    journalType: 'Supplier Cost Accruals',
    docNum: `${PERIOD}000002`,
    period: PERIOD,
    transDate: new Date('2026-04-05T00:00:00.000Z'),
    docDate: new Date('2026-04-05T00:00:00.000Z'),
    inputCurr: 'CAD', fncCurr: 'CAD',
    accountCode: 11202053,  // PayPal Available (CAD) — dùng tạm, thực tế là Bank CA
    inputDr: 0, inputCr: 2800.00,
    xRate: 1, rateType: 'Mul', accountedDr: 0, accountedCr: 2800.00,
    description: 'Dự phòng chi phí Supplier tháng 04/2026 — Supplier A (đơn hàng Q2)',
    balanceImpact: 'Debit', referenceTxnId: null, refNum: 'SUP-ONT-202604-001',
    isReversal: false, reversedId: null, partnerTaxId: null, segment: 'Ontario',
    glStatus: 'Posted', createdBy: 'accountant02',
  },
]

const ALL_MANUAL_ENTRIES = [...ZNX_ENTRIES, ...ONT_ENTRIES]

// Manual JournalType rules — cho AutoComplete trong form
const MANUAL_JOURNAL_RULES = [
  {
    dataSource: 'Manual',
    journalType: 'Accruals',
    transAccount: 13802001,  // AR — Dispute/Chargeback
    contraAccount: 51112001, // Doanh thu
    feeAccount: null, bankAccountNum: null, partner: null, classify: null,
  },
  {
    dataSource: 'Manual',
    journalType: 'Adjustments',
    transAccount: 11202051,  // PayPal Available USD
    contraAccount: 11202052, // PayPal Held/Reserve USD
    feeAccount: null, bankAccountNum: null, partner: null, classify: null,
  },
  {
    dataSource: 'Manual',
    journalType: 'Seller Cost Accruals',
    transAccount: 33102001,  // Phải trả Seller
    contraAccount: 11202061, // PingPong Available USD
    feeAccount: null, bankAccountNum: null, partner: null, classify: null,
  },
  {
    dataSource: 'Manual',
    journalType: 'Supplier Cost Accruals',
    transAccount: 33102002,  // Phải trả Supplier
    contraAccount: 11202053, // PayPal Available CAD
    feeAccount: null, bankAccountNum: null, partner: null, classify: null,
  },
  {
    dataSource: 'Manual',
    journalType: 'Reversal',
    transAccount: 11202051,
    contraAccount: 11202052,
    feeAccount: null, bankAccountNum: null, partner: null, classify: null,
  },
]

export async function seedManualGlEntries() {
  console.log('--- Seeding Manual GL Entries ---')

  // 1. Upsert Manual JournalType rules
  for (const rule of MANUAL_JOURNAL_RULES) {
    const existing = await prisma.journalTypeRule.findFirst({
      where: { dataSource: rule.dataSource, journalType: rule.journalType },
    })
    if (!existing) {
      await prisma.journalTypeRule.create({ data: rule })
    }
  }
  console.log(`  ✓ ${MANUAL_JOURNAL_RULES.length} manual journal type rules`)

  // 2. Create GL entries (skip if already exists)
  const result = await prisma.glEntry.createMany({
    data: ALL_MANUAL_ENTRIES as NonNullable<Parameters<typeof prisma.glEntry.createMany>[0]>['data'],
    skipDuplicates: true,
  })
  console.log(`  ✓ ${result.count} manual GL entries seeded`)

  // 3. Bump doc_manual sequences so new entries don't clash with seeded DocNums
  //    ZeniroxPay 202604 → last DocNum is 000003, bump seq to 4
  //    Ontario    202604 → last DocNum is 000002, bump seq to 3
  const sequences = [
    { seqName: `doc_manual_ZeniroxPay_${PERIOD}`, startAt: 4 },
    { seqName: `doc_manual_Ontario_${PERIOD}`, startAt: 3 },
  ]
  for (const { seqName, startAt } of sequences) {
    await prisma.$executeRawUnsafe(`
      CREATE SEQUENCE IF NOT EXISTS "${seqName}"
      START WITH ${startAt} INCREMENT BY 1 NO MAXVALUE NO CYCLE
    `)
    // If sequence already exists, set its value to at least startAt
    await prisma.$executeRawUnsafe(`
      SELECT setval('"${seqName}"', GREATEST(last_value, ${startAt - 1}), true)
      FROM "${seqName}"
    `)
  }
  console.log('  ✓ doc_manual sequences initialized')

  await prisma.$disconnect()
}
