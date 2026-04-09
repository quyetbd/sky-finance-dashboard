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
