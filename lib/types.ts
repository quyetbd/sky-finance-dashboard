// BTM Finance — Shared Types

export type ApiResponse<T> = {
  data: T
  meta?: {
    total: number
    page: number
    pageSize: number
  }
  error?: string
}

export type PaginationParams = {
  page?: number
  pageSize?: number
}

// Role hierarchy: Admin > Accountant > AM | Director | FC > Viewer
export type UserRole = 'Admin' | 'Accountant' | 'AM' | 'Director' | 'FC' | 'Viewer'

// Datasource identifiers used across GL engine and staging tables
export type DataSource = 'PayPal' | 'Platform' | 'PingPong' | 'BankVN' | 'BankCAN' | 'Manual'

// Period status
export type PeriodStatus = 'Pending' | 'Open' | 'Closed'

// Invoice workflow status
export type InvoiceStatus = 'New' | 'AM Confirmed' | 'Director Confirmed' | 'FC Confirmed' | 'Paid'

// Dispute normalized status
export type DisputeStatus = 'Open' | 'Closed'

// Rate type for currency conversion
export type RateType = 'Mul' | 'Div'

// ─── Fiscal Period ────────────────────────────────────────────────────────────

// Flat record từ API (1 row = 1 company × 1 period)
export type FiscalPeriodRecord = {
  id: string           // "{companyId}_{YYYYMM}" e.g. "ZeniroxPay_202501"
  companyId: string
  year: number
  quarter: number
  month: number
  startDate: string    // ISO string
  endDate: string      // ISO string
  status: PeriodStatus
  note: string | null
}

// Frontend grouped row: 1 dòng trong main table = 1 (year, month)
// companies[] chứa tất cả company sub-rows để expandedRowRender
export type PeriodGroupRow = {
  key: string          // "{year}_{MM}" — unique key cho Ant Design Table
  year: number
  quarter: number
  month: number
  startDate: string
  endDate: string
  note: string | null
  companies: FiscalPeriodRecord[]
  overallStatus: 'all-open' | 'all-closed' | 'mixed' | 'all-pending'
}

export type PeriodType = 'Tháng' | 'Quý'

// GL entry post status (Manual entries only)
export type GlStatus = 'Draft' | 'Posted'

// ─── Manual GL Entry ──────────────────────────────────────────────────────────

// Paired representation: 1 UI row = 1 DocNum = 2 GL lines (Dr + Cr)
export type ManualGLPair = {
  docNum: string          // YYYYMM + 6-digit seq per (comcode, period)
  comcode: string
  date: string            // ISO string (= transDate)
  period: string          // YYYYMM
  journalType: string
  transAccount: number    // Dr accountCode
  contraAccount: number   // Cr accountCode
  currency: string        // inputCurr (= fncCurr from company, read-only)
  amount: string          // Decimal string, 2dp
  partnerCode: string | null
  description: string | null
  balanceImpact: string | null
  referenceTxnId: string | null
  refNum: string | null
  xRate: string           // "1.000000" — read-only
  glStatus: GlStatus
  createdAt: string
  createdBy: string
  drLineId: string        // id of Dr GlEntry line
  crLineId: string        // id of Cr GlEntry line
}

export type CreateManualGLPayload = {
  comcode: string
  period: string
  journalType: string
  transAccount: number
  contraAccount: number
  amount: string
  currency: string
  date: string            // YYYY-MM-DD
  partnerCode?: string
  description?: string
  balanceImpact?: string
  referenceTxnId?: string
  refNum?: string
}

export type InitializePayload = {
  year: number
  periodType: PeriodType
  note: string
}

// ─── PayPal Staging ───────────────────────────────────────────────────────────

export type PaypalClassify = 'Bulk' | 'Single'

// One row in the PayPal staging table (maps to PaypalTransaction DB model)
export type PaypalStagingRow = {
  id: number
  comcode: string
  date: string              // ISO date string (YYYY-MM-DD)
  journalType: string
  docNum: string | null
  bankAccountNum: string | null
  period: string            // YYYYMM
  currency: string
  gross: number
  fee: number
  net: number
  transactionId: string
  partnerCode: string | null
  description: string | null
  balanceImpact: string | null
  refTxnId: string | null
  refNum: string | null
  xrate: number | null
  classify: PaypalClassify
  datasource: string
  glPosted: boolean
}

export type PaypalFilter = {
  comcode: string           // comcode value or 'all'
  period: string            // YYYYMM or ''
  status: 'all' | 'posted' | 'unposted'
}

// ─── BettaMax Staging ─────────────────────────────────────────────────────────

// One row in the BettaMax platform staging table
export type BettamaxStagingRow = {
  id: number
  comcode: string
  transdate: string         // ISO date string (YYYY-MM-DD)
  journalType: string
  docNum: string | null
  period: string            // YYYYMM
  currency: string
  amount: number
  xrate: number | null
  partnerCode: string | null
  datasource: string
  glPosted: boolean
}

export type BettamaxFilter = {
  comcode: string           // comcode value or 'all'
  period: string            // YYYYMM or ''
  status: 'all' | 'posted' | 'unposted'
}

