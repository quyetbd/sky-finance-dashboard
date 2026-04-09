'use client'

import { AutoComplete, Form, Input, InputNumber, Tag } from 'antd'
import { DatePicker } from 'antd'
import { Controller } from 'react-hook-form'
import type { Control, FieldErrors } from 'react-hook-form'
import { z } from 'zod'
import dayjs from 'dayjs'
import { useT } from '@/lib/i18n/LocaleContext'

// ─── Schema & Types (exported for modal use) ─────────────────────────────────

export const manualGLSchema = z.object({
  comcode: z.string().min(1),
  date: z.string().min(1),
  period: z.string().min(6),
  journalType: z.string().min(1),
  transAccount: z.number({ message: 'Required' }).int().positive(),
  contraAccount: z.number({ message: 'Required' }).int().positive(),
  amount: z.string().refine((v) => parseFloat(v) > 0, { message: 'Must be > 0' }),
  partnerCode: z.string().optional(),
  description: z.string().optional(),
  balanceImpact: z.string().optional(),
  referenceTxnId: z.string().optional(),
  refNum: z.string().optional(),
})

export type FormValues = z.infer<typeof manualGLSchema>

export type JournalTypeRule = {
  id: number
  journalType: string
  transAccount: number
  contraAccount: number
  dataSource: string
}

export type CoAOption = {
  accountCode: number
  accountName: string
}

// ─── Props ───────────────────────────────────────────────────────────────────

