'use client'

import React, { useEffect, useState } from 'react'
import { App, Input, InputNumber, Select, Table, Tag, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'

import { useT } from '@/lib/i18n/LocaleContext'
import type { ChartOfAccountRow } from '@/lib/types'
import { ACCOUNT_TYPE_OPTIONS, ARAP_TYPE_OPTIONS } from '@/lib/types'
import ActionLinks from '@/app/dashboard/config/components/ActionLinks'

// ─── Constants ────────────────────────────────────────────────────────────────

const BALANCE_SIDE_OPTIONS = [
  { value: 'Dr', label: 'Dr' },
  { value: 'Cr', label: 'Cr' },
]

const STATUS_OPTIONS = [
  { value: 'Active',   label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
]

const ARAP_OPTIONS = [
  { value: '',   label: '—' },
  { value: 'AR', label: 'AR' },
  { value: 'AP', label: 'AP' },
]

const ARAP_TYPE_SELECT = ARAP_TYPE_OPTIONS.map((v) => ({ value: v, label: v }))

// AccountType color badges
const ACCOUNT_TYPE_COLOR: Record<string, string> = {
  A:   'blue',
  L:   'volcano',
  E:   'green',
  R:   'cyan',
  Exp: 'orange',
}

// ─── Types ────────────────────────────────────────────────────────────────────

type CoaDraft = {
  accountCode: number | null
  accountName: string
  accountType: string
  balanceSide: string
  status:      string
  arap:        string
  arapType:    string
}

const NEW_ROW_KEY = '__new__'
type ExtRow = ChartOfAccountRow & { _isNew?: true }

function defaultDraft(): CoaDraft {
  return {
    accountCode: null,
    accountName: '',
    accountType: 'A',
    balanceSide: 'Dr',
    status:      'Active',
    arap:        '',
    arapType:    '',
  }
}

// Auto-suggest balanceSide from accountType
function suggestBalanceSide(type: string): string {
  return type === 'L' || type === 'E' || type === 'R' ? 'Cr' : 'Dr'
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  rows:        ChartOfAccountRow[]
  loading:     boolean
  isAdmin:     boolean
  showNewRow:  boolean
  onCancelNew: () => void
  onRefresh:   () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CoaTable({ rows, loading, isAdmin, showNewRow, onCancelNew, onRefresh }: Props) {
  const t = useT()
  const { message, modal } = App.useApp()

  const [editingCode, setEditingCode] = useState<number | null>(null)

  // Reset newDraft whenever the page opens a new row
  useEffect(() => {
    if (showNewRow) setNewDraft(defaultDraft())
  }, [showNewRow])
  const [editDraft,   setEditDraft]   = useState<CoaDraft | null>(null)
  const [newDraft,    setNewDraft]    = useState<CoaDraft>(defaultDraft)
  const [mutating,    setMutating]    = useState(false)

  // ── draft helpers ──
  function patchNew(patch: Partial<CoaDraft>) { setNewDraft((p) => ({ ...p, ...patch })) }
  function patchEdit(patch: Partial<CoaDraft>) { setEditDraft((p) => (p ? { ...p, ...patch } : p)) }

  function startEdit(row: ChartOfAccountRow) {
    setEditingCode(row.accountCode)
    setEditDraft({
      accountCode: row.accountCode,
      accountName: row.accountName,
      accountType: row.accountType,
      balanceSide: row.balanceSide,
      status:      row.status,
      arap:        row.arap     ?? '',
      arapType:    row.arapType ?? '',
    })
  }

  function cancelEdit() { setEditingCode(null); setEditDraft(null) }

  // ── save new ──
  async function handleSaveNew() {
    const d = newDraft
    if (!d.accountCode || !d.accountName || !d.accountType || !d.balanceSide) {
      message.warning(t('chartOfAccounts.error.requiredFields'))
      return
    }
    setMutating(true)
    try {
      const res = await fetch('/api/chart-of-accounts', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountCode: d.accountCode,
          accountName: d.accountName,
          accountType: d.accountType,
          balanceSide: d.balanceSide,
          status:      d.status,
          arap:        d.arap     || null,
          arapType:    d.arapType || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      message.success(t('chartOfAccounts.saveSuccess'))
      onCancelNew()
      onRefresh()
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : t('chartOfAccounts.error.saveFailed'))
    } finally { setMutating(false) }
  }

  // ── save edit ──
  async function handleSaveEdit(accountCode: number) {
    const d = editDraft
    if (!d?.accountName || !d.accountType || !d.balanceSide) {
      message.warning(t('chartOfAccounts.error.requiredFields'))
      return
    }
    setMutating(true)
    try {
      const res = await fetch(`/api/chart-of-accounts/${accountCode}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountName: d.accountName,
          accountType: d.accountType,
          balanceSide: d.balanceSide,
          status:      d.status,
          arap:        d.arap     || null,
          arapType:    d.arapType || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      message.success(t('chartOfAccounts.saveSuccess'))
      cancelEdit()
      onRefresh()
    } catch (e: unknown) {
      message.error(e instanceof Error ? e.message : t('chartOfAccounts.error.saveFailed'))
    } finally { setMutating(false) }
  }

  // ── delete ──
  function handleDelete(accountCode: number, accountName: string) {
    modal.confirm({
      title:    t('chartOfAccounts.deleteConfirm'),
      content:  `[${accountCode}] ${accountName}`,
      okType:   'danger',
      okText:   t('chartOfAccounts.delete'),
      cancelText: t('chartOfAccounts.cancel'),
      onOk: async () => {
        try {
          const res = await fetch(`/api/chart-of-accounts/${accountCode}`, { method: 'DELETE' })
          const json = await res.json()
          if (!res.ok) throw new Error(json.error)
          message.success(t('chartOfAccounts.deleteSuccess'))
          onRefresh()
        } catch (e: unknown) {
          message.error(e instanceof Error ? e.message : t('chartOfAccounts.error.deleteFailed'))
        }
      },
    })
  }

  // ─── Columns ────────────────────────────────────────────────────────────────

  const columns: ColumnsType<ExtRow> = [
    {
      title:  t('chartOfAccounts.col.stt'),
      width:  50,
      align:  'center',
      render: (_: unknown, record: ExtRow, index: number) => record._isNew ? '' : index + 1,
    },
    {
      title:     t('chartOfAccounts.col.accountCode'),
      dataIndex: 'accountCode',
      width:     110,
      render: (val: number, record) => {
        if (record._isNew) {
          return (
            <InputNumber
              size="small"
              value={newDraft.accountCode ?? undefined}
              placeholder="11101001"
              style={{ width: 100 }}
              controls={false}
              onChange={(v) => patchNew({ accountCode: v ?? null })}
            />
          )
        }
        return val
      },
    },
    {
      title:     t('chartOfAccounts.col.accountName'),
      dataIndex: 'accountName',
      render: (val: string, record) => {
        const isEditing = record._isNew || editingCode === record.accountCode
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <Input
              size="small"
              value={draft.accountName}
              style={{ width: '100%', minWidth: 160 }}
              onChange={(e) =>
                record._isNew
                  ? patchNew({ accountName: e.target.value })
                  : patchEdit({ accountName: e.target.value })
              }
            />
          )
        }
        return val
      },
    },
    {
      title:     t('chartOfAccounts.col.accountType'),
      dataIndex: 'accountType',
      width:     100,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingCode === record.accountCode
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <Select
              size="small"
              value={draft.accountType}
              options={ACCOUNT_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              style={{ width: 80 }}
              onChange={(v: string) => {
                const side = suggestBalanceSide(v)
                if (record._isNew) {
                  patchNew({ accountType: v, balanceSide: side })
                } else {
                  patchEdit({ accountType: v, balanceSide: side })
                }
              }}
            />
          )
        }
        return (
          <Tooltip title={ACCOUNT_TYPE_OPTIONS.find((o) => o.value === val)?.desc}>
            <Tag color={ACCOUNT_TYPE_COLOR[val] ?? 'default'}>{val}</Tag>
          </Tooltip>
        )
      },
    },
    {
      title:     t('chartOfAccounts.col.balanceSide'),
      dataIndex: 'balanceSide',
      width:     90,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingCode === record.accountCode
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <Select
              size="small"
              value={draft.balanceSide}
              options={BALANCE_SIDE_OPTIONS}
              style={{ width: 72 }}
              onChange={(v: string) =>
                record._isNew ? patchNew({ balanceSide: v }) : patchEdit({ balanceSide: v })
              }
            />
          )
        }
        return val
      },
    },
    {
      title:     t('chartOfAccounts.col.status'),
      dataIndex: 'status',
      width:     100,
      render: (val: string, record) => {
        const isEditing = record._isNew || editingCode === record.accountCode
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <Select
              size="small"
              value={draft.status}
              options={STATUS_OPTIONS}
              style={{ width: 90 }}
              onChange={(v: string) =>
                record._isNew ? patchNew({ status: v }) : patchEdit({ status: v })
              }
            />
          )
        }
        return (
          <Tag color={val === 'Active' ? 'success' : 'default'}>{val}</Tag>
        )
      },
    },
    {
      title:     t('chartOfAccounts.col.addDate'),
      dataIndex: 'createdAt',
      width:     100,
      render: (val: string, record) => {
        if (record._isNew) return ''
        return val ? new Date(val).toLocaleDateString('en-CA') : ''
      },
    },
    {
      title:     t('chartOfAccounts.col.modifiedDate'),
      dataIndex: 'updatedAt',
      width:     110,
      render: (val: string, record) => {
        if (record._isNew) return ''
        return val ? new Date(val).toLocaleDateString('en-CA') : ''
      },
    },
    {
      title:     t('chartOfAccounts.col.arap'),
      dataIndex: 'arap',
      width:     70,
      render: (val: string | null, record) => {
        const isEditing = record._isNew || editingCode === record.accountCode
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft) {
          return (
            <Select
              size="small"
              value={draft.arap}
              options={ARAP_OPTIONS}
              style={{ width: 62 }}
              onChange={(v: string) => {
                if (record._isNew) {
                  patchNew({ arap: v, arapType: v ? draft.arapType : '' })
                } else {
                  patchEdit({ arap: v, arapType: v ? draft.arapType : '' })
                }
              }}
            />
          )
        }
        return val ?? ''
      },
    },
    {
      title:     t('chartOfAccounts.col.arapType'),
      dataIndex: 'arapType',
      render: (val: string | null, record) => {
        const isEditing = record._isNew || editingCode === record.accountCode
        const draft = record._isNew ? newDraft : editDraft
        if (isEditing && draft && draft.arap) {
          return (
            <Select
              size="small"
              value={draft.arapType || undefined}
              options={ARAP_TYPE_SELECT}
              placeholder={t('chartOfAccounts.arapTypePlaceholder')}
              style={{ width: '100%', minWidth: 200 }}
              onChange={(v: string) =>
                record._isNew ? patchNew({ arapType: v }) : patchEdit({ arapType: v })
              }
            />
          )
        }
        if (isEditing && draft && !draft.arap) return ''
        return val ?? ''
      },
    },
    ...(isAdmin
      ? [
          {
            title:  t('chartOfAccounts.col.action'),
            width:  110,
            render: (_: unknown, record: ExtRow) => {
              if (record._isNew) {
                return (
                  <ActionLinks
                    primary={{   label: t('chartOfAccounts.save'),   onClick: handleSaveNew }}
                    secondary={{ label: t('chartOfAccounts.cancel'), onClick: onCancelNew, muted: true }}
                  />
                )
              }
              if (editingCode === record.accountCode) {
                return (
                  <ActionLinks
                    primary={{   label: t('chartOfAccounts.save'),   onClick: () => handleSaveEdit(record.accountCode) }}
                    secondary={{ label: t('chartOfAccounts.cancel'), onClick: cancelEdit, muted: true }}
                  />
                )
              }
              return (
                <ActionLinks
                  primary={{   label: t('chartOfAccounts.edit'),   onClick: () => startEdit(record) }}
                  secondary={{ label: t('chartOfAccounts.delete'), onClick: () => handleDelete(record.accountCode, record.accountName), danger: true }}
                />
              )
            },
          } as ColumnsType<ExtRow>[number],
        ]
      : []),
  ]

  const newRowRecord: ExtRow = {
    accountCode: 0,
    accountName: '',
    accountType: 'A',
    balanceSide: 'Dr',
    status:      'Active',
    arap:        null,
    arapType:    null,
    createdAt:   '',
    updatedAt:   '',
    _isNew:      true,
  }

  const dataSource: ExtRow[] = [...rows, ...(showNewRow ? [newRowRecord] : [])]

  return (
    <Table
      size="small"
      rowKey={(r) => (r._isNew ? NEW_ROW_KEY : String(r.accountCode))}
      columns={columns}
      dataSource={dataSource}
      loading={loading || mutating}
      pagination={{ pageSize: 50, showSizeChanger: false, showTotal: (total) => `${total} accounts` }}
      scroll={{ y: 'calc(100vh - 280px)', x: 'max-content' }}
    />
  )
}
