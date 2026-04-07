'use client'

import React, { useState } from 'react'
import { Form, Input, Button, Alert, Typography } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'

const { Text } = Typography

const PASSWORD_HINT = 'Tối thiểu 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt'

interface FormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

function validateStrength(pw: string): string | null {
  if (pw.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự'
  if (!/[A-Z]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 chữ hoa'
  if (!/\d/.test(pw)) return 'Mật khẩu phải có ít nhất 1 số'
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'
  return null
}

export function ChangePasswordForm() {
  const router = useRouter()
  const { updateSession } = useAuth()
  const [form] = Form.useForm<FormValues>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: FormValues) => {
    const strengthErr = validateStrength(values.newPassword)
    if (strengthErr) {
      setError(strengthErr)
      return
    }
    if (values.newPassword !== values.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      })

      const body = await res.json() as { data?: { success: boolean }; error?: string }

      if (!res.ok) {
        if (res.status === 401) {
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.')
          return
        }
        setError(body.error ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.')
        return
      }

      // Refresh session to clear mustChangePassword flag
      await updateSession()
      router.push('/dashboard/profit')
    } catch {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 20, borderRadius: 8 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
        size="large"
      >
        <Form.Item
          name="currentPassword"
          label="Mật khẩu hiện tại"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Form.Item>
        <Text style={{ fontSize: 12, color: '#6b7280', display: 'block', marginTop: -16, marginBottom: 16 }}>
          {PASSWORD_HINT}
        </Text>

        <Form.Item
          name="confirmPassword"
          label="Xác nhận mật khẩu mới"
          rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu mới' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
            placeholder="••••••••"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
            block
            style={{ height: 44, borderRadius: 8, fontWeight: 600 }}
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
