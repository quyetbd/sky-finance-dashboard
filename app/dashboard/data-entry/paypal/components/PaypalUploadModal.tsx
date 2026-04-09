'use client'

import type { RcFile } from 'antd/es/upload'
import { useT } from '@/lib/i18n/LocaleContext'
import DataEntryUploadModal from '../../components/DataEntryUploadModal'

interface Props {
  open: boolean
  companies: { value: string; label: string }[]
  periods: { value: string; label: string }[]
  onClose: () => void
  onSuccess: (comcode: string, period: string, file: RcFile) => Promise<void>
}

export default function PaypalUploadModal({ open, companies, periods, onClose, onSuccess }: Props) {
  const t = useT()
  return (
    <DataEntryUploadModal
      open={open}
      title={t('paypal.uploadFile')}
      fileAccept=".csv"
      fileLabel="File CSV"
      fileHint={t('paypal.uploadHint')}
      fileSubhint="PayPal Statement CSV"
      fileTypeError={t('paypal.uploadFileType')}
      companies={companies}
      periods={periods}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}
