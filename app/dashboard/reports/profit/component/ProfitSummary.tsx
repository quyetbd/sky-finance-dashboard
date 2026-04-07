import { Table, Typography } from 'antd';
import { ProfitTotals } from '../types';
import { fmt } from '../data';

const { Text } = Typography;

export function renderProfitSummary(totals: ProfitTotals, pct: number) {
  const t = totals;
  return (
    <Table.Summary fixed="bottom">
      <Table.Summary.Row style={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
        <Table.Summary.Cell index={0} colSpan={2}>
          <Text strong>TOTAL</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={2}  align="right">{t.order}</Table.Summary.Cell>
        <Table.Summary.Cell index={3}  align="right"><Text strong>{fmt(t.gmv)}</Text></Table.Summary.Cell>
        <Table.Summary.Cell index={4}  align="right">{fmt(t.shippingCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={5}  align="right">{fmt(t.additionalCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={6}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={7}  align="right">{fmt(t.paymentGateway)}</Table.Summary.Cell>
        <Table.Summary.Cell index={8}  align="right">{fmt(t.sellerCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={9}  align="right">{fmt(t.supplierCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={10} align="right">{fmt(t.taxFee)}</Table.Summary.Cell>
        <Table.Summary.Cell index={11} align="right">
          <Text strong style={{ color: '#15803d' }}>{fmt(t.profit)}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={12} align="right">
          <Text strong>{pct}%</Text>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
