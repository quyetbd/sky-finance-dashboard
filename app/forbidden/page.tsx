import React from 'react'
import Link from 'next/link'
import { Button, Result } from 'antd'

export default function ForbiddenPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f0f2f5',
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập trang này."
        extra={
          <Link href="/dashboard">
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
      />
    </div>
  )
}