type Props = {
  control: Control<FormValues>
  errors: FieldErrors<FormValues>
  isEdit: boolean
  companies: { value: string; label: string }[]
  openPeriods: { value: string; label: string }[]
  currency: string
  coaOptions: CoAOption[]
  journalTypeOptions: JournalTypeRule[]
  onSearchJournalTypes: (q: string) => void
  onSelectJournalType: (journalType: string) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ManualGLEntryForm({
  control,
  errors,
  isEdit,
  companies,
  openPeriods,
  currency,
  coaOptions,
  journalTypeOptions,
  onSearchJournalTypes,
  onSelectJournalType,
}: Props) {
  const t = useT()

  const coaAutocomplete = (q: string) =>
    coaOptions
      .filter((a) => String(a.accountCode).includes(q) || a.accountName.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 20)
      .map((a) => ({ value: a.accountCode, label: `${a.accountCode} — ${a.accountName}` }))

  return (
    <Form layout="vertical" size="small" className="max-h-[calc(100vh-250px)] overflow-y-auto !p-2">

      {/* Comcode */}
      <Form.Item
        label={t('manualGL.form.comcode')}
        validateStatus={errors.comcode ? 'error' : ''}
        help={errors.comcode ? t('manualGL.form.comcodeRequired') : undefined}
        required
      >
        <Controller
          name="comcode"
          control={control}
          render={({ field }) => (
            <AutoComplete
              {...field}
              options={companies.map((c) => ({ value: c.value, label: c.label }))}
              placeholder={t('manualGL.form.comcode')}
              disabled={isEdit}
              size="middle"
            />
          )}
        />
      </Form.Item>

      {/* Date */}
      <Form.Item
        label={t('manualGL.form.date')}
        validateStatus={errors.date ? 'error' : ''}
        help={errors.date ? t('manualGL.form.dateRequired') : undefined}
        required
      >
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              value={field.value ? dayjs(field.value) : null}
              onChange={(d) => field.onChange(d ? d.format('YYYY-MM-DD') : '')}
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              size="middle"
            />
          )}
        />
      </Form.Item>

      {/* Period */}
      <Form.Item
        label={t('manualGL.form.period')}
        validateStatus={errors.period ? 'error' : ''}
        help={errors.period ? t('manualGL.form.periodRequired') : undefined}
        required
      >
        <Controller
          name="period"
          control={control}
          render={({ field }) => (
            <AutoComplete
              {...field}
              options={openPeriods.map((p) => ({ value: p.value, label: p.label }))}
              placeholder={t('manualGL.selectPeriod')}
              disabled={isEdit}
              size="middle"
            />
          )}
        />
      </Form.Item>

      {/* JournalType */}
      <Form.Item
        label={t('manualGL.form.journalType')}
        validateStatus={errors.journalType ? 'error' : ''}
        help={errors.journalType ? t('manualGL.form.journalTypeRequired') : undefined}
        required
      >
        <Controller
          name="journalType"
          control={control}
          render={({ field }) => (
            <AutoComplete
              {...field}
              options={journalTypeOptions.map((r) => ({ value: r.journalType, label: r.journalType }))}
              onSearch={onSearchJournalTypes}
              onSelect={onSelectJournalType}
              placeholder={t('manualGL.form.journalType')}
              size="middle"
            />
          )}
        />
      </Form.Item>

      {/* TransAccount */}
      <Form.Item
        label={t('manualGL.form.transAccount')}
        validateStatus={errors.transAccount ? 'error' : ''}
        help={errors.transAccount ? t('manualGL.form.transAccountRequired') : undefined}
        required
      >
        <Controller
          name="transAccount"
          control={control}
          render={({ field }) => (
            <AutoComplete
              value={field.value ? String(field.value) : ''}
              options={coaAutocomplete(field.value ? String(field.value) : '')}
              onSearch={(q) => field.onChange(q)}
              onSelect={(val) => field.onChange(Number(val))}
              placeholder={t('manualGL.form.transAccountPlaceholder')}
              size="middle"
            />
          )}
        />
      </Form.Item>

      {/* ContraAccount */}
      <Form.Item
        label={t('manualGL.form.contraAccount')}
        validateStatus={errors.contraAccount ? 'error' : ''}
        help={errors.contraAccount ? t('manualGL.form.contraAccountRequired') : undefined}
        required
      >
        <Controller
          name="contraAccount"
          control={control}
          render={({ field }) => (
            <AutoComplete
              value={field.value ? String(field.value) : ''}
              options={coaAutocomplete(field.value ? String(field.value) : '')}
              onSearch={(q) => field.onChange(q)}
              onSelect={(val) => field.onChange(Number(val))}
              placeholder={t('manualGL.form.contraAccountPlaceholder')}
              size="middle"
            />
          )}
        />
      </Form.Item>

      {/* Amount */}
      <Form.Item
        label={t('manualGL.form.amount')}
        validateStatus={errors.amount ? 'error' : ''}
        help={errors.amount ? t('manualGL.form.amountPositive') : undefined}
        required
      >
        <Controller
          name="amount"
          control={control}
          render={({ field }) => (
            <InputNumber
              value={field.value ? Number(field.value) : undefined}
              onChange={(v) => field.onChange(v ? String(v) : '')}
              style={{ width: '100%' }}
              min={0.01}
              step={0.01}
              precision={2}
              placeholder="0.00"
              size="middle"
            />
          )}
        />
      </Form.Item>

      {/* Currency (readonly) */}
      <Form.Item label={t('manualGL.form.currency')}>
        <Tag color="blue">{currency}</Tag>
        <span className="ml-2 text-colorTextSecondary" style={{ fontSize: 12 }}>
          {t('manualGL.form.currencyNote')}
        </span>
      </Form.Item>

      {/* XRate (readonly) */}
      <Form.Item label={t('manualGL.form.xRate')}>
        <Tag>1.00</Tag>
        <span className="ml-2 text-colorTextSecondary" style={{ fontSize: 12 }}>
          {t('manualGL.form.xRateNote')}
        </span>
      </Form.Item>

      {/* DataSource (readonly) */}
      <Form.Item label={t('manualGL.form.dataSource')}>
        <Tag>Manual</Tag>
      </Form.Item>

      {/* PartnerCode */}
      <Form.Item label={t('manualGL.form.partnerCode')}>
        <Controller
          name="partnerCode"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder={t('manualGL.form.partnerCodePlaceholder')} size="middle" />
          )}
        />
      </Form.Item>

      {/* Description */}
      <Form.Item label={t('manualGL.form.description')}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Input.TextArea {...field} rows={2} size="middle" />}
        />
      </Form.Item>

      {/* Optional fields */}
      <Form.Item label={t('manualGL.form.balanceImpact')}>
        <Controller
          name="balanceImpact"
          control={control}
          render={({ field }) => (
            <Input {...field} placeholder={t('manualGL.form.balanceImpactPlaceholder')} size="middle" />
          )}
        />
      </Form.Item>

      <Form.Item label={t('manualGL.form.referenceTxnId')}>
        <Controller
          name="referenceTxnId"
          control={control}
          render={({ field }) => <Input {...field} size="middle" />}
        />
      </Form.Item>

      <Form.Item label={t('manualGL.form.refNum')}>
        <Controller
          name="refNum"
          control={control}
          render={({ field }) => <Input {...field} size="middle" />}
        />
      </Form.Item>

    </Form>
  )
}
