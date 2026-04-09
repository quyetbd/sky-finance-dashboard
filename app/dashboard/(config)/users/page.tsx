'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Button, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { UserTable, type UserRow } from '@/app/components/users/UserTable'
import { CreateUserModal } from '@/app/components/users/CreateUserModal'

const { Title } = Typography

export default function UsersPage() {
  const router = useRouter()
  const { isFC, isLoading: authLoading } = useAuth()
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)

  // Client-side guard — middleware already guards server-side
  useEffect(() => {
    if (!authLoading && !isFC) {
      router.replace('/forbidden')
    }
  }, [authLoading, isFC, router])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      if (res.status === 401) { router.replace('/login'); return }
      if (res.status === 403) { router.replace('/forbidden'); return }
      const body = await res.json() as { data?: UserRow[] }
      setUsers(body.data ?? [])
    } catch {
      // leave empty; table shows no data
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (!authLoading && isFC) {
      void fetchUsers()
    }
  }, [authLoading, isFC, fetchUsers])

  if (authLoading || !isFC) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>Quản lý User</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
        >
          Tạo user mới
        </Button>
      </div>

      <UserTable users={users} loading={loading} onRefresh={fetchUsers} />

      <CreateUserModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={fetchUsers}
      />
    </div>
  )
}
