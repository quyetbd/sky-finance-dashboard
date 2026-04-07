'use client'

import React, { useEffect, useState } from 'react'
import { Checkbox, Typography, Button, message, Spin } from 'antd'
import { useRouter } from 'next/navigation'

const { Title, Text } = Typography

interface Company {
  id: string
  name: string
}

interface PermissionEntry {
  comcode: string
  reportKey: string
}

const REPORTS: { key: string; label: string }[] = [
  { key: 'profit', label: 'Profit report' },
  { key: 'final', label: 'Final report' },
  { key: 'dispute', label: 'Dispute report' },
  { key: 'reserve_hold', label: 'Reserve Hold report' },
  { key: 'by_market', label: 'By Market report' },
  { key: 'custom', label: 'Custom report' },
  { key: 'cashflow', label: 'Cash Flow Forecast' },
]

interface ViewerPermissionFormProps {
  userId: string
}

export function ViewerPermissionForm({ userId }: ViewerPermissionFormProps) {
  const router = useRouter()
  const [companies, setCompanies] = useState<Company[]>([])
  const [selectedComcodes, setSelectedComcodes] = useState<string[]>([])
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [companiesRes, permissionsRes] = await Promise.all([
          fetch('/api/companies'),
          fetch(`/api/users/${userId}/viewer-permissions`),
        ])

        if (permissionsRes.status === 401) { router.replace('/login'); return }
        if (permissionsRes.status === 403) { router.replace('/forbidden'); return }
        if (permissionsRes.status === 404) { router.replace('/not-found'); return }

        const companiesBody = await companiesRes.json() as { data?: Company[] }
        const permissionsBody = await permissionsRes.json() as { data?: PermissionEntry[] }

        const companiesList = companiesBody.data ?? []
        const existingPermissions = permissionsBody.data ?? []

        setCompanies(companiesList)

        // Pre-check existing permissions
        const comcodes = [...new Set(existingPermissions.map((p) => p.comcode))]
        const reports = [...new Set(existingPermissions.map((p) => p.reportKey))]
        setSelectedComcodes(comcodes)
        setSelectedReports(reports)
      } catch {
        message.error('Không thể tải dữ liệu. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [userId])

  const totalPermissions = selectedComcodes.length * selectedReports.length

  const handleSave = async () => {
    const permissions: PermissionEntry[] = []
    for (const comcode of selectedComcodes) {
      for (const reportKey of selectedReports) {
        permissions.push({ comcode, reportKey })
      }
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/users/${userId}/viewer-permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions }),
      })
      const body = await res.json() as { error?: string }

      if (!res.ok) {
        if (res.status === 401) { router.push('/login'); return }
        if (res.status === 403) { router.push('/forbidden'); return }
        message.error(body.error ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.')
        return
      }

      message.success('Đã lưu quyền thành công')
      router.push('/dashboard/users')
    } catch {
      message.error('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
        {/* Left column — Comcodes */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>Chọn Comcode</Title>
          <Checkbox.Group
            value={selectedComcodes}
            onChange={(vals) => setSelectedComcodes(vals as string[])}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {companies.map((c) => (
              <Checkbox key={c.id} value={c.id}>
                {c.id} — {c.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        {/* Right column — Reports */}
        <div>
          <Title level={5} style={{ marginBottom: 16 }}>Chọn Report</Title>
          <Checkbox.Group
            value={selectedReports}
            onChange={(vals) => setSelectedReports(vals as string[])}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {REPORTS.map((r) => (
              <Checkbox key={r.key} value={r.key}>
                {r.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #f0f0f0',
          paddingTop: 20,
        }}
      >
        <Text type="secondary">
          {totalPermissions > 0
            ? `${totalPermissions} quyền sẽ được lưu`
            : 'Chưa chọn quyền nào'}
        </Text>
        <Button
          type="primary"
          onClick={handleSave}
          loading={saving}
          disabled={saving}
        >
          Lưu quyền
        </Button>
      </div>
    </div>
  )
}
