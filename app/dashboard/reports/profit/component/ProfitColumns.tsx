'use client';

import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { fmt } from '../data';
import type { ProfitRow } from '../types';
import { useT } from '@/lib/i18n/LocaleContext';

const { Text } = Typography;

export function useProfitColumns(): ColumnsType<ProfitRow> {
  const t = useT();

  return [
    { title: t('profitReport.col.date'),          dataIndex: 'date',          key: 'date',          width: 110, fixed: 'left' },
    { title: t('profitReport.col.seller'),         dataIndex: 'seller',        key: 'seller',        width: 100, fixed: 'left' },
    {
      title: t('profitReport.col.order'),
      dataIndex: 'order',
      key: 'order',
      width: 70,
      align: 'right',
      render: (v: number) => <Text style={{ color: v <= 1 ? '#d97706' : undefined }}>{v}</Text>,
    },
    { title: t('profitReport.col.gmv'),            dataIndex: 'gmv',           key: 'gmv',           width: 100,  align: 'right', render: fmt },
    { title: t('profitReport.col.shippingCost'),   dataIndex: 'shippingCost',  key: 'shippingCost',  width: 110,  align: 'right', render: fmt },
    { title: t('profitReport.col.additionalCost'), dataIndex: 'additionalCost',key: 'additionalCost',width: 120,  align: 'right', render: fmt },
    {
      title: t('profitReport.col.dispute'),
      dataIndex: 'dispute',
      key: 'dispute',
      width: 90,
      align: 'right',
      onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
      render: (v: number) => (v === 0 ? '-' : fmt(v)),
    },
    { title: t('profitReport.col.paymentGateway'), dataIndex: 'paymentGateway',key: 'paymentGateway',width: 155,  align: 'right', render: fmt },
    { title: t('profitReport.col.sellerCost'),     dataIndex: 'sellerCost',    key: 'sellerCost',    width: 100,  align: 'right', render: fmt },
    { title: t('profitReport.col.supplierCost'),   dataIndex: 'supplierCost',  key: 'supplierCost',  width: 110,  align: 'right', render: fmt },
    { title: t('profitReport.col.taxFee'),         dataIndex: 'taxFee',        key: 'taxFee',        width: 80,   align: 'right', render: fmt },
    {
      title: t('profitReport.col.profit'),
      dataIndex: 'profit',
      key: 'profit',
      width: 100,
      align: 'right',
      render: (v: number) => (
        <Text strong style={{ color: '#15803d' }}>{fmt(v)}</Text>
      ),
    },
    {
      title: t('profitReport.col.profitPct'),
      dataIndex: 'profitPct',
      key: 'profitPct',
      width: 85,
      align: 'right',
      render: (v: number) => `${v}%`,
    },
  ];
}
