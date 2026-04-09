'use client'

import React, { useState } from 'react'
import { App, Input, InputNumber, Select, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useT } from '@/lib/i18n/LocaleContext'
import type { JournalTypeRuleRow } from '@/lib/types'
import { JOURNAL_TYPE_DATASOURCES, JOURNAL_TYPE_CLASSIFY_OPTIONS } from '@/lib/types'
import ActionLinks from '@/app/dashboard/config/components/ActionLinks'
import dayjs from 'dayjs'

type RowDraft = {
  dataSource: string
  journalType: string
  bankAccountNum: string
  contraAccount: number | null
  transAccount: number | null
  feeAccount: number | null
  partner: string
  classify: string
}

const NEW_ROW_ID = -1
type ExtRow = JournalTypeRuleRow & { _isNew?: true }

const DS_OPTIONS = JOURNAL_TYPE_DATASOURCES.map((v) => ({ value: v, label: v }))
const CLASSIFY_OPTIONS = JOURNAL_TYPE_CLASSIFY_OPTIONS.map((v) => ({ value: v, label: v }))

function defaultDraft(): RowDraft {
  return {
    dataSource: '',
    journalType: '',
    bankAccountNum: '',
    contraAccount: null,
    transAccount: null,
    feeAccount: null,
    partner: '',
    classify: '',
  }
}

type Props = {
  rows: JournalTypeRuleRow[]
  loading?: boolean
  onRefresh?: () => void
}

