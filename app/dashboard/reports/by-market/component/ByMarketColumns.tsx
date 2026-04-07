import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { fmt } from '../data';
import type { ByMarketRow } from '../types';

const { Text } = Typography;

const byMarketColumns: ColumnsType<ByMarketRow> = [
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    width: 120,
    fixed: 'left',
  },
  {
    title: 'Order',
    dataIndex: 'order',
    key: 'order',
    width: 80,
    align: 'right',
    render: (v: number) => <Text style={{ color: v <= 1 ? '#d97706' : undefined }}>{v}</Text>,
  },
  {
    title: 'GMV',
    dataIndex: 'gmv',
    key: 'gmv',
    width: 110,
    align: 'right',
    render: fmt,
  },
  {
    title: 'ShippingCost',
    dataIndex: 'shippingCost',
    key: 'shippingCost',
    width: 120,
    align: 'right',
    render: (v: number) => (v === 0 ? '' : fmt(v)),
  },
  {
    title: 'AdditionalCost',
    dataIndex: 'additionalCost',
    key: 'additionalCost',
    width: 130,
    align: 'right',
    render: (v: number) => (v === 0 ? '' : fmt(v)),
  },
  {
    title: 'Dispute (3%)',
    dataIndex: 'dispute3Pct',
    key: 'dispute3Pct',
    width: 120,
    align: 'right',
    onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
    render: (v: number) => (v === 0 ? '0' : fmt(v)),
  },
  {
    title: 'PaymentGateway',
    dataIndex: 'paymentGateway',
    key: 'paymentGateway',
    width: 140,
    align: 'right',
    render: (v: number) => (v === 0 ? '0' : fmt(v)),
  },
  {
    title: 'SellerCost',
    dataIndex: 'sellerCost',
    key: 'sellerCost',
    width: 110,
    align: 'right',
    render: (v: number) => (v === 0 ? '0' : fmt(v)),
  },
  {
    title: 'SupplierCost',
    dataIndex: 'supplierCost',
    key: 'supplierCost',
    width: 120,
    align: 'right',
    render: (v: number) => (v === 0 ? '0' : fmt(v)),
  },
  {
    title: 'TaxFee',
    dataIndex: 'taxFee',
    key: 'taxFee',
    width: 90,
    align: 'right',
    render: (v: number) => (v === 0 ? '0' : fmt(v)),
  },
  {
    title: 'Profit',
    dataIndex: 'profit',
    key: 'profit',
    width: 110,
    align: 'right',
    render: (v: number) => (
      <Text strong style={{ color: '#15803d' }}>
        {v === 0 ? '0' : fmt(v)}
      </Text>
    ),
  },
  {
    title: '%Profit',
    dataIndex: 'profitPct',
    key: 'profitPct',
    width: 90,
    align: 'right',
    render: (v: number) => (v === 0 ? '0' : `${v}%`),
  },
];

export default byMarketColumns;
