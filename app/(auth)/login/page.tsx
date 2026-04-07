'use client'

import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd'
import { LockOutlined, MailOutlined, LineChartOutlined } from '@ant-design/icons'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const { Title, Text } = Typography

interface LoginFormValues {
  email: string
  password: string
}

function parseLoginError(error: string): string {
  // Account locked — message format: "Account locked until <ISO date>"
  if (error.includes('Account locked until') || error === 'AccountLocked') {
    try {
      const isoMatch = error.match(/until (.+)$/)
      if (isoMatch) {
        const lockedUntil = new Date(isoMatch[1])
        const diffMs = lockedUntil.getTime() - Date.now()
        const diffMins = Math.max(1, Math.ceil(diffMs / 60000))
        return `Tài khoản tạm thời bị khóa. Thử lại sau ${diffMins} phút hoặc liên hệ FC.`
      }
    } catch {
      // fall through
    }
    return 'Tài khoản tạm thời bị khóa. Vui lòng liên hệ FC để được hỗ trợ.'
  }

  // Remaining attempts — message: "Invalid credentials. X attempt(s) remaining before lockout"
  const remainingMatch = error.match(/(\d+)\s+attempt/)
  if (remainingMatch) {
    return `Email hoặc mật khẩu không đúng. Còn ${remainingMatch[1]} lần thử.`
  }

  return 'Email hoặc mật khẩu không đúng.'
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true)
    setError(null)

    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })

    setLoading(false)

    if (!result) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
      return
    }

    if (result.error) {
      setError(parseLoginError(result.error))
      return
    }

    // Middleware will redirect to /change-password if mustChangePassword is true
    router.push('/dashboard/profit')
    router.refresh()
  }

  return (
    <Card
      style={{
        width: 400,
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      }}
      styles={{ body: { padding: '40px 40px 32px' } }}
    >
      {/* Logo + Brand */}
      <Space orientation="vertical" align="center" style={{ width: '100%', marginBottom: 32 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#1d4ed8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LineChartOutlined style={{ fontSize: 24, color: '#fff' }} />
        </div>
        <Title level={4} style={{ margin: 0, color: '#111827' }}>
          BTM Finance System
        </Title>
        <Text style={{ color: '#6b7280', fontSize: 13 }}>
          Đăng nhập vào hệ thống
        </Text>
      </Space>

      {error && (
        <Alert
          title={error}
          type="error"
          showIcon
          style={{ marginBottom: 20, borderRadius: 8 }}
        />
      )}

      <Form
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
        size="large"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input
            prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
            placeholder="you@bettamax.com"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
            placeholder="••••••••"
            autoComplete="current-password"
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
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Text
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: 24,
          fontSize: 12,
          color: '#9ca3af',
        }}
      >
        Quên mật khẩu? Liên hệ FC để được hỗ trợ.
      </Text>
    </Card>
  )
}
