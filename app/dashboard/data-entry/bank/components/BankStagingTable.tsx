'use client'

import { Table, Tag } from 'antd'
import type { ColumnsType, TableProps } from 'antd/es/table'
import { useT } from '@/lib/i18n/LocaleContext'
import type { BankStagingRow } from '@/lib/types'

interface Props {
  data: BankStagingRow[]
  loading: boolean
  selectedIds: number[]
  onSelectChange: (ids: number[]) => void
}

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function BankStagingTable({ data, loading, selectedIds, onSelectChange }: Props) {
  const t = useT()

  const columns: ColumnsType<BankStagingRow> = [
    {
      title: t('bank.col.comcode'),
      dataIndex: 'comcode',
      key: 'comcode',
      width: 100,
      fixed: 'left',
    },
    {
      title: t('bank.col.date'),
      dataIndex: 'date',
      key: 'date',
      width: 100,
    },
    {
      title: t('bank.col.journalType'),
      dataIndex: 'journalType',
      key: 'journalType',
      width: 180,
      ellipsis: true,
    },
    {
      title: t('bank.col.docNum'),
      dataIndex: 'docNum',
      key: 'docNum',
      width: 200,
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('bank.col.bankAccountNum'),
      dataIndex: 'bankAccountNum',
      key: 'bankAccountNum',
      width: 110,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('bank.col.period'),
      dataIndex: 'period',
      key: 'period',
      width: 80,
    },
    {
      title: t('bank.col.currency'),
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
    },
    {
      title: t('bank.col.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 110,
      align: 'right',
      render: (v: number) => (
        <span style={{ color: v < 0 ? '#cf1322' : undefined }}>{fmt(v)}</span>
      ),
    },
    {
      title: t('bank.col.partnerCode'),
      dataIndex: 'partnerCode',
      key: 'partnerCode',
      width: 110,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('bank.col.description'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: true,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('bank.col.balanceImpact'),
      dataIndex: 'balanceImpact',
      key: 'balanceImpact',
      width: 120,
      render: (v: string | null) => {
        if (!v) return '—'
        const color = v === 'Credit' ? 'green' : v === 'Debit' ? 'volcano' : 'default'
        return <Tag color={color}>{v}</Tag>
      },
    },
    {
      title: t('bank.col.refTxnId'),
      dataIndex: 'refTxnId',
      key: 'refTxnId',
      width: 130,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('bank.col.refNum'),
      dataIndex: 'refNum',
      key: 'refNum',
      width: 90,
      render: (v: string | null) => v ?? '—',
    },
    {
      title: t('bank.col.xrate'),
      dataIndex: 'xrate',
      key: 'xrate',
      width: 80,
      align: 'right',
      render: (v: number | null) => (v != null ? v.toFixed(4) : '—'),
    },
    {
      title: t('bank.col.datasource'),
      dataIndex: 'datasource',
      key: 'datasource',
      width: 90,
    },
    {
      title: t('bank.col.status'),
      dataIndex: 'glPosted',
      key: 'status',
      width: 120,
      fixed: 'right',
      render: (posted: boolean) =>
        posted ? (
          <Tag color="green">{t('bank.status.posted')}</Tag>
        ) : (
          <Tag color="default">{t('bank.status.unposted')}</Tag>
        ),
    },
  ]

  const rowSelection: TableProps<BankStagingRow>['rowSelection'] = {
    selectedRowKeys: selectedIds,
    onChange: (keys) => onSelectChange(keys as number[]),
  }

  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <Table<BankStagingRow>
        className="report-table"
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        rowSelection={rowSelection}
        pagination={false}
        size="small"
        scroll={{ x: 1700, y: 'calc(100vh - 280px)' }}
        bordered
        rowClassName={(row) => (row.glPosted ? 'opacity-50' : '')}
      />
    </div>
  )
}
