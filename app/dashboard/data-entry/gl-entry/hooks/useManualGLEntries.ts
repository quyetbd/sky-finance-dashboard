'use client'

import { useState, useCallback } from 'react'
import { apiClient, ApiError } from '@/lib/api-client'
import type { ManualGLPair, CreateManualGLPayload } from '@/lib/types'

export type ManualGLFilter = {
  comcode: string
  period: string
  glStatus: string // 'all' | 'Draft' | 'Posted'
}

export function useManualGLEntries() {
  const [data, setData] = useState<ManualGLPair[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEntries = useCallback(async (filter: ManualGLFilter) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filter.comcode && filter.comcode !== 'all') params.set('comcode', filter.comcode)
      if (filter.period) params.set('period', filter.period)
      if (filter.glStatus && filter.glStatus !== 'all') params.set('glStatus', filter.glStatus)

      const res = await apiClient.get<ManualGLPair[]>(`/api/gl/entry?${params.toString()}`)
      setData(res.data ?? [])
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const createEntry = useCallback(async (payload: CreateManualGLPayload): Promise<void> => {
    await apiClient.post('/api/gl/entry', payload)
  }, [])

  const updateEntry = useCallback(async (docNum: string, payload: Partial<CreateManualGLPayload>): Promise<void> => {
    await apiClient.put(`/api/gl/entry/${encodeURIComponent(docNum)}`, payload)
  }, [])

  const deleteEntry = useCallback(async (docNum: string, comcode: string): Promise<void> => {
    await apiClient.delete(`/api/gl/entry/${encodeURIComponent(docNum)}?comcode=${encodeURIComponent(comcode)}`)
  }, [])

  const postEntries = useCallback(async (uids: string[]): Promise<number> => {
    const res = await apiClient.post<{ uids: string[] }, { posted: number }>(
      '/api/gl/post',
      { uids }
    )
    return res.data?.posted ?? 0
  }, [])

  const reverseEntries = useCallback(async (uids: string[], reversalDate?: string): Promise<void> => {
    await apiClient.post('/api/gl/reverse', { uids, reversalDate })
  }, [])

  return {
    data,
    loading,
    error,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    postEntries,
    reverseEntries,
  }
}
