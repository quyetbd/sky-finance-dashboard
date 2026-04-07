import { Card } from 'antd'

export default function AccountingPage() {
  const titleMap: Record<string, string> = {
    'balance-sheet': 'Bảng cân đối thứ (Balance Sheet)',
    'income-statement': 'Báo cáo tài chính (Income Statement)',
    'financial-notes': 'Thuyết minh báo cáo tài chính (Notes)',
    'ar-ap': 'Báo cáo Phải thu, Phải trả (AR/AP)'
  }
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>${titleMap['income-statement']}</h1>
      <Card><p>Financial statement (placeholder)</p></Card>
    </div>
  )
}