// ─── PingPong Staging ─────────────────────────────────────────────────────────

// One row in the PingPong staging table (maps to PingPongTransaction DB model)
export type PingPongStagingRow = {
  id: number
  comcode: string
  date: string              // ISO date string (YYYY-MM-DD)
  journalType: string
  docNum: string | null
  bankAccountNum: string | null
  period: string            // YYYYMM
  currency: string
  amount: number
  partnerCode: string | null
  description: string | null
  balanceImpact: string | null
  refTxnId: string | null
  refNum: string | null
  xrate: number | null
  datasource: string        // default 'BankCAN'
  glPosted: boolean
}

export type PingPongFilter = {
  comcode: string           // comcode value or 'all'
  period: string            // YYYYMM or ''
  status: 'all' | 'posted' | 'unposted'
}

// ─── Bank Staging ─────────────────────────────────────────────────────────────

// One row in the Bank staging table (maps to BankTransaction DB model)
export type BankStagingRow = {
  id: number
  comcode: string
  date: string              // ISO date string (YYYY-MM-DD)
  journalType: string
  docNum: string | null
  bankAccountNum: string | null
  period: string            // YYYYMM
  currency: string
  amount: number
  partnerCode: string | null
  description: string | null
  balanceImpact: 'Debit' | 'Credit' | null
  refTxnId: string | null
  refNum: string | null
  xrate: number | null
  datasource: string        // e.g. 'BankCAN', 'BankVN'
  glPosted: boolean
}

export type BankFilter = {
  comcode: string           // comcode value or 'all'
  period: string            // YYYYMM or ''
  status: 'all' | 'posted' | 'unposted'
}

// ─── Exchange Rate ────────────────────────────────────────────────────────────

export type ExchangeRateRow = {
  id: number
  period: string      // YYYYMM
  date: string        // ISO string
  fncCurr: string     // Functional currency, e.g. USD
  inputCurr: string   // Transaction currency, e.g. VND | CAD
  rateType: RateType  // Mul | Div
  rate: string        // Decimal string, 6dp
}

export type ExchangeRatePayload = {
  period: string
  date: string        // YYYY-MM-DD
  fncCurr: string
  inputCurr: string
  rateType: RateType
  rate: string
}

// ─── Chart of Accounts ───────────────────────────────────────────────────────

export const ACCOUNT_TYPE_OPTIONS = [
  { value: 'A',   label: 'A',   desc: 'Asset' },
  { value: 'L',   label: 'L',   desc: 'Liability' },
  { value: 'E',   label: 'E',   desc: 'Equity' },
  { value: 'R',   label: 'R',   desc: 'Revenue' },
  { value: 'Exp', label: 'Exp', desc: 'Expense' },
] as const

export const ARAP_TYPE_OPTIONS = [
  'Receivables from Customers',
  'Advances from Customers',
  'Other receivables',
  'Payable to Suppliers',
  'Advance to Suppliers',
  'Other payables',
] as const

export type ArapType = typeof ARAP_TYPE_OPTIONS[number]

export type ChartOfAccountRow = {
  accountCode: number
  accountName: string
  accountType: string   // A | L | E | R | Exp
  balanceSide: string   // Dr | Cr
  status:      string   // Active | Inactive
  arap:        string | null
  arapType:    string | null
  createdAt:   string   // ISO string
  updatedAt:   string   // ISO string
}

export type ChartOfAccountPayload = {
  accountCode: number
  accountName: string
  accountType: string
  balanceSide: string
  status:      string
  arap?:       string | null
  arapType?:   string | null
}

// ─── Company ──────────────────────────────────────────────────────────────────

export type CompanyRow = {
  id: string          // Comcode — primary key, e.g. "ZeniroxPay"
  name: string
  taxId: string | null
  currency: string    // FncCurr, e.g. "USD"
  status: string      // "Active" | "Inactive"
  country: string
}

export type CompanyPayload = {
  id: string
  name: string
  taxId?: string | null
  currency: string
  status: string
  country: string
}

// ─── Journal Type Rule ────────────────────────────────────────────────────────

export type JournalTypeRuleRow = {
  id: number
  dataSource: string
  journalType: string
  bankAccountNum: string | null
  contraAccount: number
  transAccount: number
  feeAccount: number | null
  partner: string | null
  classify: string | null
  addDate: string | null      // ISO string (createdAt)
  modifiedDate: string | null // ISO string (updatedAt)
}

export type JournalTypeRulePayload = {
  dataSource: string
  journalType: string
  bankAccountNum?: string | null
  contraAccount: number
  transAccount: number
  feeAccount?: number | null
  partner?: string | null
  classify?: string | null
}

export const JOURNAL_TYPE_DATASOURCES = [
  'Platform',
  'PayPal',
  'PayPalCase',
  'BankVN',
  'BankCAN',
  'PingPong',
  'Stripe',
] as const

export const JOURNAL_TYPE_CLASSIFY_OPTIONS = ['Bulk', 'Single', 'Individual'] as const
