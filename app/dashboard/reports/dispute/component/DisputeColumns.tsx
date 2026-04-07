import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { fmt } from '../data';
import type { DisputeRow } from '../types';

const { Text } = Typography;

const disputeColumns: ColumnsType<DisputeRow> = [
  { title: 'Case Type',  dataIndex: 'caseType',  key: 'caseType',  width: 130, fixed: 'left' },
  { title: 'Order',      dataIndex: 'orderId',   key: 'orderId',   width: 80,  fixed: 'left' },
  {
    title: 'DisputeAmt',
    dataIndex: 'disputeAmt',
    key: 'disputeAmt',
    width: 110,
    align: 'right',
    render: (v: number) => <Text style={{ color: '#d97706' }}>{v}</Text>,
  },
  {
    title: 'DisputeExp',
    dataIndex: 'disputeExp',
    key: 'disputeExp',
    width: 110,
    align: 'right',
    render: fmt,
  },
  {
    title: 'SellerCost',
    dataIndex: 'sellerCost',
    key: 'sellerCost',
    width: 110,
    align: 'right',
    render: fmt,
  },
  {
    title: 'SupplierCost',
    dataIndex: 'supplierCost',
    key: 'supplierCost',
    width: 120,
    align: 'right',
    render: fmt,
  },
  {
    title: 'TotalCost',
    dataIndex: 'totalFulfillCost',
    key: 'totalFulfillCost',
    width: 110,
    align: 'right',
    onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
    render: (v: number) => (v === 0 ? '-' : fmt(v)),
  },
  {
    title: 'TotalCost',
    dataIndex: 'totalTaxFee',
    key: 'totalTaxFee',
    width: 110,
    align: 'right',
    onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
    render: (v: number) => (v === 0 ? '-' : fmt(v)),
  },
  {
    title: 'TotalCost',
    dataIndex: 'totalAdditionalCost',
    key: 'totalAdditionalCost',
    width: 110,
    align: 'right',
    onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
    render: (v: number) => (v === 0 ? '-' : fmt(v)),
  },
  {
    title: 'TotalPrice',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    width: 110,
    align: 'right',
    onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
    render: (v: number) => (v === 0 ? '-' : fmt(v)),
  },
  {
    title: 'Dispute (3%)',
    dataIndex: 'dispute3Pct',
    key: 'dispute3Pct',
    width: 120,
    align: 'right',
    render: fmt,
  },
  {
    title: 'Net Dispute Cost',
    dataIndex: 'netDisputeCost',
    key: 'netDisputeCost',
    width: 140,
    align: 'right',
    render: (v: number) => (
      <Text strong style={{ color: '#dc2626' }}>
        {fmt(v)}
      </Text>
    ),
  },
];

export default disputeColumns;
