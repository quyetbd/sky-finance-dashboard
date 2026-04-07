import { Card } from 'antd'

export default function DataEntryPage() {
  const titleMap: Record<string, string> = {
    'overall': 'Data Preparation Overview',
    'bettamax': 'BettaMax Order Data',
    'pingpong': 'PingPong Statement',
    'bank': 'Bank Transactions',
    'paypal': 'PayPal Transactions',
    'gl-entry': 'GL Entry',
    'actual-costs': 'Actual Costs (Seller & Supplier)'
  }
  return (
    <div>
      <h1 style={{ marginBottom: '24px' }}>${titleMap['bettamax']}</h1>
      <Card><p>Data entry form (placeholder)</p></Card>
    </div>
  )
}
