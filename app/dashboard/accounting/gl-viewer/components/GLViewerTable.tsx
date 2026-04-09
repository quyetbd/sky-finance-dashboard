'use client'

import { Empty, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import TableReport from '@/app/dashboard/reports/components/TableReport'
import { useT } from '@/lib/i18n/LocaleContext'
import type { GLViewerRow } from '../page'

const FMT_NUM = (v: number) =>
  v > 0
    ? v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '—'

const FMT_DATE = (v: string) =>
  v ? new Date(v).toLocaleDateString('vi-VN') : '—'

interface Props {
  data: GLViewerRow[]
  loading: boolean
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number, pageSize: number) => void
}

export default function GLViewerTable({ data, loading, total, page, pageSize, onPageChange }: Props) {
  const t = useT()

  const columns: ColumnsType<GLViewerRow> = [
    {
      title: t('glViewer.col.id'),
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      width: 150,
      render: (v) => (
        <span style={{ fontFamily: 'monospace' }}>{v}</span>
      ),
    },
    {
      title: t('glViewer.col.comcode'),
      dataIndex: 'comcode',
      key: 'comcode',
      fixed: 'left',
      width: 120,
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: t('glViewer.col.dataSource'),
      dataIndex: 'dataSource',
      key: 'dataSource',
      width: 100,
    },
    {
      title: t('glViewer.col.journalType'),
      dataIndex: 'journalType',
      key: 'journalType',
      width: 210,
      ellipsis: { showTitle: false },
      render: (v) => (
        <Tooltip title={v}>
          <span>{v}</span>
        </Tooltip>
      ),
    },
    {
      title: t('glViewer.col.docNum'),
      dataIndex: 'docNum',
      key: 'docNum',
      width: 150,
      render: (v) => (
        <span style={{ fontFamily: 'monospace' }}>{v}</span>
      ),
    },
    {
      title: t('glViewer.col.referenceTxnId'),
      dataIndex: 'referenceTxnId',
      key: 'referenceTxnId',
      width: 170,
      ellipsis: { showTitle: false },
      render: (v) =>
        v ? (
          <Tooltip title={v}>
            <span style={{ fontFamily: 'monospace' }}>{v}</span>
          </Tooltip>
        ) : (
          '—'
        ),
    },
    {
      title: t('glViewer.col.bankAccountNum'),
      dataIndex: 'bankAccountNum',
      key: 'bankAccountNum',
      width: 140,
      render: (v) => v ?? '—',
    },
    {
      title: t('glViewer.col.accountCode'),
      dataIndex: 'accountCode',
      key: 'accountCode',
      width: 120,
      render: (v) => <span style={{ fontFamily: 'monospace' }}>{v}</span>,
    },
    {
      title: t('glViewer.col.partner'),
      dataIndex: 'partner',
      key: 'partner',
      width: 120,
      render: (v) => v ?? '—',
    },
    {
      title: t('glViewer.col.period'),
      dataIndex: 'period',
      key: 'period',
      width: 80,
    },
    {
      title: t('glViewer.col.refNum'),
      dataIndex: 'refNum',
      key: 'refNum',
      width: 100,
      render: (v) => v ?? '—',
    },
    {
      title: t('glViewer.col.transDate'),
      dataIndex: 'transDate',
      key: 'transDate',
      width: 110,
      render: FMT_DATE,
    },
    {
      title: t('glViewer.col.docDate'),
      dataIndex: 'docDate',
      key: 'docDate',
      width: 110,
      render: FMT_DATE,
    },
    {
      title: t('glViewer.col.inputCurr'),
      dataIndex: 'inputCurr',
      key: 'inputCurr',
      width: 80,
    },
    {
      title: t('glViewer.col.fncCurr'),
      dataIndex: 'fncCurr',
      key: 'fncCurr',
      width: 80,
    },
    {
      title: t('glViewer.col.inputDr'),
      dataIndex: 'inputDr',
      key: 'inputDr',
      width: 120,
      align: 'right',
      render: (v) => FMT_NUM(Number(v)),
    },
    {
      title: t('glViewer.col.inputCr'),
      dataIndex: 'inputCr',
      key: 'inputCr',
      width: 120,
      align: 'right',
      render: (v) => FMT_NUM(Number(v)),
    },
    {
      title: t('glViewer.col.xRate'),
      dataIndex: 'xRate',
      key: 'xRate',
      width: 100,
      align: 'right',
      render: (v) =>
        Number(v).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        }),
    },
    {
      title: t('glViewer.col.rateType'),
      dataIndex: 'rateType',
      key: 'rateType',
      width: 80,
    },
    {
      title: t('glViewer.col.accountedDr'),
      dataIndex: 'accountedDr',
      key: 'accountedDr',
      width: 130,
      align: 'right',
      render: (v) => FMT_NUM(Number(v)),
    },
    {
      title: t('glViewer.col.accountedCr'),
      dataIndex: 'accountedCr',
      key: 'accountedCr',
      width: 130,
      align: 'right',
      render: (v) => FMT_NUM(Number(v)),
    },
    {
      title: t('glViewer.col.description'),
      dataIndex: 'description',
      key: 'description',
      width: 220,
      ellipsis: { showTitle: false },
      render: (v) =>
        v ? (
          <Tooltip title={v}>
            <span>{v}</span>
          </Tooltip>
        ) : (
          '—'
        ),
    },
    {
      title: t('glViewer.col.balanceImpact'),
      dataIndex: 'balanceImpact',
      key: 'balanceImpact',
      width: 110,
      render: (v) => v ?? '—',
    },
    {
      title: t('glViewer.col.isReversal'),
      dataIndex: 'isReversal',
      key: 'isReversal',
      width: 90,
      render: (v) => (v ? <Tag color="orange">Yes</Tag> : '—'),
    },
    {
      title: t('glViewer.col.reversedId'),
      dataIndex: 'reversedId',
      key: 'reversedId',
      width: 150,
      render: (v) =>
        v ? (
          <span style={{ fontFamily: 'monospace' }}>{v}</span>
        ) : (
          '—'
        ),
    },
    {
      title: t('glViewer.col.partnerTaxId'),
      dataIndex: 'partnerTaxId',
      key: 'partnerTaxId',
      width: 140,
      render: (v) => v ?? '—',
    },
    {
      title: t('glViewer.col.segment'),
      dataIndex: 'segment',
      key: 'segment',
      width: 120,
      render: (v) => (v ? <Tag color="geekblue">{v}</Tag> : '—'),
    },
  ]

  return (
    <div className="flex-1 overflow-hidden">
      <TableReport<GLViewerRow>
        hideFilterBar
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        scrollX={3000}
      // pagination={{
      //   current: page,
      //   pageSize,
      //   total,
      //   showSizeChanger: true,
      //   showQuickJumper: true,
      //   pageSizeOptions: ['50', '100', '200', '500'],
      //   showTotal: (tot) => `${t('glViewer.total')}: ${tot.toLocaleString()}`,
      //   onChange: onPageChange,
      // }}
      />
    </div>
  )
}
