'use client'

import React, { useEffect, useState } from 'react'
import { App, Button, Form, Input, InputNumber, Modal, Select, Typography } from 'antd'
import { useT } from '@/lib/i18n/LocaleContext'
import type { InitializePayload, PeriodType } from '@/lib/types'

const { Text } = Typography

interface InitializeModalProps {
  open: boolean
  onClose: () => void
  /** Gọi sau khi khởi tạo thành công — truyền năm vừa tạo để page re-fetch */
  onSuccess: (year: number) => void
}

export default function InitializeModal({ open, onClose, onSuccess }: InitializeModalProps) {
  const t = useT()
  const { message } = App.useApp()
  const [form] = Form.useForm<{ year: number; periodType: PeriodType; note: string }>()
  const [loading, setLoading] = useState(false)

  const currentYear = new Date().getFullYear()

  // Sync note placeholder: theo dõi year field để update placeholder
  // Dùng Form.useWatch thay vì useState để không trigger re-render không cần thiết
  const watchYear: number = Form.useWatch('year', form) ?? currentYear

  // Khi modal mở lại, reset form về giá trị mặc định
  useEffect(() => {
    if (open) {
      form.resetFields()
    }
  }, [open, form])

  function handleClose() {
    form.resetFields()
    onClose()
  }

  async function handleFinish(values: { year: number; periodType: PeriodType; note: string }) {
    setLoading(true)
    try {
      const payload: InitializePayload = {
        year: values.year,
        periodType: values.periodType,
        // Nếu user không nhập note, dùng giá trị mặc định
        note: values.note?.trim() || t('fiscalPeriods.form.notePlaceholder').replace('{year}', String(values.year)),
      }

      const res = await fetch('/api/periods/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!res.ok) {
        message.error(json.error ?? t('fiscalPeriods.error.initFailed'))
        return
      }

      message.success(t('fiscalPeriods.success.initialized'))
      handleClose()
      onSuccess(values.year)
    } catch {
      message.error(t('fiscalPeriods.error.initFailed'))
    } finally {
      setLoading(false)
    }
  }

  const notePlaceholder = t('fiscalPeriods.form.notePlaceholder').replace('{year}', String(watchYear))

  return (
    <Modal
      title={t('fiscalPeriods.form.title')}
      open={open}
      onCancel={handleClose}
      footer={null}
      width={440}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          year: currentYear,
          periodType: 'Tháng' as PeriodType,
          note: '',
        }}
        onFinish={handleFinish}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="year"
          label={t('fiscalPeriods.form.year')}
          rules={[{ required: true, message: t('fiscalPeriods.form.yearRequired') }]}
        >
          <InputNumber
            min={2000}
            max={2100}
            controls={false}
            style={{ width: '100%' }}
            placeholder={String(currentYear)}
          />
        </Form.Item>

        <Form.Item
          name="periodType"
          label={t('fiscalPeriods.form.periodType')}
          extra={
            <Text type="secondary" style={{ fontSize: 11 }}>
              {t('fiscalPeriods.form.hintType')}
            </Text>
          }
        >
          <Select
            options={[
              { value: 'Tháng', label: t('fiscalPeriods.form.typeMonth') },
              { value: 'Quý',   label: t('fiscalPeriods.form.typeQuarter') },
            ]}
          />
        </Form.Item>

        <Form.Item name="note" label={t('fiscalPeriods.form.note')}>
          <Input placeholder={notePlaceholder} maxLength={100} />
        </Form.Item>

        {/* Cảnh báo không được khởi tạo lần 2 */}
        <Text type="danger" style={{ fontSize: 11, display: 'block', marginBottom: 20 }}>
          {t('fiscalPeriods.form.hintDuplicate')}
        </Text>

        <Form.Item style={{ marginBottom: 0 }}>
          <div className='flex gap-2 justify-center'>
            <Button size='large' onClick={handleClose} disabled={loading}>
              {t('fiscalPeriods.cancel')}
            </Button>
            <Button size='large' type="primary" htmlType="submit" loading={loading}>
              {t('fiscalPeriods.form.submit')}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
