'use client'

import React, { useEffect, useState } from 'react'
import { Modal, Form, Input, Select, Checkbox, Typography, message } from 'antd'
import { useRouter } from 'next/navigation'
import type { Role } from '@/lib/auth/types'

const { Text } = Typography

interface Company {
  id: string
  name: string
}

interface CreateUserModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const ROLES: { value: Role; label: string }[] = [
  { value: 'FC', label: 'FC' },
  { value: 'Accountant', label: 'Accountant' },
  { value: 'Director', label: 'Director' },
  { value: 'Viewer', label: 'Viewer' },
]

interface FormValues {
  email: string
  role: Role
  allowedComcodes: string[]
}

export function CreateUserModal({ open, onClose, onSuccess }: CreateUserModalProps) {
  const router = useRouter()
  const [form] = Form.useForm<FormValues>()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const selectedRole = Form.useWatch('role', form)

  useEffect(() => {
    if (!open) return
    fetch('/api/companies')
      .then((r) => r.json())
      .then((body: { data?: Company[] }) => setCompanies(body.data ?? []))
      .catch(() => setCompanies([]))
  }, [open])

  const handleSubmit = async (values: FormValues) => {
    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const body = await res.json() as { data?: { email: string }; error?: string }

      if (!res.ok) {
        if (res.status === 401) { router.push('/login'); return }
        if (res.status === 403) { router.push('/forbidden'); return }
        message.error(body.error ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.')
        return
      }

      message.success(
        `Đã tạo tài khoản. Mật khẩu tạm thời đã được gửi đến ${values.email}.`
      )
      form.resetFields()
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
      title="Tạo user mới"
      open={open}
      onCancel={() => { form.resetFields(); onClose() }}
      onOk={() => form.submit()}
      okText="Tạo"
      cancelText="Hủy"
      confirmLoading={loading}
      width={480}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ marginTop: 16 }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input placeholder="user@bettamax.com" />
        </Form.Item>

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: 'Vui lòng chọn role' }]}
        >
          <Select placeholder="Chọn role" options={ROLES} />
        </Form.Item>

        {selectedRole === 'Viewer' && (
          <Text
            type="secondary"
            style={{ display: 'block', fontSize: 12, marginTop: -8, marginBottom: 12 }}
          >
            Sau khi tạo, vào &quot;Gán quyền&quot; để cấu hình report cho Viewer này.
          </Text>
        )}

        <Form.Item
          name="allowedComcodes"
          label="Comcode"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất 1 comcode' }]}
        >
          <Checkbox.Group
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            options={companies.map((c) => ({ label: `${c.id} — ${c.name}`, value: c.id }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
