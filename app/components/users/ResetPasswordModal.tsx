'use client'

import React, { useState } from 'react'
import { Modal, Typography, message } from 'antd'
import { useRouter } from 'next/navigation'

const { Text } = Typography

interface ResetPasswordModalProps {
  open: boolean
  userId: string
  userEmail: string
  onClose: () => void
  onSuccess: () => void
}

export function ResetPasswordModal({
  open,
  userId,
  userEmail,
  onClose,
  onSuccess,
}: ResetPasswordModalProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}/reset-password`, { method: 'PATCH' })
      const body = await res.json() as { error?: string }

      if (!res.ok) {
        if (res.status === 401) { router.push('/login'); return }
        if (res.status === 403) { router.push('/forbidden'); return }
        if (res.status === 404) { router.push('/not-found'); return }
        message.error(body.error ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.')
        return
      }

      message.success(`Đã reset mật khẩu. Mật khẩu tạm thời mới đã được gửi đến ${userEmail}.`)
      onSuccess()
      onClose()
    } catch {
      message.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Reset mật khẩu"
      open={open}
      onCancel={onClose}
      onOk={handleConfirm}
      okText="Xác nhận reset"
      okButtonProps={{ danger: true }}
      cancelText="Hủy"
      confirmLoading={loading}
      width={440}
    >
      <Text>
        Bạn có chắc muốn reset mật khẩu của <strong>{userEmail}</strong>?
        Mật khẩu tạm thời mới sẽ được gửi đến email của họ.
      </Text>
    </Modal>
  )
}
