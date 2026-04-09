import { Table, Typography } from 'antd';
import { ProfitTotals } from '../types';
import { fmt } from '../data';

const { Text } = Typography;

export function renderProfitSummary(
  totals: ProfitTotals,
  pct: number,
  t: (key: string) => string,
) {
  const r = totals;
  return (
    <Table.Summary fixed="bottom">
      <Table.Summary.Row style={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
        <Table.Summary.Cell index={0} colSpan={2}>
          <Text strong>{t('common.total')}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={2}  align="right">{r.order}</Table.Summary.Cell>
        <Table.Summary.Cell index={3}  align="right"><Text strong>{fmt(r.gmv)}</Text></Table.Summary.Cell>
        <Table.Summary.Cell index={4}  align="right">{fmt(r.shippingCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={5}  align="right">{fmt(r.additionalCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={6}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={7}  align="right">{fmt(r.paymentGateway)}</Table.Summary.Cell>
        <Table.Summary.Cell index={8}  align="right">{fmt(r.sellerCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={9}  align="right">{fmt(r.supplierCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={10} align="right">{fmt(r.taxFee)}</Table.Summary.Cell>
        <Table.Summary.Cell index={11} align="right">
          <Text strong style={{ color: '#15803d' }}>{fmt(r.profit)}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={12} align="right">
          <Text strong>{pct}%</Text>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
