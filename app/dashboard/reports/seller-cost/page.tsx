import { Card } from 'antd'

export default function SellerCostPage() {
  const titleMap: Record<string, string> = {
    'profit': 'Profit Report',
    'final': 'Final Report',
    'dispute': 'Dispute Management',
    'by-market': 'By Market Report',
    'reserve-hold': 'Reserve Hold',
    'seller-cost': 'Seller Cost',
    'supplier-cost': 'Supplier Cost'
  }
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>${titleMap['seller-cost']}</h1>
      <Card><p>Report content (placeholder)</p></Card>
    </div>
  )
}
