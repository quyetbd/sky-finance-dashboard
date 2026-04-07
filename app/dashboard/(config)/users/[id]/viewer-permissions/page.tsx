'use client'

import React, { useEffect } from 'react'
import { Typography, Breadcrumb } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { ViewerPermissionForm } from '@/app/components/users/ViewerPermissionForm'

const { Title } = Typography

interface PageProps {
  params: { id: string }
}

export default function ViewerPermissionsPage({ params }: PageProps) {
  const router = useRouter()
  const { isFC, isLoading: authLoading } = useAuth()

  // Client-side guard
  useEffect(() => {
    if (!authLoading && !isFC) {
      router.replace('/forbidden')
    }
  }, [authLoading, isFC, router])

  if (authLoading || !isFC) return null

  return (
    <div>
      <Breadcrumb
        style={{ marginBottom: 16, fontSize: 13 }}
        items={[
          { title: <Link href="/dashboard/users">Quản lý User</Link> },
          { title: 'Gán quyền Viewer' },
        ]}
      />

      <Title level={4} style={{ marginBottom: 24 }}>
        Gán quyền Viewer
      </Title>

      <ViewerPermissionForm userId={params.id} />
    </div>
  )
}
