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
