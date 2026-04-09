'use client';

import type { ColumnsType } from 'antd/es/table';
import { Typography } from 'antd';
import { fmt } from '../data';
import type { DisputeRow } from '../types';
import { useT } from '@/lib/i18n/LocaleContext';

const { Text } = Typography;

export function useDisputeColumns(): ColumnsType<DisputeRow> {
  const t = useT();

  return [
    { title: t('disputeReport.col.caseType'),      dataIndex: 'caseType',           key: 'caseType',           width: 130, fixed: 'left' },
    { title: t('disputeReport.col.order'),         dataIndex: 'orderId',            key: 'orderId',            width: 80,  fixed: 'left' },
    {
      title: t('disputeReport.col.disputeAmt'),
      dataIndex: 'disputeAmt',
      key: 'disputeAmt',
      width: 110,
      align: 'right',
      render: (v: number) => <Text style={{ color: '#d97706' }}>{v}</Text>,
    },
    { title: t('disputeReport.col.disputeExp'),    dataIndex: 'disputeExp',         key: 'disputeExp',         width: 110, align: 'right', render: fmt },
    { title: t('disputeReport.col.sellerCost'),    dataIndex: 'sellerCost',         key: 'sellerCost',         width: 110, align: 'right', render: fmt },
    { title: t('disputeReport.col.supplierCost'),  dataIndex: 'supplierCost',       key: 'supplierCost',       width: 120, align: 'right', render: fmt },
    {
      title: t('disputeReport.col.fulfillCost'),
      dataIndex: 'totalFulfillCost',
      key: 'totalFulfillCost',
      width: 110,
      align: 'right',
      onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
      render: (v: number) => (v === 0 ? '-' : fmt(v)),
    },
    {
      title: t('disputeReport.col.taxFee'),
      dataIndex: 'totalTaxFee',
      key: 'totalTaxFee',
      width: 110,
      align: 'right',
      onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
      render: (v: number) => (v === 0 ? '-' : fmt(v)),
    },
    {
      title: t('disputeReport.col.additionalCost'),
      dataIndex: 'totalAdditionalCost',
      key: 'totalAdditionalCost',
      width: 110,
      align: 'right',
      onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
      render: (v: number) => (v === 0 ? '-' : fmt(v)),
    },
    {
      title: t('disputeReport.col.totalPrice'),
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 110,
      align: 'right',
      onCell: () => ({ style: { backgroundColor: '#fde8d8' } }),
      render: (v: number) => (v === 0 ? '-' : fmt(v)),
    },
    { title: t('disputeReport.col.dispute3Pct'),   dataIndex: 'dispute3Pct',        key: 'dispute3Pct',        width: 120, align: 'right', render: fmt },
    {
      title: t('disputeReport.col.netDisputeCost'),
      dataIndex: 'netDisputeCost',
      key: 'netDisputeCost',
      width: 140,
      align: 'right',
      render: (v: number) => (
        <Text strong style={{ color: '#dc2626' }}>{fmt(v)}</Text>
      ),
    },
  ];
}
