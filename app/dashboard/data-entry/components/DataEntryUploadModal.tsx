'use client'

import { useState } from 'react'
import { Modal, Form, Select, Upload, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadFile, RcFile } from 'antd/es/upload'
import { useT } from '@/lib/i18n/LocaleContext'

export interface DataEntryUploadModalProps {
  open: boolean
  title: string
  /** e.g. ".csv" or ".xlsx,.xls" */
  fileAccept: string
  /** Label shown above the dragger, e.g. "File CSV" or "File Excel" */
  fileLabel: string
  /** Primary dragger hint text (from i18n) */
  fileHint: string
  /** Secondary dragger subhint, e.g. "PayPal Statement CSV" */
  fileSubhint: string
  /** Error message when wrong file type is picked */
  fileTypeError: string
  companies: { value: string; label: string }[]
  /** Open accounting periods the user can upload into */
  periods: { value: string; label: string }[]
  onClose: () => void
  onSuccess: (comcode: string, period: string, file: RcFile) => Promise<void>
}

interface FormValues {
  comcode: string
  period: string
}

const { Dragger } = Upload

export default function DataEntryUploadModal({
  open,
  title,
  fileAccept,
  fileLabel,
  fileHint,
  fileSubhint,
  fileTypeError,
  companies,
  periods,
  onClose,
  onSuccess,
}: DataEntryUploadModalProps) {
  const t = useT()
  const [form] = Form.useForm<FormValues>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [submitting, setSubmitting] = useState(false)

  const handleClose = () => {
    form.resetFields()
    setFileList([])
    onClose()
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (fileList.length === 0) {
      form.setFields([{ name: 'file', errors: [t('dataEntryUpload.fileRequired')] }])
      return
    }
    const rcFile = fileList[0].originFileObj as RcFile
    setSubmitting(true)
    try {
      await onSuccess(values.comcode, values.period, rcFile)
      handleClose()
    } finally {
      setSubmitting(false)
    }
  }

  const acceptedExts = fileAccept.split(',').map((e) => e.trim())
  const isValidFile = (filename: string) =>
    acceptedExts.some((ext) => filename.toLowerCase().endsWith(ext))

  return (
    <Modal
      open={open}
      title={title}
      onCancel={handleClose}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          {t('dataEntryUpload.cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={submitting} onClick={handleSubmit}>
          {t('dataEntryUpload.upload')}
        </Button>,
      ]}
      destroyOnClose
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        {/* Company */}
        <Form.Item
          name="comcode"
          label={t('dataEntryUpload.company')}
          rules={[{ required: true, message: t('dataEntryUpload.companyRequired') }]}
        >
          <Select
            placeholder={t('dataEntryUpload.company')}
            options={companies}
          />
        </Form.Item>

        {/* Accounting Period */}
        <Form.Item
          name="period"
          label={t('dataEntryUpload.period')}
          rules={[{ required: true, message: t('dataEntryUpload.periodRequired') }]}
        >
          <Select
            placeholder={t('dataEntryUpload.period')}
            options={periods}
          />
        </Form.Item>

        {/* File dragger */}
        <Form.Item
          name="file"
          label={fileLabel}
          rules={[{ required: true, message: t('dataEntryUpload.fileRequired') }]}
        >
          <Dragger
            accept={fileAccept}
            maxCount={1}
            fileList={fileList}
            beforeUpload={(file) => {
              if (!isValidFile(file.name)) {
                form.setFields([{ name: 'file', errors: [fileTypeError] }])
                return Upload.LIST_IGNORE
              }
              setFileList([file as unknown as UploadFile])
              return false // prevent auto upload
            }}
            onRemove={() => {
              setFileList([])
              form.setFields([{ name: 'file', errors: [] }])
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">{fileHint}</p>
            <p className="ant-upload-hint">{fileSubhint}</p>
          </Dragger>
        </Form.Item>
      </Form>
    </Modal>
  )
}
