'use client'

import { Table, Tag } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { useT } from '@/lib/i18n/LocaleContext'
import type { PaypalStagingRow } from '@/lib/types'

interface Props {
  data: PaypalStagingRow[]
  loading: boolean
  selectedIds: number[]
  onSelectChange: (ids: number[]) => void
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function PaypalStagingTable({ data, loading, selectedIds, onSelectChange }: Props) {
  const t = useT()

  const columns: ColumnsType<PaypalStagingRow> = [
    {
      title: t('paypal.col.comcode'),
      dataIndex: 'comcode',
      key: 'comcode',
      width: 100,
      fixed: 'left',
    },
    {
      title: t('paypal.col.date'),
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: t('paypal.col.journalType'),
      dataIndex: 'journalType',
      key: 'journalType',
      width: 180,
      ellipsis: true,
    },
    {
      title: t('paypal.col.docNum'),
      dataIndex: 'docNum',
      key: 'docNum',
      width: 220,
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('paypal.col.bankAccountNum'),
      dataIndex: 'bankAccountNum',
      key: 'bankAccountNum',
      width: 110,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('paypal.col.period'),
      dataIndex: 'period',
      key: 'period',
      width: 80,
    },
    {
      title: t('paypal.col.currency'),
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
    },
    {
      title: t('paypal.col.gross'),
      dataIndex: 'gross',
      key: 'gross',
      width: 110,
      align: 'right',
      render: (v: number) => (
        <span style={{ color: v < 0 ? '#cf1322' : undefined }}>{fmt(v)}</span>
      ),
    },
    {
      title: t('paypal.col.fee'),
      dataIndex: 'fee',
      key: 'fee',
      width: 90,
      align: 'right',
      render: (v: number) => (
        <span style={{ color: v < 0 ? '#cf1322' : undefined }}>{fmt(v)}</span>
      ),
    },
    {
      title: t('paypal.col.net'),
      dataIndex: 'net',
      key: 'net',
      width: 110,
      align: 'right',
      render: (v: number) => (
        <span style={{ color: v < 0 ? '#cf1322' : undefined }}>{fmt(v)}</span>
      ),
    },
    {
      title: t('paypal.col.partnerCode'),
      dataIndex: 'partnerCode',
      key: 'partnerCode',
      width: 100,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('paypal.col.description'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('paypal.col.balanceImpact'),
      dataIndex: 'balanceImpact',
      key: 'balanceImpact',
      width: 120,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('paypal.col.refTxnId'),
      dataIndex: 'refTxnId',
      key: 'refTxnId',
      width: 110,
      render: (v: string | null) => v ?? 'Null',
    },
    {
      title: t('paypal.col.refNum'),
      dataIndex: 'refNum',
      key: 'refNum',
      width: 90,
      render: (v: string | null) => v ?? 'Null',
    },
    {
      title: t('paypal.col.xrate'),
      dataIndex: 'xrate',
      key: 'xrate',
      width: 80,
      align: 'right',
      render: (v: number | null) => (v != null ? v.toFixed(4) : '—'),
    },
    {
      title: t('paypal.col.classify'),
      dataIndex: 'classify',
      key: 'classify',
      width: 80,
      render: (v: string) =>
        v === 'Bulk' ? (
          <Tag color="blue">{t('paypal.classify.bulk')}</Tag>
        ) : (
          <Tag color="gold">{t('paypal.classify.single')}</Tag>
        ),
    },
    {
      title: t('paypal.col.datasource'),
      dataIndex: 'datasource',
      key: 'datasource',
      width: 90,
    },
    {
      title: t('paypal.col.status'),
      dataIndex: 'glPosted',
      key: 'status',
      width: 120,
      fixed: 'right',
      render: (posted: boolean) =>
        posted ? (
          <Tag color="green">{t('paypal.status.posted')}</Tag>
        ) : (
          <Tag color="default">{t('paypal.status.unposted')}</Tag>
        ),
    },
  ]

  const rowSelection: TableProps<PaypalStagingRow>['rowSelection'] = {
    selectedRowKeys: selectedIds,
    onChange: (keys) => onSelectChange(keys as number[]),
  }

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <Table<PaypalStagingRow>
        className="report-table"
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={rowSelection}
        pagination={false}
        size="small"
        scroll={{ x: 1800, y: 'calc(100vh - 280px)' }}
        bordered
        rowClassName={(row) => (row.glPosted ? 'opacity-50' : '')}
      />
    </div>
  )
}