export default function JournalTypesTable({ rows, loading, onRefresh }: Props) {
  const t = useT()
  const { message, modal } = App.useApp()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDraft, setEditDraft] = useState<RowDraft | null>(null)
  const [hasNewRow, setHasNewRow] = useState(false)
  const [newDraft, setNewDraft] = useState<RowDraft>(defaultDraft)
  const [mutating, setMutating] = useState(false)

  function startEdit(row: JournalTypeRuleRow) {
    setEditingId(row.id)
    setEditDraft({
      dataSource: row.dataSource,
      journalType: row.journalType,
      bankAccountNum: row.bankAccountNum ?? '',
      contraAccount: row.contraAccount,
      transAccount: row.transAccount,
      feeAccount: row.feeAccount ?? null,
      partner: row.partner ?? '',
      classify: row.classify ?? '',
    })
  }

  function cancelEdit() { setEditingId(null); setEditDraft(null) }
  function openNewRow() { setHasNewRow(true); setNewDraft(defaultDraft()) }
  function cancelNew() { setHasNewRow(false) }

  function patchNew(patch: Partial<RowDraft>) { setNewDraft((p) => ({ ...p, ...patch })) }
  function patchEdit(patch: Partial<RowDraft>) { setEditDraft((p) => (p ? { ...p, ...patch } : p)) }

  async function handleSaveNew() {
    if (!newDraft.dataSource || !newDraft.journalType || !newDraft.contraAccount || !newDraft.transAccount) {
      message.warning(t('journalTypes.error.requiredFields'))
      return
    }
    setMutating(true)
    try {
      // TODO: replace with real API call
      message.success(t('journalTypes.saveSuccess'))
      setHasNewRow(false)
      onRefresh?.()
    } finally {
      setMutating(false)
    }
  }

  async function handleSaveEdit(id: number) {
    if (!editDraft?.dataSource || !editDraft.journalType || !editDraft.contraAccount || !editDraft.transAccount) {
      message.warning(t('journalTypes.error.requiredFields'))
      return
    }
    setMutating(true)
    try {
      // TODO: replace with real API call
      message.success(t('journalTypes.saveSuccess'))
      cancelEdit()
      onRefresh?.()
    } finally {
      setMutating(false)
    }
  }

  function handleDelete(id: number) {
    modal.confirm({
      title: t('journalTypes.deleteConfirm'),
      okType: 'danger',
      okText: t('journalTypes.delete'),
      onOk: async () => {
        try {
          // TODO: replace with real API call
          message.success(t('journalTypes.deleteSuccess'))
          onRefresh?.()
        } catch {
          message.error(t('journalTypes.error.deleteFailed'))
        }
      },
    })
  }

  // ── Shared cell renderer helpers ────────────────────────────────────────────

  function renderText(
    val: string | null,
    record: ExtRow,
    draftKey: keyof RowDraft,
    width: number,
    placeholder?: string,
  ) {
    const isEditing = record._isNew || editingId === record.id
    const draft = record._isNew ? newDraft : editDraft
    if (isEditing && draft) {
      return (
        <Input
          size="small"
          value={draft[draftKey] as string}
          placeholder={placeholder}
          style={{ width }}
          onChange={(e) =>
            record._isNew
              ? patchNew({ [draftKey]: e.target.value })
              : patchEdit({ [draftKey]: e.target.value })
          }
        />
      )
    }
    return val ?? <span style={{ color: '#bbb' }}>NA</span>
  }

  function renderNumber(
    val: number | null,
    record: ExtRow,
    draftKey: keyof RowDraft,
    width: number,
  ) {
    const isEditing = record._isNew || editingId === record.id
    const draft = record._isNew ? newDraft : editDraft
    if (isEditing && draft) {
      return (
        <InputNumber
          size="small"
          value={draft[draftKey] as number | null}
          controls={false}
          style={{ width }}
          onChange={(v) =>
            record._isNew
              ? patchNew({ [draftKey]: v })
              : patchEdit({ [draftKey]: v })
          }
        />
      )
    }
    if (val == null) return <span style={{ color: '#bbb' }}>NA</span>
    return val
  }

  function renderSelect(
    val: string | null,
    record: ExtRow,
    draftKey: keyof RowDraft,
    options: { value: string; label: string }[],
    width: number,
  ) {
    const isEditing = record._isNew || editingId === record.id
    const draft = record._isNew ? newDraft : editDraft
    if (isEditing && draft) {
      return (
        <Select
          size="small"
          value={(draft[draftKey] as string) || undefined}
          options={options}
          allowClear
          style={{ width }}
          onChange={(v: string) =>
            record._isNew
              ? patchNew({ [draftKey]: v ?? '' })
              : patchEdit({ [draftKey]: v ?? '' })
          }
        />
      )
    }
    if (!val) return <span style={{ color: '#bbb' }}>NA</span>
    return val
  }

  // ── Columns ─────────────────────────────────────────────────────────────────

  const columns: ColumnsType<ExtRow> = [
    {
      title: t('journalTypes.col.dataSource'),
      dataIndex: 'dataSource',
      width: 110,
      render: (val: string, record) => renderSelect(val, record, 'dataSource', DS_OPTIONS, 104),
    },
    {
      title: t('journalTypes.col.journalType'),
      dataIndex: 'journalType',
      render: (val: string, record) => renderText(val, record, 'journalType', 200, 'e.g. Express Checkout Payment'),
    },
    {
      title: t('journalTypes.col.bankAcct'),
      dataIndex: 'bankAccountNum',
      width: 110,
      render: (val: string | null, record) => renderText(val, record, 'bankAccountNum', 100, 'e.g. 1019512'),
    },
    {
      title: t('journalTypes.col.contraAccount'),
      dataIndex: 'contraAccount',
      width: 110,
      align: 'right',
      render: (val: number, record) => renderNumber(val, record, 'contraAccount', 100),
    },
    {
      title: t('journalTypes.col.transAccount'),
      dataIndex: 'transAccount',
      width: 110,
      align: 'right',
      render: (val: number, record) => renderNumber(val, record, 'transAccount', 100),
    },
    {
      title: t('journalTypes.col.feeAccount'),
      dataIndex: 'feeAccount',
      width: 100,
      align: 'right',
      render: (val: number | null, record) => renderNumber(val, record, 'feeAccount', 90),
    },
    {
      title: t('journalTypes.col.partner'),
      dataIndex: 'partner',
      width: 110,
      render: (val: string | null, record) => renderText(val, record, 'partner', 100),
    },
    {
      title: t('journalTypes.col.classify'),
      dataIndex: 'classify',
      width: 100,
      render: (val: string | null, record) => renderSelect(val, record, 'classify', CLASSIFY_OPTIONS, 94),
    },
    {
      title: t('journalTypes.col.addDate'),
      dataIndex: 'addDate',
      width: 96,
      render: (val: string | null) =>
        val ? dayjs(val).format('MM/DD/YYYY') : <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: t('journalTypes.col.modifiedDate'),
      dataIndex: 'modifiedDate',
      width: 108,
      render: (val: string | null) =>
        val ? dayjs(val).format('MM/DD/YYYY') : <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: t('journalTypes.col.action'),
      width: 110,
      render: (_, record) => {
        if (record._isNew) {
          return (
            <ActionLinks
              primary={{ label: t('journalTypes.save'), onClick: handleSaveNew }}
              secondary={{ label: t('journalTypes.cancel'), onClick: cancelNew, muted: true }}
            />
          )
        }
        if (editingId === record.id) {
          return (
            <ActionLinks
              primary={{ label: t('journalTypes.save'), onClick: () => handleSaveEdit(record.id) }}
              secondary={{ label: t('journalTypes.cancel'), onClick: cancelEdit, muted: true }}
            />
          )
        }
        return (
          <ActionLinks
            primary={{ label: t('journalTypes.edit'), onClick: () => startEdit(record) }}
            secondary={{ label: t('journalTypes.delete'), onClick: () => handleDelete(record.id), danger: true }}
          />
        )
      },
    },
  ]

  const newRowRecord: ExtRow = {
    id: NEW_ROW_ID,
    dataSource: '',
    journalType: '',
    bankAccountNum: null,
    contraAccount: 0,
    transAccount: 0,
    feeAccount: null,
    partner: null,
    classify: null,
    addDate: null,
    modifiedDate: null,
    _isNew: true,
  }

  const dataSource: ExtRow[] = [...rows, ...(hasNewRow ? [newRowRecord] : [])]

  return (
    <Table
      size="small"
      rowKey={(r) => (r._isNew ? NEW_ROW_ID : r.id)}
      columns={columns}
      dataSource={dataSource}
      loading={loading || mutating}
      pagination={false}
      scroll={{ x: 'max-content' }}
      footer={() =>
        !hasNewRow ? (
          <Typography.Link onClick={openNewRow}>{t('journalTypes.addNew')}</Typography.Link>
        ) : null
      }
    />
  )
}
