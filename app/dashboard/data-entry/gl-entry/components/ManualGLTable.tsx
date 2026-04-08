'use client'

import { Tag, Tooltip, Button, Popconfirm, Space } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import TableReport from '@/app/dashboard/reports/components/TableReport'
import { useT } from '@/lib/i18n/LocaleContext'
import type { ManualGLPair } from '@/lib/types'

const FMT_DATE = (v: string) =>
  v ? new Date(v).toLocaleDateString('vi-VN') : '—'

const FMT_NUM = (v: string | number) => {
  const n = Number(v)
  return n > 0
    ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '—'
}

interface Props {
  data: ManualGLPair[]
  loading: boolean
  selectedUids: string[]
  onSelectChange: (uids: string[]) => void
  onEdit: (row: ManualGLPair) => void
  onDelete: (docNum: string, comcode: string) => void
}

export default function ManualGLTable({
  data, loading, selectedUids, onSelectChange, onEdit, onDelete,
}: Props) {
  const t = useT()

  const columns: ColumnsType<ManualGLPair> = [
    {
      title: t('manualGL.col.comcode'),
      dataIndex: 'comcode',
      key: 'comcode',
      fixed: 'left',
      width: 120,
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: t('manualGL.col.date'),
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: FMT_DATE,
    },
    {
      title: t('manualGL.col.journalType'),
      dataIndex: 'journalType',
      key: 'journalType',
      width: 180,
      ellipsis: { showTitle: false },
      render: (v) => <Tooltip title={v}><span>{v}</span></Tooltip>,
    },
    {
      title: t('manualGL.col.docNum'),
      dataIndex: 'docNum',
      key: 'docNum',
      width: 150,
      render: (v) => <span style={{ fontFamily: 'monospace' }}>{v}</span>,
    },
    {
      title: t('manualGL.col.period'),
      dataIndex: 'period',
      key: 'period',
      width: 80,
    },
    {
      title: t('manualGL.col.transAccount'),
      dataIndex: 'transAccount',
      key: 'transAccount',
      width: 120,
      render: (v) => <span style={{ fontFamily: 'monospace' }}>{v}</span>,
    },
    {
      title: t('manualGL.col.contraAccount'),
      dataIndex: 'contraAccount',
      key: 'contraAccount',
      width: 120,
      render: (v) => <span style={{ fontFamily: 'monospace' }}>{v}</span>,
    },
    {
      title: t('manualGL.col.currency'),
      dataIndex: 'currency',
      key: 'currency',
      width: 80,
    },
    {
      title: t('manualGL.col.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      align: 'right',
      render: FMT_NUM,
    },
    {
      title: t('manualGL.col.partnerCode'),
      dataIndex: 'partnerCode',
      key: 'partnerCode',
      width: 120,
      render: (v) => v ?? '—',
    },
    {
      title: t('manualGL.col.description'),
      dataIndex: 'description',
      key: 'description',
      width: 200,
      ellipsis: { showTitle: false },
      render: (v) =>
        v ? <Tooltip title={v}><span>{v}</span></Tooltip> : '—',
    },
    {
      title: t('manualGL.col.balanceImpact'),
      dataIndex: 'balanceImpact',
      key: 'balanceImpact',
      width: 110,
      render: (v) => v ?? '—',
    },
    {
      title: t('manualGL.col.referenceTxnId'),
      dataIndex: 'referenceTxnId',
      key: 'referenceTxnId',
      width: 140,
      render: (v) => v ?? '—',
    },
    {
      title: t('manualGL.col.refNum'),
      dataIndex: 'refNum',
      key: 'refNum',
      width: 100,
      render: (v) => v ?? '—',
    },
    {
      title: t('manualGL.col.xRate'),
      dataIndex: 'xRate',
      key: 'xRate',
      width: 80,
      align: 'right',
      render: (v) => Number(v).toFixed(2),
    },
    {
      title: t('manualGL.col.dataSource'),
      key: 'dataSource',
      width: 90,
      render: () => <Tag>Manual</Tag>,
    },
    {
      title: t('manualGL.col.status'),
      dataIndex: 'glStatus',
      key: 'glStatus',
      fixed: 'right',
      width: 120,
      render: (v: ManualGLPair['glStatus']) =>
        v === 'Posted'
          ? <Tag color="green">{t('manualGL.status.posted')}</Tag>
          : <Tag color="orange">{t('manualGL.status.draft')}</Tag>,
    },
    {
      title: t('manualGL.col.action'),
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, row) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            disabled={row.glStatus === 'Posted'}
            onClick={() => onEdit(row)}
          />
          <Popconfirm
            title={t('manualGL.confirmDelete')}
            description={t('manualGL.confirmDeleteDesc')}
            onConfirm={() => onDelete(row.docNum, row.comcode)}
            disabled={row.glStatus === 'Posted'}
            okText={t('manualGL.deleteSelected')}
            cancelText="Hủy"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              disabled={row.glStatus === 'Posted'}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const tableData = data.map(r => ({ ...r, uid: `${r.comcode}_${r.docNum}` }))

  return (
    <div className="flex-1 overflow-hidden">
      <TableReport<ManualGLPair & { uid: string }>
        hideFilterBar
        columns={columns as any}
        dataSource={tableData}
        rowKey="uid"
        loading={loading}
        scrollX={1800}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedUids,
          onChange: (keys) => onSelectChange(keys as string[]),
        }}
      />
    </div>
  )
}
