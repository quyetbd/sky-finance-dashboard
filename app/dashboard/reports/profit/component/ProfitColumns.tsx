import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { fmt } from '../data';
import type { ProfitRow } from '../types';

const { Text } = Typography;

const profitColumns: ColumnsType<ProfitRow> = [
  { title: 'Date', dataIndex: 'date', key: 'date', width: 110, fixed: 'left' },
  { title: 'Seller', dataIndex: 'seller', key: 'seller', width: 100, fixed: 'left' },
  {
    title: 'Order',
    dataIndex: 'order',
    key: 'order',
    width: 70,
    align: 'right',
    render: (v: number) => <Text style={{ color: v <= 1 ? '#d97706' : undefined }}>{v}</Text>,
  },
  { title: 'GMV', dataIndex: 'gmv', key: 'gmv', width: 100, align: 'right', render: fmt },
  {
    title: 'ShippingCost',
    dataIndex: 'shippingCost',
    key: 'shippingCost',
    width: 110,
    align: 'right',
    render: fmt,
  },
  {
    title: 'AdditionalCost',
    dataIndex: 'additionalCost',
    key: 'additionalCost',
    width: 120,
    align: 'right',
    render: fmt,
  },
  {
    title: 'Dispute',
    dataIndex: 'dispute',
    key: 'dispute',
    width: 90,
    align: 'right',
    onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
    render: (v: number) => (v === 0 ? '-' : fmt(v)),
  },
  {
    title: 'PaymentGateway',
    dataIndex: 'paymentGateway',
    key: 'paymentGateway',
    width: 155,
    align: 'right',
    render: fmt,
  },
  {
    title: 'SellerCost',
    dataIndex: 'sellerCost',
    key: 'sellerCost',
    width: 100,
    align: 'right',
    render: fmt,
  },
  {
    title: 'SupplierCost',
    dataIndex: 'supplierCost',
    key: 'supplierCost',
    width: 110,
    align: 'right',
    render: fmt,
  },
  { title: 'TaxFee', dataIndex: 'taxFee', key: 'taxFee', width: 80, align: 'right', render: fmt },
  {
    title: 'Profit',
    dataIndex: 'profit',
    key: 'profit',
    width: 100,
    align: 'right',
    render: (v: number) => (
      <Text strong style={{ color: '#15803d' }}>
        {fmt(v)}
      </Text>
    ),
  },
  {
    title: '%Profit',
    dataIndex: 'profitPct',
    key: 'profitPct',
    width: 85,
    align: 'right',
    render: (v: number) => `${v}%`,
  },
];

export default profitColumns;
