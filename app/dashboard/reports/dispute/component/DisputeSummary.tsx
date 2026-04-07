import { Table, Typography } from 'antd';
import { fmt } from '../data';
import type { DisputeTotals } from '../types';

const { Text } = Typography;

export function renderDisputeSummary(totals: DisputeTotals, t: (key: string) => string) {
  const r = totals;
  return (
    <Table.Summary fixed="bottom">
      <Table.Summary.Row style={{ fontWeight: 600, backgroundColor: '#fde8d8' }}>
        <Table.Summary.Cell index={0} colSpan={2}>
          <Text strong>{t('common.total')}</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={2}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={3}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={4}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={5}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={6}  align="right">{r.totalFulfillCost === 0 ? '-' : fmt(r.totalFulfillCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={7}  align="right">{r.totalTaxFee === 0 ? '-' : fmt(r.totalTaxFee)}</Table.Summary.Cell>
        <Table.Summary.Cell index={8}  align="right">{r.totalAdditionalCost === 0 ? '0' : fmt(r.totalAdditionalCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={9}  align="right">{r.totalPrice === 0 ? '-' : fmt(r.totalPrice)}</Table.Summary.Cell>
        <Table.Summary.Cell index={10} align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={11} align="right">-</Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
