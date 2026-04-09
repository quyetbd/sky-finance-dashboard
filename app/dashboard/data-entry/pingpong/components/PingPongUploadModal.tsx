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

export default function PingPongUploadModal({ open, companies, periods, onClose, onSuccess }: Props) {
  const t = useT()
  return (
    <DataEntryUploadModal
      open={open}
      title={t('pingpong.uploadFile')}
      fileAccept=".xlsx,.xls"
      fileLabel="File Excel"
      fileHint={t('pingpong.uploadHint')}
      fileSubhint="PingPong Statement (.xlsx)"
      fileTypeError={t('pingpong.uploadFileType')}
      companies={companies}
      periods={periods}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  )
}
