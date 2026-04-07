'use client'

import React from 'react'
import { Card, Typography, Space, Alert } from 'antd'
import { LockOutlined, LineChartOutlined } from '@ant-design/icons'
import { ChangePasswordForm } from '@/app/components/auth/ChangePasswordForm'

const { Title, Text } = Typography

export default function ChangePasswordPage() {
  return (
    <Card
      style={{
        width: 440,
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
      }}
      styles={{ body: { padding: '40px 40px 32px' } }}
    >
      {/* Logo + Brand */}
      <Space direction="vertical" align="center" style={{ width: '100%', marginBottom: 24 }}>
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
      </Space>

      <Alert
        icon={<LockOutlined />}
        message="Bạn đang dùng mật khẩu tạm thời. Vui lòng đổi mật khẩu trước khi tiếp tục."
        type="warning"
        showIcon
        style={{ marginBottom: 24, borderRadius: 8 }}
      />

      <ChangePasswordForm />

      <Text
        style={{
          display: 'block',
          textAlign: 'center',
          marginTop: 16,
          fontSize: 12,
          color: '#9ca3af',
        }}
      >
        Liên hệ FC nếu bạn gặp sự cố.
      </Text>
    </Card>
  )
}
