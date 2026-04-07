import { Table, Typography } from 'antd';
import { fmt } from '../data';
import type { DisputeTotals } from '../types';

const { Text } = Typography;

export function renderDisputeSummary(totals: DisputeTotals) {
  const t = totals;
  return (
    <Table.Summary fixed="bottom">
      <Table.Summary.Row style={{ fontWeight: 600, backgroundColor: '#fde8d8' }}>
        <Table.Summary.Cell index={0} colSpan={2}>
          <Text strong>TOTAL</Text>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={2}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={3}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={4}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={5}  align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={6}  align="right">{t.totalFulfillCost === 0 ? '-' : fmt(t.totalFulfillCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={7}  align="right">{t.totalTaxFee === 0 ? '-' : fmt(t.totalTaxFee)}</Table.Summary.Cell>
        <Table.Summary.Cell index={8}  align="right">{t.totalAdditionalCost === 0 ? '0' : fmt(t.totalAdditionalCost)}</Table.Summary.Cell>
        <Table.Summary.Cell index={9}  align="right">{t.totalPrice === 0 ? '-' : fmt(t.totalPrice)}</Table.Summary.Cell>
        <Table.Summary.Cell index={10} align="right">-</Table.Summary.Cell>
        <Table.Summary.Cell index={11} align="right">-</Table.Summary.Cell>
      </Table.Summary.Row>
    </Table.Summary>
  );
}
