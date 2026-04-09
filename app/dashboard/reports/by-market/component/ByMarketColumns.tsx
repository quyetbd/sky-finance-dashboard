'use client';

import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { fmt } from '../data';
import type { ByMarketRow } from '../types';
import { useT } from '@/lib/i18n/LocaleContext';

const { Text } = Typography;

export function useByMarketColumns(): ColumnsType<ByMarketRow> {
  const t = useT();

  return [
    { title: t('byMarket.col.country'),        dataIndex: 'country',        key: 'country',        width: 120, fixed: 'left' },
    {
      title: t('byMarket.col.order'),
      dataIndex: 'order',
      key: 'order',
      width: 80,
      align: 'right',
      render: (v: number) => <Text style={{ color: v <= 1 ? '#d97706' : undefined }}>{v}</Text>,
    },
    { title: t('byMarket.col.gmv'),            dataIndex: 'gmv',            key: 'gmv',            width: 110, align: 'right', render: fmt },
    { title: t('byMarket.col.shippingCost'),   dataIndex: 'shippingCost',   key: 'shippingCost',   width: 120, align: 'right', render: (v: number) => (v === 0 ? '' : fmt(v)) },
    { title: t('byMarket.col.additionalCost'), dataIndex: 'additionalCost', key: 'additionalCost', width: 130, align: 'right', render: (v: number) => (v === 0 ? '' : fmt(v)) },
    {
      title: t('byMarket.col.dispute3Pct'),
      dataIndex: 'dispute3Pct',
      key: 'dispute3Pct',
      width: 120,
      align: 'right',
      onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
      render: (v: number) => (v === 0 ? '0' : fmt(v)),
    },
    { title: t('byMarket.col.paymentGateway'), dataIndex: 'paymentGateway', key: 'paymentGateway', width: 140, align: 'right', render: (v: number) => (v === 0 ? '0' : fmt(v)) },
    { title: t('byMarket.col.sellerCost'),     dataIndex: 'sellerCost',     key: 'sellerCost',     width: 110, align: 'right', render: (v: number) => (v === 0 ? '0' : fmt(v)) },
    { title: t('byMarket.col.supplierCost'),   dataIndex: 'supplierCost',   key: 'supplierCost',   width: 120, align: 'right', render: (v: number) => (v === 0 ? '0' : fmt(v)) },
    { title: t('byMarket.col.taxFee'),         dataIndex: 'taxFee',         key: 'taxFee',         width: 90,  align: 'right', render: (v: number) => (v === 0 ? '0' : fmt(v)) },
    {
      title: t('byMarket.col.profit'),
      dataIndex: 'profit',
      key: 'profit',
      width: 110,
      align: 'right',
      render: (v: number) => (
        <Text strong style={{ color: '#15803d' }}>{v === 0 ? '0' : fmt(v)}</Text>
      ),
    },
    {
      title: t('byMarket.col.profitPct'),
      dataIndex: 'profitPct',
      key: 'profitPct',
      width: 90,
      align: 'right',
      render: (v: number) => (v === 0 ? '0' : `${v}%`),
    },
  ];
}
