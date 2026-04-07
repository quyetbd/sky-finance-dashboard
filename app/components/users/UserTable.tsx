'use client'

import React, { useState } from 'react'
import { Table, Tag, Button, Space, Tooltip, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRouter } from 'next/navigation'
import type { Role } from '@/lib/auth/types'
import { ResetPasswordModal } from './ResetPasswordModal'

export interface UserRow {
  id: string
  email: string
  role: Role
  allowedComcodes: string[]
  isActive: boolean
  mustChangePassword: boolean
  createdAt: string
}

interface UserTableProps {
  users: UserRow[]
  loading: boolean
  onRefresh: () => void
}

const ROLE_COLORS: Record<Role, string> = {
  FC: 'purple',
  Accountant: 'blue',
  Director: 'green',
  Viewer: 'default',
}

const MAX_VISIBLE_COMCODES = 3

function ComcodePills({ comcodes }: { comcodes: string[] }) {
  const visible = comcodes.slice(0, MAX_VISIBLE_COMCODES)
  const extra = comcodes.length - MAX_VISIBLE_COMCODES
  return (
    <Space size={4} wrap>
      {visible.map((c) => (
        <Tag key={c} style={{ margin: 0 }}>{c}</Tag>
      ))}
      {extra > 0 && (
        <Tooltip title={comcodes.slice(MAX_VISIBLE_COMCODES).join(', ')}>
          <Tag style={{ margin: 0, cursor: 'default' }}>+{extra} more</Tag>
        </Tooltip>
      )}
    </Space>
  )
}

export function UserTable({ users, loading, onRefresh }: UserTableProps) {
  const router = useRouter()
  const [resetModal, setResetModal] = useState<{ userId: string; email: string } | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleToggleActive = async (user: UserRow) => {
    setTogglingId(user.id)
    try {
      const res = await fetch(`/api/users/${user.id}/deactivate`, { method: 'PATCH' })
      const body = await res.json() as { error?: string }

      if (!res.ok) {
        if (res.status === 401) { router.push('/login'); return }
        if (res.status === 403) { router.push('/forbidden'); return }
        message.error(body.error ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.')
        return
      }

      message.success(
        user.isActive
          ? `Đã vô hiệu hóa tài khoản ${user.email}`
          : `Đã kích hoạt tài khoản ${user.email}`
      )
      onRefresh()
    } catch {
      message.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setTogglingId(null)
    }
  }

  const columns: ColumnsType<UserRow> = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ellipsis: true,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: Role) => (
        <Tag color={ROLE_COLORS[role]}>{role}</Tag>
      ),
    },
    {
      title: 'Comcode',
      dataIndex: 'allowedComcodes',
      key: 'allowedComcodes',
      render: (comcodes: string[]) => <ComcodePills comcodes={comcodes} />,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 140,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'error'}>
          {isActive ? 'Hoạt động' : 'Đã vô hiệu hóa'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 260,
      render: (_, record) => (
        <Space size={4}>
          <Button
            size="small"
            onClick={() => setResetModal({ userId: record.id, email: record.email })}
          >
            Reset mật khẩu
          </Button>

          {record.role === 'Viewer' && (
            <Button
              size="small"
              type="default"
              onClick={() => router.push(`/dashboard/users/${record.id}/viewer-permissions`)}
            >
              Gán quyền
            </Button>
          )}

          <Button
            size="small"
            danger={record.isActive}
            loading={togglingId === record.id}
            onClick={() => handleToggleActive(record)}
          >
            {record.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20, showSizeChanger: false }}
        size="middle"
      />

      {resetModal && (
        <ResetPasswordModal
          open={!!resetModal}
          userId={resetModal.userId}
          userEmail={resetModal.email}
          onClose={() => setResetModal(null)}
          onSuccess={onRefresh}
        />
      )}
    </>
  )
}
