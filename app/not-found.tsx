import React from 'react'
import Link from 'next/link'
import { Button, Result } from 'antd'

export default function NotFound() {
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
        status="404"
        title="404"
        subTitle="Trang bạn tìm kiếm không tồn tại."
        extra={
          <Link href="/dashboard">
            <Button type="primary">Về trang chủ</Button>
          </Link>
        }
      />
    </div>
  )
}
