import { Card } from 'antd'

export default function ConfigPage() {
  const titleMap: Record<string, string> = {
    'exchange-rates': 'Exchange Rates (Khai báo tỷ giá)',
    'companies': 'Companies (Quản lý Công ty)',
    'chart-of-accounts': 'Chart of Accounts (Hệ thống tài khoản)',
    'partners': 'Partners (Quản lý đối tác)',
    'fiscal-periods': 'Fiscal Periods (Quản lý Kỳ kế toán)',
    'report-config': 'Report Configuration (Cấu hình báo cáo)',
    'journal-types': 'Journal Types (Loại giao dịch)'
  }
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>${titleMap['partners']}</h1>
      <Card><p>Configuration page (placeholder)</p></Card>
    </div>
  )
}
