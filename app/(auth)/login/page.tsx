'use client'

import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, Alert, Space } from 'antd'
import { LockOutlined, MailOutlined, LineChartOutlined } from '@ant-design/icons'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { firebaseAuth } from '@/lib/firebase-client'

const { Title, Text } = Typography

interface LoginForm {
  email:    string
  password: string
}

export default function LoginPage() {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const onSubmit = async (values: LoginForm) => {
    setLoading(true)
    setError(null)

    try {
      // 1. Firebase client auth — lấy ID token
      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        values.email,
        values.password,
      )
      const idToken = await credential.user.getIdToken()

      // 2. Truyền token cho NextAuth — tạo session
      const result = await signIn('firebase', {
        idToken,
        redirect: false,
      })

      if (result?.error) {
        setError('Email hoặc mật khẩu không đúng, hoặc tài khoản chưa được cấp quyền.')
        return
      }

      // 3. Chuyển về dashboard
      router.push('/dashboard/reports/profit')
      router.refresh()
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      if (
        firebaseError.code === 'auth/invalid-credential' ||
        firebaseError.code === 'auth/user-not-found' ||
        firebaseError.code === 'auth/wrong-password'
      ) {
        setError('Email hoặc mật khẩu không đúng.')
      } else if (firebaseError.code === 'auth/too-many-requests') {
        setError('Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau.')
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card
      style={{
        width:        400,
        borderRadius: 12,
        boxShadow:    '0 4px 24px rgba(0,0,0,0.10)',
      }}
      styles={{ body: { padding: '40px 40px 32px' } }}
    >
      {/* Logo + Brand */}
      <Space orientation="vertical" align="center" style={{ width: '100%', marginBottom: 32 }}>
        <div
          style={{
            width:        48,
            height:       48,
            borderRadius: 12,
            background:   '#1d4ed8',
            display:      'flex',
            alignItems:   'center',
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
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
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
            { type: 'email',  message: 'Email không hợp lệ' },
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
            block
            style={{ height: 44, borderRadius: 8, fontWeight: 600 }}
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <Text
        style={{
          display:   'block',
          textAlign: 'center',
          marginTop: 24,
          fontSize:  12,
          color:     '#9ca3af',
        }}
      >
        Liên hệ Admin để được cấp tài khoản
      </Text>
    </Card>
  )
}
