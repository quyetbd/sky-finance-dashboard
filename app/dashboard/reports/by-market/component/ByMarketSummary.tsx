import { Table, Typography } from 'antd';
import { fmt } from '../data';
import type { ByMarketTotals } from '../types';

const { Text } = Typography;

export function renderByMarketSummary(totals: ByMarketTotals, t: (key: string) => string) {
  const r = totals;
  return (
    <Table.Summary fixed="bottom">
      <Table.Summary.Row style={{ fontWeight: 600, backgroundColor: '#f5f5f5' }}>
        <Table.Summary.Cell index={0}>
          <Text strong>{t('common.total')}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1}  align="right">{r.order}</Table.Summary.Cell>
        <Table.Summary.Cell index={2}  align="right"><Text strong>{fmt(r.gmv)}</Text></Table.Summary.Cell>
        <Table.Summary.Cell index={3}  align="right">{r.shippingCost === 0 ? '0' : fmt(r.shippingCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={4}  align="right">{r.additionalCost === 0 ? '0' : fmt(r.additionalCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={5}  align="right">{r.dispute3Pct === 0 ? '0' : fmt(r.dispute3Pct)}</Table.Summary.Cell>
        <Table.Summary.Cell index={6}  align="right">{r.paymentGateway === 0 ? '0' : fmt(r.paymentGateway)}</Table.Summary.Cell>
        <Table.Summary.Cell index={7}  align="right">{r.sellerCost === 0 ? '0' : fmt(r.sellerCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={8}  align="right">{r.supplierCost === 0 ? '0' : fmt(r.supplierCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={9}  align="right">{r.taxFee === 0 ? '0' : fmt(r.taxFee)}</Table.Summary.Cell>
        <Table.Summary.Cell index={10} align="right">
          <Text strong style={{ color: '#15803d' }}>{r.profit === 0 ? '0' : fmt(r.profit)}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={11} align="right">0</Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
