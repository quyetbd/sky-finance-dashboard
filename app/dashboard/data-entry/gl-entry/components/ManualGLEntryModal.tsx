'use client'

import { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { useForm } from 'react-hook-form'
import { useT } from '@/lib/i18n/LocaleContext'
import { apiClient } from '@/lib/api-client'
import ManualGLEntryForm from './ManualGLEntryForm'
import { manualGLSchema } from './ManualGLEntryForm'
import type { FormValues, JournalTypeRule, CoAOption } from './ManualGLEntryForm'
import type { ManualGLPair, CreateManualGLPayload, FiscalPeriodRecord } from '@/lib/types'

// ─── Props ───────────────────────────────────────────────────────────────────

type Props = {
  open: boolean
  editingRow: ManualGLPair | null
  companies: { value: string; label: string }[]
  onClose: () => void
  onSubmit: (payload: CreateManualGLPayload, docNum?: string) => Promise<void>
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ManualGLEntryModal({ open, editingRow, companies, onClose, onSubmit }: Props) {
  const t = useT()
  const isEdit = !!editingRow

  const [submitting, setSubmitting] = useState(false)
  const [currency, setCurrency] = useState('USD')
  const [openPeriods, setOpenPeriods] = useState<{ value: string; label: string }[]>([])
  const [coaOptions, setCoaOptions] = useState<CoAOption[]>([])
  const [journalTypeOptions, setJournalTypeOptions] = useState<JournalTypeRule[]>([])

  const { control, handleSubmit, reset, setValue, watch, setError, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      comcode: '', date: '', period: '', journalType: '',
      transAccount: undefined, contraAccount: undefined, amount: '',
      partnerCode: '', description: '', balanceImpact: '',
      referenceTxnId: '', refNum: '',
    },
  })

  const watchedComcode = watch('comcode')

  // Populate form when editing
  useEffect(() => {
    if (open && editingRow) {
      reset({
        comcode: editingRow.comcode,
        date: editingRow.date.slice(0, 10),
        period: editingRow.period,
        journalType: editingRow.journalType,
        transAccount: editingRow.transAccount,
        contraAccount: editingRow.contraAccount,
        amount: editingRow.amount,
        partnerCode: editingRow.partnerCode ?? '',
        description: editingRow.description ?? '',
        balanceImpact: editingRow.balanceImpact ?? '',
        referenceTxnId: editingRow.referenceTxnId ?? '',
        refNum: editingRow.refNum ?? '',
      })
      setCurrency(editingRow.currency)
    } else if (open && !editingRow) {
      reset({
        comcode: '', date: '', period: '', journalType: '',
        transAccount: undefined, contraAccount: undefined, amount: '',
        partnerCode: '', description: '', balanceImpact: '',
        referenceTxnId: '', refNum: '',
      })
      setCurrency('USD')
    }
  }, [open, editingRow, reset])

  // Fetch open periods and company currency when comcode changes
  useEffect(() => {
    if (!watchedComcode) return
    const co = companies.find((c) => c.value === watchedComcode)
    if (co) {
      apiClient.get<{ id: string; currency: string }[]>('/api/companies')
        .then((res) => {
          const found = (res.data ?? []).find((c) => c.id === watchedComcode)
          if (found) setCurrency(found.currency)
        })
        .catch(() => {})
    }
    apiClient.get<FiscalPeriodRecord[]>(`/api/periods?status=Open&comcode=${watchedComcode}`)
      .then((res) => {
        const records = res.data ?? []
        const unique = new Map<string, string>()
        for (const r of records) {
          const p = `${r.year}${String(r.month).padStart(2, '0')}`
          unique.set(p, `T${String(r.month).padStart(2, '0')}/${r.year}`)
        }
        setOpenPeriods([...unique.entries()].map(([value, label]) => ({ value, label })))
      })
      .catch(() => setOpenPeriods([]))
  }, [watchedComcode, companies])

  // Load CoA once per modal open
  useEffect(() => {
    if (!open) return
    apiClient.get<CoAOption[]>('/api/coa')
      .then((res) => setCoaOptions(res.data ?? []))
      .catch(() => {})
  }, [open])

  const searchJournalTypes = (q: string) => {
    apiClient.get<JournalTypeRule[]>(`/api/journal-types?q=${encodeURIComponent(q)}&dataSource=Manual`)
      .then((res) => setJournalTypeOptions(res.data ?? []))
      .catch(() => {})
  }

  const handleJournalTypeSelect = (journalType: string) => {
    const rule = journalTypeOptions.find((r) => r.journalType === journalType)
    if (rule) {
      setValue('transAccount', rule.transAccount, { shouldValidate: true })
      setValue('contraAccount', rule.contraAccount, { shouldValidate: true })
    }
  }

  const onFormSubmit = async (values: FormValues) => {
    const parsed = manualGLSchema.safeParse(values)
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof FormValues
        setError(field, { message: issue.message })
      }
      return
    }
    setSubmitting(true)
    try {
      const payload: CreateManualGLPayload = {
        comcode: values.comcode,
        period: values.period,
        journalType: values.journalType,
        transAccount: values.transAccount,
        contraAccount: values.contraAccount,
        amount: values.amount,
        currency,
        date: values.date,
        partnerCode: values.partnerCode || undefined,
        description: values.description || undefined,
        balanceImpact: values.balanceImpact || undefined,
        referenceTxnId: values.referenceTxnId || undefined,
        refNum: values.refNum || undefined,
      }
      await onSubmit(payload, editingRow?.docNum)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      title={isEdit ? t('manualGL.editEntry') : t('manualGL.addEntry')}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit(onFormSubmit)}
      confirmLoading={submitting}
      width={640}
      destroyOnHidden
    >
      <ManualGLEntryForm
        control={control}
        errors={errors}
        isEdit={isEdit}
        companies={companies}
        openPeriods={openPeriods}
        currency={currency}
        coaOptions={coaOptions}
        journalTypeOptions={journalTypeOptions}
        onSearchJournalTypes={searchJournalTypes}
        onSelectJournalType={handleJournalTypeSelect}
      />
    </Modal>
  )
}
