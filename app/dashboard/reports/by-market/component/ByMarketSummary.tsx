import { Table, Typography } from 'antd';
import { fmt } from '../data';
import type { ByMarketTotals } from '../types';

const { Text } = Typography;

export function renderByMarketSummary(totals: ByMarketTotals) {
  const t = totals;
  return (
    <Table.Summary fixed="bottom">
      <Table.Summary.Row style={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
        <Table.Summary.Cell index={0}>
          <Text strong>TOTAL</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1} align="right">{t.order}</Table.Summary.Cell>
        <Table.Summary.Cell index={2} align="right"><Text strong>{fmt(t.gmv)}</Text></Table.Summary.Cell>
        <Table.Summary.Cell index={3} align="right">{t.shippingCost === 0 ? '0' : fmt(t.shippingCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={4} align="right">{t.additionalCost === 0 ? '0' : fmt(t.additionalCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={5} align="right">{t.dispute3Pct === 0 ? '0' : fmt(t.dispute3Pct)}</Table.Summary.Cell>
        <Table.Summary.Cell index={6} align="right">{t.paymentGateway === 0 ? '0' : fmt(t.paymentGateway)}</Table.Summary.Cell>
        <Table.Summary.Cell index={7} align="right">{t.sellerCost === 0 ? '0' : fmt(t.sellerCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={8} align="right">{t.supplierCost === 0 ? '0' : fmt(t.supplierCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={9} align="right">{t.taxFee === 0 ? '0' : fmt(t.taxFee)}</Table.Summary.Cell>
        <Table.Summary.Cell index={10} align="right">
          <Text strong style={{ color: '#15803d' }}>{t.profit === 0 ? '0' : fmt(t.profit)}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={11} align="right">0</Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
